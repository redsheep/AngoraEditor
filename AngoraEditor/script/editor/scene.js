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
AngoraEditor.SceneManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Object}
	 */
	this.scenes = {};
	/**
	 * @property {Object}
	 */
	this.config=null;
	/**
	 * @property {string} current scene
	 */
	this.curScene = null;
	this.isNodeChanged=false;
	this.isResourceChanged=false;
	this.isScriptChanged=false;
	this.isConfigChanged=false;
}
AngoraEditor.SceneManager.prototype = {
	/**
	* setup
	* @method setup
	* @param 
	*/
	setup : function (finished) {
		var filepath = this.editor.project.currentProject.sceneFile;
		var p=this;
		this.editor.file.readFile(filepath,function(json){
			p.scenes = JSON.parse(json);
			p.editor.ui.scenePane.loadData(p.scenes);
			p.editor.res.loadPreloadRes(function(){});
			if(typeof finished!='undefined')
				finished();
		});
	},
	/**
	* load scene and setup
	* @method load
	* @param {string} scene name
	*/
	load : function (scene) {
		if (this.curScene != null && scene != this.curScene) {
			this.reset();
		} else if (scene == this.curScene) {
			return false;
		}
		this.curScene = scene;
		var p=this;
		var filepath = "{0}/{1}.scn".format(this.editor.project.currentProject.path, scene);
		this.editor.file.readFile(filepath,function(data){
			var json=JSON.parse(data);
			p.editor.node.setData(json);
			p.editor.ui.nodeTree.loadData(json);
			console.log('nodeTree setup success');
			p.editor.res.loadFromFile(scene,function(){
				console.log('resource loaded completely');
				p.editor.ui.gamePane.loadData(json);
				console.log('gamepane setup success');
			});
			p.editor.script.loadSceneScript(scene,function(script){
				p.editor.ui.setupScript(scene, script);
				$('#tabs').tabs('select','preview');
			});
			var configfile="{0}/{1}.config".format(p.editor.project.currentProject.path, scene);
			p.editor.file.readFile(configfile,function(data){
				p.config=JSON.parse(data);
				p.editor.ui.gamePane.setupConfig();
			});
		});
	},
	/**
	* add a new scene
	* @method add
	* @param {string} scene name
	*/
	add : function (sceneName) {
		var editor = this.editor;
		var projectpath = editor.project.currentProject.path;
		if (typeof this.scenes[sceneName]==='undefined') {
			this.scenes[sceneName] = {
				name : sceneName,
				id : sceneName
			};
		} else {
			return false;
		}
		this.loadDefaultConfig();
		console.log('setup config success');
		//this.editor.file.copyFile(Ti.App.appURLToPath('app://template/scene.js'),"{0}/{1}.js".format(projectpath,sceneName));
		//this.editor.file.copyFile(Ti.App.appURLToPath('app://template/scene.script.js'),"{0}/{1}.script.js".format(projectpath,sceneName));
		this.editor.script.createScript(sceneName);
		this.editor.file.createTemplate(projectpath, 'scene.scn', "{0}.scn".format(sceneName));
		this.editor.file.createTemplate(projectpath, 'scene.res', "{0}.res".format(sceneName));
		//this.editor.file.createTemplate(projectpath, 'scene.scripts', "{0}.scripts".format(sceneName));
		this.editor.file.writeFile("{0}/{1}.config".format(projectpath, sceneName),JSON.stringify(this.config,null,2));
		this.editor.ui.scenePane.add(sceneName);
		var startPage = "{0}/mygame.html".format(editor.project.currentProject.path);
		this.editor.file.readFile(startPage,function(script){
			var n = script.lastIndexOf('<script type="text/javascript" src="mygame.js">');
			var script = script.substring(0, n) + '<script type="text/javascript" src="{0}.js"></script>'.format(sceneName) + script.substring(n);
			editor.file.writeFile(startPage, script);	
		});

		if(this.curScene==null) this.load(sceneName);		
		var startPageScript = "{0}/mygame.js".format(editor.project.currentProject.path);
		editor.file.readFile(startPageScript,function(script){
			var insertpos = script.lastIndexOf('game.state.start');
			script = script.substr(0, insertpos) + "game.state.add('{0}',{0});".format(sceneName) + script.substr(insertpos);
			editor.file.writeFile(startPageScript, script);		
		});

		var scenesfile = "{0}/scenes.json".format(editor.project.currentProject.path);
		editor.file.writeFile(scenesfile, JSON.stringify(this.scenes,null,4));
		//setupScene(sceneName);
		//setupSceneResource(sceneName);
		//setupCustomScript(sceneName);
		//setupSceneScript(sceneName);
	},
	/**
	* add a scene event 
	* @method addEvent
	* @param {string} ev - event name
	* @param {string} func - function name
	*/	
	addEvent : function(ev,functionName){
		this.config.input[ev]=functionName;
	},
	/**
	* remove a scene
	* @method remvoe
	* @param {string} scene
	* @param {boolean} remove file
	*/
	remove : function (sceneName,delFile) {
		var editor = this.editor;
		var projectpath = editor.project.currentProject.path;
		//editor.game.clear();
		if (typeof this.scenes[sceneName]!='undefined'){
			delete this.scenes[sceneName];
			editor.ui.scenePane.remove(sceneName);
			editor.file.writeFile("{0}/scenes.json".format(projectpath), JSON.stringify(this.scenes,null,4));
			var startPage = "{0}/mygame.html".format(projectpath);
			this.editor.file.readFile(startPage,function(script){
				script = script.replace('<script type="text/javascript" src="{0}.js"></script>'.format(sceneName),' ');
				editor.file.writeFile(startPage, script);
			});
			var startPageScript = "{0}/mygame.js".format(projectpath);
			editor.file.readFile(startPageScript,function(script){
				script = script.replace("game.state.add('{0}',{0});".format(sceneName),'');
				editor.file.writeFile(startPageScript, script);
			});
			if(delFile==true){
				editor.file.removeFile("{0}/{1}.config".format(projectpath, sceneName));
				editor.file.removeFile("{0}/{1}.js".format(projectpath, sceneName));
				editor.file.removeFile("{0}/{1}.scn".format(projectpath, sceneName));
				editor.file.removeFile("{0}/{1}.res".format(projectpath, sceneName));
				//this.editor.file.removeFile("{0}/{1}.scripts".format(projectpath, sceneName));
				editor.file.removeFile("{0}/{1}.script.js".format(projectpath, sceneName));
			}
		}
	},
	/**
	* remove all scenes
	* @method removeAll
	* @param 
	*/
	removeAll : function(){
		for( i in this.scenes){
			this.remove(i,false)
		}
	},	
	/**
	* reset current scene
	* @method reset
	* @param 
	*/
	reset : function () {
		this.editor.res.clear();
		this.editor.node.clear();
		this.editor.ui.reset();
		this.curScene=null;
	},
	/**
	* reset current scene
	* @method reset
	* @param 
	*/
	clearAll : function () {
		this.scenes={};
	},
	/**
	* set configuration of current scene
	* @method setConfig
	* @param {string} key
	* @param {string} group
	* @param {string} value
	*/
	setConfig:function(key,grp,value){
		console.log("set{0}{1} as {2}".format(grp,key,value));
		if(typeof this.config[grp]=='undefined')
			this.config[key]=value;
		this.config[grp][key]=value;	
	},
	/**
	* load default configuration of scene
	* @method loadDefaultConfig
	* @param 
	*/
	loadDefaultConfig:function(){
		var editor=this.editor;
		this.config = {
			"backgroundColor":"#000000",
			"world":{
				x:0,y:0,
				width:editor.game.display.width,
				height:editor.game.display.height,
				collideWorldBounds:false
			},
			"camera":{
				x:0,y:0,
				width:editor.game.display.width,
				height:editor.game.display.height
			},
			"physics":{
				enable:false,
				type:editor.game.physics,
				gravityX:0,
				gravityY:0
			},
			"input": {
				onDown: "",
				onHold: "",
				onTap: "",
				onUp: ""
			}
		}
	},
	/**
	* save current scene
	* @method save
	* @param 
	*/
	save : function () {
		//alert('try saving');
		var editor = this.editor;
		var projectpath = editor.project.currentProject.path;
		var sceneName = this.curScene;
		//editor.file.writeFile("{0}/{1}.js".format(projectpath,sceneName),);
		if(this.isNodeChanged){
		editor.file.writeFile("{0}/{1}.scn".format(projectpath, sceneName), JSON.stringify(editor.node.nodes, null, 2));
		this.isNodeChanged=false;
		}
		if(this.isResourceChanged){
		editor.file.writeFile("{0}/{1}.res".format(projectpath, sceneName), JSON.stringify(editor.res.localres, null, 2));
		editor.file.writeFile("{0}/preload.res".format(projectpath), JSON.stringify(editor.res.globalres, null, 2));
		this.isResourceChanged=false;
		}
		if(this.isScriptChanged){
		//editor.file.writeFile("{0}/{1}.scripts".format(projectpath,sceneName),);
		editor.file.writeFile("{0}/{1}.script.js".format(projectpath,sceneName),editor.ui.codeEditor.getValue());
		this.isScriptChanged=false;
		}
		if(this.isConfigChanged){
		editor.file.writeFile("{0}/{1}.config".format(projectpath,sceneName),JSON.stringify(editor.scene.config, null, 2));
		this.isConfigChanged=false;
		}
	}
}

AngoraEditor.SceneManager.prototype.constructor = AngoraEditor.SceneManager;
