/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.ContextMenuManger constructor
 *
 * Instantiate <code>AngoraEditor.ContextMenuManger</code> object.
 * @class AngoraEditor.ContextMenuManger
 * @classdesc
 * @constructor
 */
AngoraEditor.ContextMenuManger = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {jquery object}
	 */
	this.menu = $('#context');
	/**
	 * @property {number}
	 */
	this.menuposX = 0;
	this.menuposY = 0;
}
AngoraEditor.ContextMenuManger.prototype = {
	setup: function(){
		var editor=this.editor;
		$("#context").menu({onClick:function (item) {
			switch(item.id){
			case 'cm_audio':$('#audio').trigger('click');break;
			case 'cm_anime':$('#anime').trigger('click');break;
			case 'cm_particle':$('#particle').trigger('click');break;
			case 'cm_tilemap':$('#tilemap').trigger('click');break;
			case 'cm_hdie':editor.attr.setAttr(editor.node.selected,'visible','false');break;
			case 'cm_show':editor.attr.setAttr(editor.node.selected,'visible','true');break;
			case 'cm_lock':editor.node.locked[editor.node.selected.id]=true;break;
			case 'cm_unlock':editor.node.locked[editor.node.selected.id]=false;break;
			case 'cm_remove':$("#removeNode").trigger('click');break;
			default:break;
			}
		}});
		$('.cm_additem').click(function(e){
			var type = $(this)[0].children[0].innerHTML;
			var node = editor.node.create(type);
			var offset = $('#scene').offset();
			node.x=editor.ui.contextMenu.menuposX-offset.left;
			node.y=editor.ui.contextMenu.menuposY-offset.top;
			editor.node.add(node);
			editor.ui.nodeTree.addNode(node);
			editor.ui.gamePane.add(node);
		});
	},
	/**
	 * load and setup scene pane DOM
	 * @method loadData
	 * @param {string} scene
	 */
	disable : function (id) {
		var item = this.menu.menu('findItem', id);
		this.menu.menu('disableItem', item.target);
	},
	/**
	 * load and setup scene pane DOM
	 * @method loadData
	 * @param {string} scene
	 */
	enable : function (id) {
		var item = this.menu.menu('findItem', id);
		this.menu.menu('enableItem', item.target);
	},
	/**
	 * add a new scene
	 * @method add
	 * @param {string} scene
	 */
	hide : function (id) {
		var item = this.menu.menu('findItem', id);
		this.menu.menu('hideItem', item.target);
	},
	/**
	 * add a new scene
	 * @method add
	 * @param {string} scene
	 */
	show : function (id) {
		var item = this.menu.menu('findItem', id);
		this.menu.menu('showItem', item.target);
	},
	/**
	 * remove a scene
	 * @method remove
	 * @param {string} scene
	 */
	remove : function (id) {
		var item = this.menu.menu('findItem', id);
		this.menu.menu('removeItem', item.target);
	},
	/**
	 * remove a scene
	 * @method remove
	 * @param {string} scene
	 */
	hideAll: function(){
		this.hide('New');
		this.hide('Remove');
		this.hide('Hide');
		this.hide('Show');
		this.hide('Lock');
		this.hide('UnLock');
		this.hide('AnimeEditor');
		this.hide('AudioEditor');
		this.hide('ParticleEditor');
		this.hide('TileMapEditor');
	},
	/**
	 * remove a scene
	 * @method remove
	 * @param {string} scene
	 */
	showContextMenu : function (x,y) {
		var editor=this.editor;
		this.menuposX=x;this.menuposY=y;
		this.hideAll();
		if(editor.node.selected!=null){
			this.show('Remove');
			switch(editor.node.selected.type){
			case 'animate':this.show('AnimeEditor');break;
			case 'audio':this.show('AudioEditor');break;
			case 'particle':this.show('ParticleEditor');break;
			case 'tilemap':this.show('TileMapEditor');break;
			default :break;
			}
			this.show('Hide');
			this.show('Show');
			this.show('Lock');
			this.show('UnLock');
		}
		else{
			this.show('New');
		}
		this.menu.menu('show',{left: x, top: y});
	}
}

AngoraEditor.ContextMenuManger.prototype.constructor = AngoraEditor.ContextMenuManger;
