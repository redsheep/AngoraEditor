/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.FileManager constructor
 *
 * Instantiate <code>AngoraEditor.FileManager</code> object.
 * @class AngoraEditor.FileManager
 * @classdesc
 * @constructor
 */
AngoraEditor.UI = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {NodeTreeManager}
	 */
	this.nodeTree = null;
	/**
	 * @property {PropertyGrid}
	 */
	this.propertyGrid = null;	
	/**
	 * @property {ScenePane}
	 */
	this.scenePane = null;
	/**
	 * @property {EventPane}
	 */
	this.eventPane = null;
	/**
	 * @property {EventPane}
	 */
	this.contextMenu = null;	
	/**
	 * @property {boolean}
	 */
	this.showGrid=true;
	this.showRegion=false;
	/**
	 * @property {boolean}
	 */	
	this.snapToGrid=false;
	/**
	 * @property {number}
	 */	
	this.gridSize=32;
	/**
	 * @property {Jquery Object}
	 */	
	this.codeEditors={};
	this.codeChanges={};
	this.codeEditor=null;
	//this.setup();
	//this.setupUICallback();
}
AngoraEditor.UI.prototype = {
	/**
	 * setup
	 * @method setup
	 * @param 
	 */
	setup : function () {
		this.nodeTree = new AngoraEditor.NodeTreeManager(this.editor);
		this.propertyGrid = new AngoraEditor.PropertyGridManager(this.editor);
		this.scenePane = new AngoraEditor.ScenePaneManager(this.editor);
		this.eventPane = new AngoraEditor.EventPaneManager(this.editor);
		this.gamePane =new AngoraEditor.GamePaneManager(this.editor);
		this.contextMenu =new AngoraEditor.ContextMenuManger(this.editor);
		//this.gamePane.setup();
		this.contextMenu.setup();
		this.setupUICallback();
	},
	alert:function(title,content,icon){
		$.messager.alert(title,content,icon);
	},
	confirm:function(title,content,func){
		$.messager.confirm(title,content,func);
	},
	showMessage:function(title,message,timeout){
		$.messager.show({
			title:title,
			msg:message,
			timeout:timeout,
			showType:'slide'
		});
	},
	prompt:function(title,content,func){
		$.messager.prompt(title, content, func);
	},
	/**
	 * showDialog
	 * @method showDialog
	 * @param {string} - project path
	 * @param {number} - width of dialog
	 * @param {number} - height of dialog
	 * @param {function} - callback when close
	 */
	showDialog : function (path, w, h, func, modal,resize) {
		w = w || 400;
		h = h || 300;
		if (typeof modal==='undefined')modal=true;
		if (typeof resize==='undefined')resize=false;
		var dlg=$('#dd').dialog({
			title: path.split('/').pop(),
			left:(window.innerWidth-w)/2,
			top:(window.innerHeight-h)/2,
			width: w,
			height: h,
			resizable:resize,
			closed: false,
			cache: false,
			href: path,
			modal: modal,
			onClose: func
		});
		//$('#dd').editor=this.editor;
		return dlg;
	},
	showOpenProjectDialog: function(func){
		var dlg=this.showDialog('/dialog/showProject',480,400,func);
	},
	showNewProjectDialog: function(func){
		var dlg=this.showDialog('/dialog/newProject',400,400,func);
	},
	showResourceEditor: function(func){
		var dlg=this.showDialog('/dialog/resourceEditor',480,400,func);
	},
	showTiledMapEditor: function(func){
		var dlg=this.showDialog('/dialog/tiledmapEditor',800,600,func);
	},
	showParticleEditor: function(func){
		var dlg=this.showDialog('/dialog/particleEditor',520,480,func);
	},
	showPhysicsEditor: function(func){
		var dlg=this.showDialog('/dialog/physicsEditor',640,480,func);
	},
	showAnimationEditor: function(func){
		var dlg=this.showDialog('/dialog/animeEditor',640,480,func);
	},
	showAudioEditor:function(func){
		var dlg=this.showDialog('/dialog/audioEditor',640,480,func);
	},
	/**
	* open new brower tab and run project
	* @method runProject
	* @param 
	*/
	runProject: function () {
		var editor = this.editor;
		//var startPageScript = "{0}/mygame.js".format(editor.project.currentProject.path);
		//editor.file.readFile(startPageScript,function(script){
		//	script = script.replace(/game.state.start.*/g, "game.state.start('{0}')".format(editor.scene.curScene));
		//	var script = editor.file.writeFile(startPageScript, script);
		//	var startPage = "{0}/mygame.html".format(editor.project.currentProject.path);
		//	window.open (startPage,'','height={0},width={1},top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'.format(editor.project.config.display.height,editor.project.config.display.width)); 
		//});
		var startPage = "{0}/mygame.html?{1}".format(editor.project.currentProject.path,new Date().getTime());
		window.open (startPage,'','height={0},width={1},top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'.format(editor.project.config.display.height,editor.project.config.display.width)); 
	},
	/**
	 * setup callback of ui and DOM objects
	 * @method setupUICallback
	 * @param
	 */
	setupUICallback : function () {},
	/**
	 * setup the script of current project
	 * @method
	 * @param
	 */
	setupScript : function (title, script, id, closable) {
		if(typeof closable==='undefined')closable=false;
		if(typeof id==='undefined')id='code';
		var editor=this.editor;
		$('#tabs').tabs('add',{
		   id:'tab_'+title,
		   title:title,
		   closable:closable,
		   content:'<textarea id="{0}"></textarea>'.format(id),
		   cache:true
		});
		//if(this.codeEditor!=null)
		//	this.codeEditor.toTextArea();
		var pane=document.getElementById(id);
		this.codeEditor = CodeMirror.fromTextArea(pane, {
			lineNumbers : true,
			mode : "javascript",
			extraKeys: {"Shift-Space": "autocomplete"},
			gutters : ["CodeMirror-lint-markers"],
			lint : true
		});
		this.codeEditors[title]=this.codeEditor;
		this.codeChanges[title]=false;
		this.codeEditor.setValue(script);
		if(id==='code')this.codeEditor.on("change",function(){editor.scene.isScriptChanged=true;});
		else this.codeEditor.on("change",function(){editor.ui.codeChanges[title]=true;});
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
		$('#submenu_app').menu('enableItem', $('#submenu_app').menu('findItem', 'CustomClass').target);
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
		$('#submenu_app').menu('disableItem', $('#submenu_app').menu('findItem', 'CustomClass').target);
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
	closeAllCode:function(){
		var tabs=$('#tabs').tabs('tabs');
		for (var i=tabs.length-1;i>0;i--){
			$('#tabs').tabs('close',i);
		}
	},
	/**
	 * reset all ui compontents
	 * @method reset
	 * @param
	 */
	reset: function () {
		this.nodeTree.reset();
		this.propertyGrid.reset();
		this.eventPane.reset();
		this.gamePane.reset();
		$('#tabs').tabs('close',this.editor.scene.curScene);
	}
}
AngoraEditor.UI.prototype.constructor = AngoraEditor.UI;