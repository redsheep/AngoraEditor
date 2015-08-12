/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.NodeTreeManager constructor
 *
 * Instantiate <code>AngoraEditor.NodeTreeManager</code> object.
 * @class AngoraEditor.NodeTreeManager
 * @classdesc
 * @constructor
 */
AngoraEditor.NodeTree = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Jquery Object}
	 */
	this.Dom = $('#nodes');
	/**
	 * @property {Array}
	 */
	this.nodes = [];
	/**
	 * @property {Object}
	 */
	this.selected=null;

	this.setupCallback();
}
AngoraEditor.NodeTree.prototype = {
	setupCallback:function(){
		$("#addNode").click(function () {
			if(editor.project.currentProject==null)return;
			editor.ui.showDialog('/dialog/nodetype');
		});
		$("#removeNode").click(function () {
			if(editor.project.currentProject==null || editor.node.selected==null)return;
			editor.node.remove(editor.node.selected.id);
			editor.ui.nodeTree.removeNode();
			editor.ui.gamePane.remove(editor.node.selected);
			editor.ui.propertyGrid.reset();
		});
		$("#moveupNode").click(function () {
			//var zindex = editor.node.selected.zindex - 1;
			//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
		});
		$("#movedownNode").click(function () {
			//var zindex = editor.node.selected.zindex - 1;
			//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
		});
	},
	/**
	* setup
	* @method setup
	* @param
	*/
	setup : function () {
		var editor = this.editor;
		var self = this;
		this.Dom.tree({
			data : this.nodes,
			dnd : true,
			onSelect : function (node) {
				if(self.selected.id !== node.id)
					editor.Manager.gameNode.select(node.id);
			},
			onBeforeDrop : function (targetNode, source, point) {
				//var targetId = $(target).tree('getNode', targetNode).id;
				var node=editor.node.get(targetNode.textContent);
				if(point=='append' && node.type!='group')
					return false;
				return true;
			},
			onDrop : function(targetNode, source, point) {
				var node=null;
				if(point=='append'){
					editor.node.addToGroup(source.id,targetNode.textContent);
					node=editor.node.get(targetNode.textContent);
				}else{
					editor.node.checkGroup(source.id,targetNode.textContent, point);
					node=editor.node.getParent(targetNode.textContent);
				}

				if(node==null){
					editor.ui.gamePane.updateGroup(source.id);
					editor.ui.gamePane.updateZorder(editor.node.nodes,0);
				}else{
					editor.ui.gamePane.updateGroup(source.id,node.id);
					editor.ui.gamePane.updateZorder(node,0);
				}
			},
			onContextMenu: function(e,node){
				e.preventDefault();
				$(this).tree('select',node.target);
				editor.ui.contextMenu.showContextMenu(e.pageX,e.pageY);
			}
		});
		var nodes=this.editor.Data.game.curState.nodes;
		for(var key in nodes){
			this.addNode(nodes[key]);
		}
	},
	_loadNode:function(data,parent){
		var item = {
			"id" : data.id,
			"text" : data.id,
			"iconCls" : this.getTypeIcon(data.type),
			"children": typeof data.children!=='undefined'?[]:undefined
		}
		parent.push(item);
		if(typeof data.children!=='undefined'){
			for(i in data.children){
				this.loadNode(data.children[i],item.children);
			}
		}
	},
	/**
	* add node into the tree
	* @method addNode
	* @param {Object} node
	*/
	addNode : function (node) {
		//alert(node.id);
		var tnode = {
			id : node.id,
			text : node.id,
			iconCls : this.getTypeIcon(node.type)
		}
		//this.nodes.push(tnode);
		var selected = this.selected;//this.tree.tree('getSelected');//.target;
		if (selected == null) {
			this.Dom.tree('append', {
				data : tnode
			});
		} else {
			this.Dom.tree('append', {
				//parent : selected.target,
				data : tnode
			});
		}
	},
	/**
	* callback when select the tree node
	* @method select
	* @param {string} id
	*/
	select : function(id){
		this.selected=this.Dom.tree('find', id);
		this.Dom.tree('select', this.selected.target);
		//this.editor.ui.activeMenuItem(this.editor.node.selected.type);
	},
	/**
	* callback when unselect the tree node
	* @method select
	*/
	unselect : function () {
		editor.Manager.game.node.unselect();
		//this.tree.tree('unSelect', selected.target);
	},
	/**
	* update the tree node
	* @method updateNode
	* @param {string} id
	* @param {string} value
	*/
	updateNode: function(id,value){
		var node=this.tree.tree('find', id).target;
		this.Som.tree('update', {
			target: node,
			id:	value,
			text: value
		});
	},
	/**
	* set the tree node icon
	* @method getTypeIcon
	* @param type
	*/
	getTypeIcon : function (type) {
		switch (type) {
		default:
			return 'icon-ae-'+type;
		}
	},
	/**
	* remove node from tree
	* @method removeNode
	* @param
	*/
	removeNode : function () {
		var node = this.selected.target;//this.tree.tree('getSelected');
		this.Dom.tree('remove', node);
	},
	/**
	* clear the node tree
	* @method reset
	* @param
	*/
	reset: function(){
		this.nodes = [];
		this.Dom.tree('loadData','');
	}
}

AngoraEditor.NodeTree.prototype.constructor = AngoraEditor.NodeTree;
