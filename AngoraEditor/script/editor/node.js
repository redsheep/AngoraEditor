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
	create : function (type) {
		var nodeID='{0}{1}'.format(type,this.count++);
		while(this.get(nodeID)!=null)
			nodeID='{0}{1}'.format(type,this.count++);
		var node = {
			'id':nodeID,
			'type':type,
			'visible':'true'
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
		this.initNode(node);
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
	/*
	updatenode:function(treenode,zindex){
		var id=treenode.id;
		var node=this.get(id);
		if(node.type=='group'&& typeof treenode.children!='undefined'){
			for(i in treenode.children){
				updatenode(treenode.children[i],zindex);
			}
		}else{
			this.editor.ui.gamePane.updateZOrder(node,zindex);
		}
	},
	updateOrder : function (treenode) {
		var reorder={};
		for (i in treenode){
			var id=treenode[i].id;
			reorder[id]=this.nodes[id];
		}
		this.nodes=reorder;
		this.editor.scene.isNodeChanged=true;
	},
	*/	
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
		var x=this.setAttr('x',node.x);//editor.attr.getDefault('x');
		var y=this.setAttr('y',node.y);
		var width=this.setAttr('width',node.width);
		var height=this.setAttr('height',node.height);
		var scaleX=this.setAttr('scaleX',node.scaleX);
		var scaleY=this.setAttr('scaleY',node.scaleY);
		var anchorX=this.setAttr('anchorX',node.anchorX);
		var anchorY=this.setAttr('anchorY',node.anchorY);
		var rotation=this.setAttr('rotation',node.rotaion);
		var volume=this.setAttr('volume',node.volume);
		var fontsize=this.setAttr('fontSize',node.fontSize);
		var atlasWidth=this.setAttr('atlasWidth',node.atlasWidth);
		var atlasHeight=this.setAttr('atlasHeight',node.atlasHeight);
		var physics=this.setAttr('physics',node.physics);
		var dynamic=this.setAttr('dynamic',node.dynamic);
		var body=this.setAttr('body',node.body);
		var mass=this.setAttr('mass',node.mass);
		var fixedRotation=this.setAttr('fixedRotation',node.fixedRotation);
		var image=this.setAttr('image',node.image);
		var animations=this.setAttr('animations',node.animations);
		var delay=this.setAttr('delay',node.delay);
		var maxParticles=this.setAttr('maxParticles',node.maxParticles);
		var lifespan=this.setAttr('lifespan',node.lifespan);
		var gravity=this.setAttr('gravity',node.gravity);
		var frequency=this.setAttr('frequency',node.frequency);
		var alpha=this.setAttr('alpha',node.alpha);
		var angle=this.setAttr('angle',node.angle);
		var minspeedX=this.setAttr('minspeedX',node.minspeedX);
		var maxspeedX=this.setAttr('maxspeedX',node.maxspeedX);
		var minspeedY=this.setAttr('minspeedY',node.minspeedY);
		var maxspeedY=this.setAttr('maxspeedY',node.maxspeedY);
		switch(node.type){
			case 'image':
			case 'sprite':
			case 'tilesprite':
			case 'animate':
				node['x']=x;
				node['y']=y;
				node['width']=width;
				node['height']=height;
				node['image']=image;
				if(node.type=='animate')
					node['animations']=animations;
				else if(node.type=='sprite')
					node['frame']=0;
				node['scaleX']=scaleX;
				node['scaleY']=scaleY;
				node['anchorX']=anchorX;
				node['anchorY']=anchorY;
				node['rotation']=rotation;
				if(node.type!='image'){
					node['physics']=physics;
					node['dynamic']=dynamic;
					node['body']=body;
					node['mass']=mass;
					node['fixedRotation']=fixedRotation;
				}
				break;
			case 'group':
				node['x']=x;
				node['y']=y;
				node['physics']=physics;
				break;
			case 'bitmapdata':
				node['width']=width;
				node['height']=height;
				break;
			case 'spritebatch':
			case 'physicsgroup':
			case 'graphics':
				node['x']=x;
				node['y']=y;
				break;
			case 'camera':
				node['x']=x;
				node['y']=y;
				node['width']=width;
				node['height']=height;
				node['follow']='';
				break;
			case 'audio':
				node['audio']='none';
				node['tracks']='none';
				delete node['visible'];
				break;
			case 'text':
				node['x']=x;
				node['y']=y;
				node['text']='text';
				node['fontFamily']='Arial';
				node['fontSize']='32';
				node['fontColor']='#ffffff';
				node['textAlign']='center';
				break;
			case 'bitmaptext':
				node['x']=x;
				node['y']=y;
				node['font']='';
				node['text']='text';
				node['fontSize']='32';
				break;
			case 'button':
				node['x']=x;
				node['y']=y;
				node['width']=width;
				node['height']=height;
				node['image']=image;
				node['frame']=0;
				node['scaleX']=scaleX;
				node['scaleY']=scaleY;
				node['rotation']=rotation;
				//node['callback']=callback;
				break;
			case 'tilemap':
				node['tileW']=32;
				node['tileH']=32;
				node['tilesetW']=32;
				node['tilesetH']=32;
				node['tilemap']='';
				break;
			case 'particle':
				node['x']=x;
				node['y']=y;
				node['alpha']=alpha;
				node['rotation']=rotation;
				node['maxParticles']=maxParticles;
				node['frequency']=frequency;
				node['lifespan']=lifespan;
				node['gravity']=gravity;
				node['minspeedX']=minspeedX;
				node['maxspeedX']=maxspeedX;
				node['minspeedY']=minspeedY;
				node['maxspeedY']=maxspeedY;
				break;
			case 'timer':
				node['delay']=delay;
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
