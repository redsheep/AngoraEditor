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
AngoraEditor.UIComponent = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;

	this.layout	=	null;
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
	this.scenePanel = null;
	/**
	 * @property {ScenePane}
	 */
	this.gamePanel = null;
	/**
	 * @property {EventPane}
	 */
	this.eventPanel = null;
	/**
	 * @property {EventPane}
	 */
	this.contextMenu = null;

	this.codeEditors={};

	this.codeEditor=null;

	this.Dialog={
		OpenProjectDialog : new AngoraEditor.UIComponent.OpenProjectDialog(),
		NewProjectDialog : new AngoraEditor.UIComponent.NewProjectDialog()
	};

	this.setup();
}
AngoraEditor.UIComponent.prototype = {
	/**
	 * setup
	 * @method setup
	 * @param
	 */
	setup : function () {
		this.menu 				= new AngoraEditor.Menu(this.editor);
		this.nodeTree 		= new AngoraEditor.NodeTree(this.editor);
		this.scenePanel 		= new AngoraEditor.ScenePanel(this.editor);
		this.propertyGrid = new AngoraEditor.PropertyGrid(this.editor);
		this.eventPanel 		= new AngoraEditor.EventPanel(this.editor);
		this.gamePanel 		= new AngoraEditor.GamePanel(this.editor);
		this.contextMenu 	= new AngoraEditor.ContextMenu(this.editor);
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
	showDialog : function (path, w, h, loaded, closed, modal,resize) {
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
			onLoad: loaded,
			onClose: closed
		});
		//$('#dd').editor=this.editor;
		return dlg;
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
	setupScript : function (title, script, type) {
		if(typeof closable==='undefined')closable=false;
		//if(typeof id==='undefined')id='code';
		var editor=this.editor;
		if($('#tabs').tabs('exists',title)){
			$('#tabs').tabs('select',title);
			return;
		}
		$('#tabs').tabs('add',{
		   id:'tab_'+title,
		   title:title,
		   closable:true,
		   content:'<textarea id="{0}_script" type="{1}"></textarea>'.format(title,type),
		   cache:true
		});
		//if(this.codeEditor!=null)
		//	this.codeEditor.toTextArea();
		var pane=document.getElementById(title+"_script");
		this.codeEditor = CodeMirror.fromTextArea(pane, {
			lineNumbers : parseBoolean(editor.system.config.code.lineNumber),
			mode : "javascript",
			extraKeys: {"Shift-Space": "autocomplete"},
			gutters : ["CodeMirror-lint-markers"],
			lint : true
		});
		this.codeEditors[title]={'editor':this.codeEditor,'changes':false,type:type}
		//this.codeChanges[title]=false;
		this.codeEditor.setValue(script);
		this.codeEditor.on("change",function(){editor.ui.codeEditors[title].changes=true;});
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
	resetAll: function () {
		this.nodeTree.reset();
		this.propertyGrid.reset();
		this.eventPanel.reset();
		this.gamePanel.reset();
		this.scenePanel.reset();
	}
}
AngoraEditor.UIComponent.prototype.constructor = AngoraEditor.UIComponent;
