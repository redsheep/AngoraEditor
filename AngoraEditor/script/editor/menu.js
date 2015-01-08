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
}
AngoraEditor.ContextMenuManger.prototype = {
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
		this.hide('AnimeEditor');
		this.hide('AudioEditor');
		this.hide('ParticleEditor');
	},
	/**
	 * remove a scene
	 * @method remove
	 * @param {string} scene
	 */
	showContextMenu : function (x,y) {
		var editor=this.editor;
		this.hideAll();
		if(editor.node.selected!=null){
			this.show('Remove');
			switch(editor.node.selected.type){
			case 'animate':this.show('AnimeEditor');break;
			case 'audio':this.show('AudioEditor');break;
			case 'particle':this.show('ParticleEditor');break;
			default :break;
			}
		}
		else{
			this.show('New');
		}
		this.menu.menu('show',{left: x, top: y});
	}
}

AngoraEditor.ContextMenuManger.prototype.constructor = AngoraEditor.ContextMenuManger;
