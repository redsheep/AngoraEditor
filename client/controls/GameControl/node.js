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
	add : function (game,node) {
		var self = this;
		//this.editor.Data.game.curState.addNode(node);
		var gameNode = null;
		switch (node.type) {
			case 'sprite':
				gameNode = game.add.sprite(node.property.x,node.property.y,node.property.image);
				break;
			case 'tilesprite':
				gameNode = game.add.tileSprite(node.property.x,node.property.y,
					node.property.width,node.property.height,node.property.image);
				break;
			default:
		}
		if(gameNode!=null){
			gameNode.scale.set(node.property.scaleX,node.property.scaleY);
			//gameNode.fixedToCamera=true;
	    gameNode.inputEnabled = true;
			//gameNode.input.enableDrag(false);
			gameNode.events.onInputDown.add(function(sprite, pointer){
				self.select(node.id);
				sprite.game.anchorBounds.startPoint={x:sprite.x,y:sprite.y};
				sprite.game.anchorBounds.input.startDrag(pointer);
				/*if(pointer.button === Phaser.Mouse.LEFT_BUTTON){
					//sprite.input.draggable = true;
					sprite.startPoint={x:sprite.x,y:sprite.y};
				}else{
					//sprite.input.draggable = false;
				}*/
			}, this);
			/*gameNode.events.onDragUpdate.add(
				function(sprite, pointer, dragX, dragY, snapPoint){
					var dx=dragX-sprite.startPoint.x;
					sprite.x=sprite.startPoint.x+dx/sprite.game.world.scale.x;
					var dy=dragY-sprite.startPoint.y;
					sprite.y=sprite.startPoint.y+dy/sprite.game.world.scale.y;
					self.updateProperty('x',sprite.x);
					self.updateProperty('y',sprite.y);
					self.editor.UI.gamePanel.snapAnchorToObject(sprite.x,sprite.y,sprite.width,sprite.height);
				},this);*/
		}
		this.editor.Data.game.curState.nodes[node.id].ref=gameNode;
		return gameNode;
	},
	updateProperty:function(name,value){
		if(this.editor.Data.game.curState.selected!=null){
			this.editor.Data.game.curState.selected.setAttr(name,value);
			this.editor.Data.game.curState.selected.ref[name]=value;
			this.editor.UI.propertyGrid.updateRow(name,value);
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
	/**
	* select node by id
	* @method select
	* @param {string} id
	*/
	select : function (nodeID) {
		this.editor.UI.nodeTree.select(nodeID);
		this.editor.Data.game.curState.selectNode(nodeID);
		var selectedNode=this.editor.Data.game.curState.selected;
		this.editor.UI.propertyGrid.reset();
		this.editor.UI.eventPanel.reset();
		var property = this.editor.Data.game.curState.selected.property;
		for (var key in property){
			this.editor.UI.propertyGrid.add(key,property[key]);
		}
		var events = this.editor.Data.game.curState.selected.events;
		for (var key in events){
			this.editor.UI.eventPanel.add(key,events[key]);
		}
		this.editor.UI.propertyGrid.refresh();
		this.editor.UI.eventPanel.refresh();
		this.editor.UI.gamePanel.showAnchor();
		this.editor.UI.gamePanel.snapAnchorToObject(selectedNode.property.x,
		selectedNode.property.y,selectedNode.property.width,selectedNode.property.height);
		//this.editor.Data.game.selected;
	},
	unselect:function(){
		this.editor.Data.game.curState.unselect();
		this.editor.UI.gamePanel.hideAnchor();
		this.editor.UI.propertyGrid.reset();
		this.editor.UI.eventPanel.reset();
	},
	/**
	* remove a node from node manager
	* @method remove
	* @param {Object} node
	*/
	remove : function (nodeID) {
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
