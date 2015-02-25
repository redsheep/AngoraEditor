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
AngoraEditor.ProjectManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Object} 
	 */
	this.projects = null;
	/**
	 * @property {Object} - project configuration
	 */
	this.config = null;
	/**
	 * @property {Object}
	 */
	this.currentProject = null;
	this.customclass=null;
	this.plugins=null;
}
AngoraEditor.ProjectManager.prototype = {
	/**
	* setup
	* @method setup
	* @param 
	*/
	setup : function () {
		//var data=this.editor.file.readFile(this.editor.system.projectFile);
		//this.projects=JSON.parse(data);
		var p=this;
		this.editor.file.readFile(this.editor.system.projectFile, function(json) {
			p.projects=JSON.parse(json);
			console.log('load project list finished');
		});
	},
	/**
	* load project
	* @method load
	* @param {string} project
	*/
	load: function(project,finished){
		if(this.currentProject!=null){
			this.reset();
		}
		console.log('loading project');
		this.currentProject={};
		this.currentProject['name'] 		= project['name'];
		this.currentProject['path'] 		= project['path'];
		this.currentProject['configFile']	= this.currentProject['path']+'/config.json';
		this.currentProject['sceneFile']	= this.currentProject['path']+'/scenes.json';
		this.currentProject['customClassFile']=this.currentProject['path']+'/custom.cls';
		var p=this;
		if(this.config==null){
			this.editor.file.readFile(this.currentProject['configFile'],function(json){
				p.config=JSON.parse(json);
				p.editor.game.setup(p.config);
				p.editor.ui.gamePane.setupConfig(p.config.display.width,p.config.display.height);
				console.log('load config success');
				p.editor.scene.setup(finished);
				console.log('New Project Create Success!');
			});			
		}else{
			p.editor.game.setup(p.config,true);
			p.editor.ui.gamePane.setupConfig(p.config.display.width,p.config.display.height);
			console.log('update config success');
			p.editor.scene.setup(finished);
			console.log('New Project Create Success!');
		}
		if(this.editor.file.existFile(this.currentProject.customClassFile)){
			p.editor.file.readFile(this.currentProject.customClassFile,function(json){
				p.customclass=JSON.parse(json);
			});
		}
		this.editor.ui.activeMenu();
	},
	/**
	* add a new project
	* @method add
	* @param {string} project
	* @param {Object} configuration
	* @param {boolean} load immediately
	*/
	add : function (project,config,load) {
		
		var editor=this.editor;
		this.config=config;
		this.projects[project.name] = project;
		this.editor.file.writeFile(editor.system.projectFile, JSON.stringify(this.projects, null, 4));
		this.editor.file.createDirectory(project.path);
		this.editor.file.createDirectory(project.path + '/data');
		this.editor.file.createTemplate(project.path,'scenes.json');
		this.editor.file.createTemplate(project.path,'mygame.html');
		this.editor.file.createTemplate(project.path,'createscene.js');
		this.editor.file.createTemplate(project.path,'phaser.min.js');
		this.editor.file.createTemplate(project.path,'mygame.js',undefined,function(){
			editor.file.readFile(project.path+'/mygame.js',function(data){
				data = data.replace(/{w}/g, config.display.width);
				data = data.replace(/{h}/g, config.display.height);
				editor.file.writeFile(project.path+'/mygame.js',data);
				if(load){
					editor.project.load(project,function(){
						editor.scene.add('preload');
					});
				}
			});
		});
		var projectargs={"name": project.name,"path": project.path,"icons": "","descript": ""};
		this.editor.file.writeFile(project.path+'/~.project', JSON.stringify(projectargs, null, 4));
		console.log('finish add project');
	},
	setConfig:function(config){
		var editor=this.editor;
		this.config=config;
		editor.file.readFile(this.currentProject.path+'/mygame.js',function(data){
			data = data.replace(/game\s*=\s*new\s*Phaser.Game\([\s*\S+\s*,]+\'\'\);/,"game=new Phaser.Game({0},{1},Phaser.{2},'');".format(config.display.width,config.display.height,config.render));
			editor.file.writeFile(editor.project.currentProject.path+'/mygame.js',data);
			editor.file.writeFile(editor.project.currentProject.configFile,JSON.stringify(config,null,2));
		});
		editor.game.setup(config);
		editor.ui.gamePane.setupConfig(config.display.width,config.display.height);
	},
	addCustomClass:function(cls){
		if(this.customclass==null) this.customclass={};
		this.customclass[cls.clsname]=cls;
		this.editor.file.writeFile(this.currentProject.customClassFile,JSON.stringify(this.customclass,null,2));
		var startPage = "{0}/mygame.html".format(this.currentProject.path);
		this.editor.file.readFile(startPage,function(script){
			var n = script.lastIndexOf('<script type="text/javascript" src="mygame.js">');
			var script = script.substring(0, n) + '<script type="text/javascript" src="{0}.js"></script>'.format(cls.clsname) + script.substring(n);
			editor.file.writeFile(startPage, script);	
		});
		this.editor.script.createCustomClassScript(cls);
	},
	removeCustomClass:function(cls){
		var startPage = "{0}/mygame.html".format(this.currentProject.path);
		this.editor.file.readFile(startPage,function(script){
			script = script.replace('<script type="text/javascript" src="{0}.js"></script>'.format(cls.clsname),' ');
			editor.file.writeFile(startPage, script);
		});
		delete this.editor.ui.codeEditors[cls.clsname];
		delete this.customclass[cls.clsname];
	},
	addPlugin:function(plugin){
		if(this.plugins==null) this.plugins={};
		this.plugins[plugin.name]=plugin;
	},
	removePlugin:function(plugin){
		delete this.plugins[plugin.name];
	},
	importProject:function(func){
		var editor=this.editor;
		this.editor.file.readTempFile(function(data){
			var project=JSON.parse(data);
			editor.project.projects[project.name] = project;
			editor.file.writeFile(editor.system.projectFile, JSON.stringify(editor.project.projects, null, 2));
			func(project);
		});
	},
	/**
	* remove project
	* @method remove
	* @param {string} project name
	*/
	remove : function (name) {
		delete this.projects[name];
		this.editor.file.writeFile(this.editor.system.projectFile,JSON.stringify(this.projects));
	},
	/**
	* save project
	* @method save
	* @param 
	*/
	save : function () {
		this.editor.scene.save();
	},
	/**
	* release project with compress js file
	* @method release
	* @param 
	*/
	release: function() {
		$.ajax('release'+this.currentProject['path']);
	},
	/**
	* 
	* @method 
	* @param 
	*/
	reset: function(){
		this.editor.ui.closeAllCode();
		this.editor.ui.unactiveMenu();
		this.editor.scene.scenes={};
		this.editor.res.clearAll();
		this.editor.scene.reset();
		this.editor.ui.scenePane.reset();
		this.currentProject=null;
		this.config=null;
	},
	/**
	* close current project
	* @method close
	* @param 
	*/
	close : function () {
		this.reset();
	}
}
AngoraEditor.ProjectManager.prototype.constructor = AngoraEditor.ProjectManager;
