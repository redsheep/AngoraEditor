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
AngoraEditor.NodeTreeManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Jquery Object}
	 */
	this.tree = null;
	/**
	 * @property {Array}
	 */
	this.nodes = [];
	/**
	 * @property {Object}
	 */	
	this.selected=null;
	
	this.setup();
}
AngoraEditor.NodeTreeManager.prototype = {
	/**
	* setup
	* @method setup
	* @param 
	*/
	setup : function () {
		var editor = this.editor;
		this.tree = $('#nodes').tree({
			data : this.nodes,
			dnd : true,
			onSelect : function (node) {
				editor.node.select(node.id);
				editor.ui.propertyGrid.loadData(editor.node.selected);
				editor.ui.eventPane.loadData(editor.node.selected);
				//editor.game.updateSelectNode(node.id);
				editor.ui.nodeTree.selected=editor.ui.nodeTree.tree.tree('find', node.id);
			},
			onBeforeDrop : function (targetNode, source, point) {
				//var targetId = $(target).tree('getNode', targetNode).id;
				var node=editor.node.get(targetNode.textContent);
				if(point=='append')// && node.type!='group')
					return false;
				return true;
			},
			onDrop : function(targetNode, source, point) {
				var nodes=$('#nodes').tree('getRoots');
				editor.node.update(nodes);
			},
			onContextMenu: function(e,node){
				e.preventDefault();
				$(this).tree('select',node.target);
				editor.ui.contextMenu.showContextMenu(e.pageX,e.pageY);
			}
		});
	},
	/**
	* 
	* @method 
	* @param 
	*/
	loadData : function (data) {
		for (i in data) {
			var item = {
				"id" : data[i].id,
				"text" : data[i].id,
				"iconCls" : this.getTypeIcon(data[i].type)
			}
			this.nodes.push(item);
		}
		this.tree.tree('loadData',this.nodes);
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
			this.tree.tree('append', {
				data : tnode
			});
		} else {
			this.tree.tree('append', {
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
		this.selected=this.tree.tree('find', id);
		this.tree.tree('select', this.selected.target);
	},
	/**
	* callback when unselect the tree node
	* @method select
	*/
	unselect : function () {
		if(this.selected==null)return;
		var selected = this.selected.target;
		$(selected).removeClass("tree-node-selected");
		this.selected=null;
		this.editor.node.selected=null;
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
		this.tree.tree('update', {
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
		this.tree.tree('remove', node);
	},
	/**
	* clear the node tree
	* @method reset
	* @param 
	*/	
	reset: function(){
		this.nodes = [];
		this.tree.tree('loadData','');
	}
}

AngoraEditor.NodeTreeManager.prototype.constructor = AngoraEditor.NodeTreeManager;
