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
		while(typeof this.nodes[nodeID]!='undefined')
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
		this.nodes = data;
	},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	get : function (nodeID) {
		return this.nodes[nodeID];
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
	remove : function (node) {
		//this.editor.ui.nodeTree.remove(item);
		delete this.nodes[node.id];
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* reorder the nodes
	* @method update
	* @param {Object} treenode
	*/
	update : function (treenode) {
		var reorder={};
		for (i in treenode){
			var id=treenode[i].id
			reorder[id]=this.nodes[id];
			this.editor.ui.gamePane.updateZOrder(this.nodes[id],i);
		}
		this.nodes=reorder;
		this.editor.scene.isNodeChanged=true;
	},
	/**
	* create a clone node
	* @method clone
	* @param {Object} node - source node
	*/	
	clone : function(node){
		var newnode={};
		this.count++;
		for(key in node){
			newnode[key]=node[key];
		}
		newnode['id']='{0}{1}'.format(node.type,this.count);
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
		this.nodes[newID]=this.nodes[oldID];
		delete this.nodes[oldID];
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
		var maxparicles=this.setAttr('maxparicles',node.maxparicles);
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
				node['maxparicles']=maxparicles;
				node['lifespan']=lifespan;
				node['angle']=angle;
				node['gravity']=gravity;
				node['frequency']=frequency;
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
