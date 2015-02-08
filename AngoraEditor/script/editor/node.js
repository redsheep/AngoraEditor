/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.NodeManager constructor
 *
 * Instantiate <code>AngoraEditor.NodeManager</code> object.
 * @class AngoraEditor.NodeManager
 * @classdesc
 * @constructor
 */
AngoraEditor.NodeManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Object} - nodes of selected scene
	 */
	this.nodes = {};
	/**
	 * @property {Object} - lock state of nodes
	 */
	this.locked={};
	/**
	 * @property {Object} - selected node
	 */
	this.selected = null;
	/**
	 * @property {number}
	 */
	this.count = 0;
}
AngoraEditor.NodeManager.prototype = {
	/**
	* create and init node attribute
	* @method create
	* @param {string} type
	*/
	create : function (type,cls) {
		var nodeID='{0}{1}'.format(type,this.count++);
		while(this.get(nodeID)!=null)
			nodeID='{0}{1}'.format(type,this.count++);
		var node = {
			'id':nodeID,
			'type':type,
			'visible':'true'
		}
		if(type==='custom'){
			node.clsname=cls.clsname;
			node.basecls=cls.basecls;
		}
		this.initNode(node);
		return node;
	},
	/**
	* load nodes from json
	* @method setData
	* @param {Object} data
	*/
	setData : function (data) {
		this.nodes=data;
	},
	_insert: function(node,target,position,insert){
		var reorder={};
		for(i in node){
			if(node[i].id==target){
				if(position=='top'){
					reorder[insert.id]=insert;
					reorder[i]=node[i];
				}else{
					reorder[i]=node[i];
					reorder[insert.id]=insert;
				}
			}else{
				reorder[i]=node[i];
			}
		}
		return reorder;
	},
	_remove: function(node,id){
		for(i in node){
			if(node[i].id==id){
				return delete node[i];
			}else if(typeof node[i].children!=='undefined'){
				this._remove(node[i].children,id);
			}
		}
	},
	_find: function(node,id){
		for(i in node){
			if(node[i].id==id){
				return node[i];
			}else if(typeof node[i].children!=='undefined'){
				var n = this._find(node[i].children,id);
				if(n!=null)return n;
			}
		}
		return null;
	},
	_parent:function(node,id,parent){
		for(i in node){
			if(node[i].id==id){
				return parent;
			}else if(typeof node[i].children!=='undefined'){
				var n = this._parent(node[i].children,id,node[i]);
				if(n!=null)return n;
			}
		}
		return null;
	},
	getParent:function(nodeID){
		return this._parent(this.nodes,nodeID,null);
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	get : function (nodeID) {
		return this._find(this.nodes,nodeID);
	},
	/**
	* select node by id
	* @method select
	* @param {string} id
	*/
	select : function (nodeID) {
		this.selected = this.get(nodeID);
	},
	/**
	* add node to node manager
	* @method add
	* @param {Object} node
	*/
	add : function (node) {
		//if(this.selected!=null){
		//	node.group=this.selected.id;
		//}
		//this.initNode(node);
		this.nodes[node.id] = node;
		//this.editor.ui.nodeTree.addNode(node);
		//this.editor.ui.gamepane.addNode(node);
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* remove a node from node manager
	* @method remove
	* @param {Object} node
	*/
	remove : function (nodeID) {
		//this.editor.ui.nodeTree.remove(item);
		this._remove(this.nodes,nodeID);
		this.editor.scene.isNodeChanged=true;
	},
	addToGroup:function(id,group){
		var node=this.get(group);
		if(typeof node.children==='undefined')
			node.children={};
		var oldnode=this.get(id);
		this.remove(oldnode.id);
		node.children[oldnode.id]=oldnode;
		this.editor.scene.isNodeChanged=true;
	},
	checkGroup:function(id,target,position){
		var node=this.get(id);
		this.remove(id);
		var parent=this.getParent(target);
		if(parent!=null)
			parent.children=this._insert(parent.children,target,position,node);
		else
			this.nodes=this._insert(this.nodes,target,position,node);
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* create a clone node
	* @method clone
	* @param {Object} node - source node
	*/	
	clone : function(node){
		var newnode={};
		var nodeID='{0}{1}'.format(node.type,this.count++);
		while(this.get(nodeID)!=null)
			nodeID='{0}{1}'.format(node.type,this.count++);
		for(key in node){
			newnode[key]=node[key];
		}
		newnode['id']=nodeID;
		return newnode;
	},
	/**
	* change id of object
	* @method changeID
	* @param {string} oldid
	* @param {string} newid
	*/
	changeID: function(oldID,newID){
		if(oldID==newID)return;
		var newnode=this.get(oldID);
		var parent=this.getParent(oldID);
		if(parent!=null)
			parent.children[newID]=newnode;
		else
			this.nodes[newID]=newnode;
		this.remove(oldID);
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* set the node attribute
	* @method setAttr
	* @param {string} attr
	* @param {string} value
	*/
	setAttr : function(attr,value){
		if(typeof value==='undefined'){
			value=this.editor.attr.getDefault(attr);
		}
		return value;
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* init the node attribute
	* @method initNode
	* @param {Object} node
	*/
	initNode : function(node){
		var editor=this.editor;
		var type=node.type;
		if(node.type==='custom')
			type=node.basecls.toLowerCase();
		switch(type){
			case 'image':
			case 'sprite':
			case 'tilesprite':
			case 'animate':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['width']=this.setAttr('width',node.width);
				node['height']=this.setAttr('height',node.height);
				node['image']=this.setAttr('image',node.image);
				if(node.type=='animate')
					node['animations']=this.setAttr('animations',node.animations);
				else if(node.type=='sprite')
					node['frame']=this.setAttr('frame',node.frame);
				node['scaleX']=this.setAttr('scaleX',node.scaleX);
				node['scaleY']=this.setAttr('scaleY',node.scaleY);
				node['anchorX']=this.setAttr('anchorX',node.anchorX);
				node['anchorY']=this.setAttr('anchorY',node.anchorY);
				node['rotation']=this.setAttr('rotation',node.rotaion);
				if(node.type!='image'){
					node['physics']=this.setAttr('physics',node.physics);
					node['dynamic']=this.setAttr('dynamic',node.dynamic);
					node['body']=this.setAttr('body',node.body);
					node['mass']=this.setAttr('mass',node.mass);
					node['fixedRotation']=this.setAttr('fixedRotation',node.fixedRotation);
				}
				break;
			case 'group':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['physics']=this.setAttr('physics',node.physics);
				break;
			case 'bitmapdata':
				node['width']=this.setAttr('width',node.width);
				node['height']=this.setAttr('height',node.height);
				break;
			case 'spritebatch':
			case 'physicsgroup':
			case 'graphics':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				break;
			case 'camera':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['width']=this.setAttr('width',node.width);
				node['height']=this.setAttr('height',node.height);
				node['follow']=this.setAttr('follow',node.follow);
				break;
			case 'audio':
				node['audio']=this.setAttr('audio',node.audio);
				node['tracks']=this.setAttr('tracks',node.tracks);
				delete node['visible'];
				break;
			case 'text':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['text']=this.setAttr('text',node.text);
				node['fontFamily']=this.setAttr('fontFamily',node.fontFamily);
				node['fontSize']=this.setAttr('fontSize',node.fontSize);
				node['fontColor']=this.setAttr('fontColor',node.fontColor);
				node['textAlign']=this.setAttr('textAlign',node.textAlign);
				break;
			case 'bitmaptext':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['font']=this.setAttr('font',node.font);
				node['text']=this.setAttr('text',node.text);
				node['fontSize']=this.setAttr('fontSize',node.fontSize);
				break;
			case 'button':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['width']=this.setAttr('width',node.width);
				node['height']=this.setAttr('height',node.height);
				node['image']=this.setAttr('image',node.image);
				node['frame']=this.setAttr('frame',node.frame);
				node['scaleX']=this.setAttr('scaleX',node.scaleX);
				node['scaleY']=this.setAttr('scaleY',node.scaleY);
				node['rotation']=this.setAttr('rotation',node.rotaion);
				//node['callback']=callback;
				break;
			case 'tilemap':
				node['tileW']=this.setAttr('tileW',node.tileW);
				node['tileH']=this.setAttr('tileH',node.tileH);
				node['tilesetW']=this.setAttr('tilesetW',node.tilesetW);
				node['tilesetH']=this.setAttr('tilesetH',node.tilesetH);
				node['tilemap']=this.setAttr('tilemap',node.tilemap);
				break;
			case 'particle':
				node['x']=this.setAttr('x',node.x);
				node['y']=this.setAttr('y',node.y);
				node['alpha']=this.setAttr('alpha',node.alpha);
				node['rotation']=this.setAttr('rotation',node.rotaion);
				node['maxParticles']=this.setAttr('maxParticles',node.maxParticles);
				node['frequency']=this.setAttr('frequency',node.frequency);
				node['lifespan']=this.setAttr('lifespan',node.lifespan);
				node['gravity']=this.setAttr('gravity',node.gravity);
				node['minspeedX']=this.setAttr('minspeedX',node.minspeedX);
				node['maxspeedX']=this.setAttr('maxspeedX',node.maxspeedX);
				node['minspeedY']=this.setAttr('minspeedY',node.minspeedY);
				node['maxspeedY']=this.setAttr('maxspeedY',node.maxspeedY);
				break;
			case 'timer':
				node['delay']=this.setAttr('delay',node.delay);
				break;
			default:
				break;
		}
	},
	/**
	* clear the nodes
	* @method clear
	* @param 
	*/
	clear : function () {
		this.nodes = {};
		this.locked = {};
		this.selected = null;
	}
}
AngoraEditor.NodeManager.prototype.constructor = AngoraEditor.NodeManager;
