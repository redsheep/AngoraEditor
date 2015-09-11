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
AngoraEditor.ContextMenu = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
	/**
	* @property {jquery object}
	*/
	this.Dom = $('#context');
	/**
	* @property {number}
	*/
	this.setup();
}
AngoraEditor.ContextMenu.prototype = {
	setup: function(){
		var self=this;
		var editor=this.editor;
		this.Dom.append('<div id="cm_addnode"> \
											<span>New</span> \
											<div> \
												<div class="cm_additem">image</div> \
												<div class="cm_additem">sprite</div> \
												<div class="cm_additem">animate</div> \
												<div class="cm_additem">particle</div> \
												<div class="cm_additem">text</div> \
											</div> \
										</div> \
										<div id="cm_remove">Remove</div> \
										<div id="cm_hdie">Hide</div> \
										<div id="cm_show">Show</div> \
										<div id="cm_lock">Lock</div> \
										<div id="cm_unlock">UnLock</div> \
										<div id="cm_anime">AnimeEditor</div> \
										<div id="cm_audio">AudioEditor</div> \
										<div id="cm_particle">ParticleEditor</div> \
										<div id="cm_tilemap">TileMapEditor</div>');
		this.Dom.menu({onClick:function (item) {
			switch(item.id){
				case 'cm_tilemap':editor.Manager.resource.showTiledMapEditor();break;
				case 'cm_particle':editor.Manager.resource.showParticleEditor();break;
				case 'cm_audio':editor.Manager.resource.showAudioEditor();break;
				case 'cm_anime':editor.Manager.resource.showAnimationEditor();break;
				case 'cm_physics':editor.Manager.resource.showPhysicsEditor();break;
				case 'cm_hdie':editor.Manager.gameNode.hide();break;
				case 'cm_show':editor.Manager.gameNode.show();break;
				case 'cm_lock':editor.Manager.gameNode.lock();break;
				case 'cm_unlock':editor.Manager.gameNode.unlock();break;
				case 'cm_remove':editor.Manager.gameNode.remove();break;
				case 'cm_additem':editor.Manager.gameNode.create();break;
				default:break;
			}
		}});
		$(document).bind('contextmenu',function(e){
			if($(document.activeElement).is('textarea'))
				return true;
			return false;
		});
		$('#preview').bind('contextmenu',function(e){
			if(editor.Manager.game.getCurrentState()!=null)
				self.showContextMenu(e.clientX,e.clientY);
		});
		//this.unactiveMenu();
	},
	/**
	* load and setup scene pane DOM
	* @method loadData
	* @param {string} scene
	*/
	disable : function (id) {
		var item = this.Dom.menu('findItem', id);
		this.Dom.menu('disableItem', item.target);
	},
	/**
	* load and setup scene pane DOM
	* @method loadData
	* @param {string} scene
	*/
	enable : function (id) {
		var item = this.Dom.menu('findItem', id);
		this.Dom.menu('enableItem', item.target);
	},
	/**
	* add a new scene
	* @method add
	* @param {string} scene
	*/
	hide : function (id) {
		var item = this.Dom.menu('findItem', id);
		this.Dom.menu('hideItem', item.target);
	},
	/**
	* add a new scene
	* @method add
	* @param {string} scene
	*/
	show : function (id) {
		var item = this.Dom.menu('findItem', id);
		this.Dom.menu('showItem', item.target);
	},
	/**
	* remove a scene
	* @method remove
	* @param {string} scene
	*/
	remove : function (id) {
		var item = this.Dom.menu('findItem', id);
		this.Dom.menu('removeItem', item.target);
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
		var selected = this.editor.Manager.gameNode.getSelected();
		this.hideAll();
		if(selected!=null){
			this.show('Remove');
			switch(selected.type){
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
		this.Dom.menu('show',{left: x, top: y});
	}
}

AngoraEditor.ContextMenu.prototype.constructor = AngoraEditor.ContextMenu;
