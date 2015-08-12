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
AngoraEditor.Menu = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
	/**
	* @property {jquery object}
	*/
	this.menuButtons = {};

	this.setup();
}
AngoraEditor.Menu.prototype = {
	setup: function(){
		var editor=this.editor;
		this.addMenu('submenu_file',function (item) {
			switch(item.id){
				case 'newProject':editor.Manager.view.showNewProjectDialog();break;
				case 'openProject':editor.Manager.view.showOpenProjectDialog();break;
				case 'saveProject':editor.Manager.project.save();break;
				case 'closeProject':editor.Manager.project.close();break;
				default:break;
			}
		});
		this.addMenu('submenu_tools',function (item) {
			switch(item.id){
				case 'stamp':editor.Manager.game.stamp();break;
				case 'resource':editor.Manager.view.showResourceEditor();break;
				case 'tilemap':editor.Manager.view.showTiledMapEditor();break;
				case 'particle':editor.Manager.view.showParticleEditor();break;
				case 'audio':editor.Manager.view.showAudioEditor();break;
				case 'anime':editor.Manager.view.showAnimationEditor();break;
				case 'physics':editor.Manager.view.showPhysicsEditor();break;
				default:break;
			}
		});
		this.addMenu('submenu_app',function (item) {
			switch(item.id){
				case 'app':editor.Manager.view.showSettingsDialog();break;
				default:break;
			}
		});
		this.addMenu('submenu_run',function (item) {
			switch(item.id){
				case 'run':editor.Manager.project.run();break;
				case 'release':editor.Manager.project.release();break;
				default:break;
			}
		});
		this.addMenu('submenu_help',function (item) {
			switch(item.id){
				case 'about':editor.Manager.view.showAboutDialog();break;
				case 'help':editor.Manager.view.showHelpDialog();break;
				case 'preferences':editor.Manager.view.showPreferencesDialog();break;
				default:break;
			}
		});
	},
	addMenu: function(id, callback){
		this.menuButtons[id]=$('#'+id);
		this.menuButtons[id].menu({onClick:function(item){
			callback(item);
		}});
	},
	/**
	* load and setup scene pane DOM
	* @method loadData
	* @param {string} scene
	*/
	disable : function (id) {
		var item = this.menuButtons[id].menu('findItem', id);
		this.menuButtons[id].menu('disableItem', item.target);
	},
	/**
	* load and setup scene pane DOM
	* @method loadData
	* @param {string} scene
	*/
	enable : function (id) {
		var item = this.menuButtons[id].menu('findItem', id);
		this.menuButtons[id].menu('enableItem', item.target);
	},
	/**
	 * active state of menubutton
	 * @method
	 * @param
	 */
	activeMenu: function () {
		//$('#menu_tools').menubutton('enable');
		//$('#menu_app').menubutton('enable');
		//$('#menu_run').menubutton('enable');
		$('#submenu_run').menu('enableItem', $('#submenu_run').menu('findItem', 'Run').target);
		$('#submenu_run').menu('enableItem', $('#submenu_run').menu('findItem', 'Release').target);
		$('#submenu_app').menu('enableItem', $('#submenu_app').menu('findItem', 'AppConfig').target);
		//$('#submenu_app').menu('enableItem', $('#submenu_app').menu('findItem', 'CustomClass').target);
		$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Resource').target);
		$('#submenu_file').menu('enableItem', $('#submenu_file').menu('findItem','Save').target);
		$('#submenu_file').menu('enableItem', $('#submenu_file').menu('findItem','Close').target);
	},
	/**
	 * reset state of menubutton(not work in current easyui version)
	 * @method
	 * @param
	 */
	unactiveMenu: function () {
		//$('#menu_tools').menubutton('disable');
		//$('#menu_app').menubutton('disable');
		//$('#menu_run').menubutton('disable');
		//var item = $('#submenu_run').menu('getItem', $('#run')[0]);
		//$('#submenu_run').menu('disableItem', item.target);
		$('#submenu_run').menu('disableItem', $('#submenu_run').menu('findItem', 'Run').target);
		$('#submenu_run').menu('disableItem', $('#submenu_run').menu('findItem', 'Release').target);
		$('#submenu_app').menu('disableItem', $('#submenu_app').menu('findItem', 'AppConfig').target);
		//$('#submenu_app').menu('disableItem', $('#submenu_app').menu('findItem', 'CustomClass').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Resource').target);
		$('#submenu_file').menu('disableItem', $('#submenu_file').menu('findItem','Save').target);
		$('#submenu_file').menu('disableItem', $('#submenu_file').menu('findItem','Close').target);
	},
	/**
	 * active menuitem
	 * @method
	 * @param
	 */
	activeMenuItem: function (menuitem) {
		var editor=this.editor;
		//for(var item in $('#submenu_tools').find('.menu-item')){
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Stamp').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Animation').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Particle').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Audio').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Tilemap').target);
		$('#submenu_tools').menu('disableItem', $('#submenu_tools').menu('findItem','Physics').target);
		//}
		if(menuitem!=null){
			$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Stamp').target);
			switch(menuitem){
			case 'animate':$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Animation').target);
			case 'sprite':$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Physics').target);break;
			case 'particle':$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Particle').target);break;
			case 'audio':$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Audio').target);break;
			case 'tilemap':$('#submenu_tools').menu('enableItem', $('#submenu_tools').menu('findItem','Tilemap').target);break;
			default:break;
			}
		}
	},
}

AngoraEditor.Menu.prototype.constructor = AngoraEditor.Menu;
