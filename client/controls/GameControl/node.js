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
AngoraEditor.ManagerController.GameNodeManager = function (editor) {
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
AngoraEditor.ManagerController.GameNodeManager.prototype = {
	/**
	* add node to node manager
	* @method add
	* @param {Object} node
	*/
	add : function (node) {
		var self = this;
		node = this.editor.Data.game.curState.addNode(node);
		var gameNode=this.editor.UI.gamePanel.addNode(node);
		this.editor.Data.game.curState.nodes[node.id].ref=gameNode;
		node.setAttr('width',gameNode.width);
		node.setAttr('height',gameNode.height);
		this.editor.UI.nodeTree.addNode(node);
	},
	updateProperty:function(name,value,delay){
		var node = this.editor.Data.game.curState.selected;
		if(node!=null){
			node.setAttr(name,value);
			this.editor.UI.propertyGrid.updateRow(name,value,delay);
			if(name=='x'||name=='y'||name=='width'||name=='height')
				this.editor.UI.gamePanel.snapAnchorToObject(node.ref.x,node.ref.y,node.ref.width,node.ref.height);
			//this.editor.UI.gamePanel.updateProperty(name,value);
		}
	},
	addProperty:function(){
		var editor=this.editor;
		editor.UI.prompt("add property","Enter new property name",function(name){
			if (typeof name!='undefined' && name.trim() != ''){
				editor.Data.curState.selected.addAttr(name,'');
				editor.UI.propertyGrid.refresh();
			}
		});
	},
	addEvent:function(sprite,event,callback){
		sprite.addEvent(event,callback);
		this.editor.UI.eventPanel.add(event,callback);
	},
	/**
	* select node by id
	* @method select
	* @param {string} id
	*/
	select : function (nodeID) {
		this.editor.Data.game.curState.selectNode(nodeID);
		this.editor.UI.nodeTree.select(nodeID);
		var selectedNode=this.editor.Data.game.curState.selected;
		this.editor.UI.propertyGrid.reset();
		this.editor.UI.eventPanel.reset();
		var property = this.editor.Data.game.curState.selected.property;
		for (var key in property){
			this.editor.UI.propertyGrid.add(key,property[key]);
		}
		this.editor.UI.propertyGrid.refresh();
		this.editor.UI.eventPanel.refresh();
		var events = this.editor.Data.game.curState.selected.events;
		for (var key in events){
			this.editor.UI.eventPanel.add(key,events[key]);
		}
		this.editor.UI.menu.activeMenuItem(selectedNode.type);
		if(selectedNode.interactive){
		this.editor.UI.gamePanel.showAnchor();
		this.editor.UI.gamePanel.snapAnchorToObject(selectedNode.property.x,
		selectedNode.property.y,selectedNode.property.width,selectedNode.property.height);
		}//this.editor.Data.game.selected;
	},
	unselect:function(){
		if(this.editor.Data.game.curState!=null &&
			this.editor.Data.game.curState.selected!=null){
			this.editor.UI.gamePanel.hideAnchor();
			this.editor.UI.propertyGrid.reset();
			this.editor.UI.eventPanel.reset();
			this.editor.UI.nodeTree.unselect();
			this.editor.Data.game.curState.unselect();
		}
	},
	loadAll:function (){
		this.editor.UI.gamePanel.reset();
		this.editor.UI.nodeTree.reset();
		var nodes = this.editor.Data.game.curState.nodes;
		for(var nodeID in nodes){
			var gameNode=this.editor.UI.gamePanel.addNode(nodes[nodeID]);
			this.editor.Data.game.curState.nodes[nodeID].ref=gameNode;
			this.editor.UI.nodeTree.addNode(nodes[nodeID]);
		}
	},
	/**
	* remove a node from node manager
	* @method remove
	* @param {Object} node
	*/
	remove : function (nodeID) {
	},
	getSelected:function(){
		return this.editor.Data.game.curState.selected;
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
AngoraEditor.ManagerController.GameNodeManager.prototype.constructor = AngoraEditor.ManagerController.GameNodeManager;
