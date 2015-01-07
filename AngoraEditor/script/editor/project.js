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
		$.getJSON(this.editor.system.projectFile, function(json) {
			p.projects=json;
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
		this.currentProject={};
		this.currentProject['name'] 		= project['name'];
		this.currentProject['path'] 		= project['path'];
		this.currentProject['configFile']	= this.currentProject['path']+'/config.json';
		this.currentProject['sceneFile']	= this.currentProject['path']+'/scenes.json';
		var p=this;
		if(this.config==null){
			this.editor.file.readFile(this.currentProject['configFile'],function(json){
				p.config=JSON.parse(json);
				p.editor.game.setup(p.config);
				p.editor.ui.gamePane.setupConfig();
				console.log('game setup ready');
				p.editor.scene.setup(finished);
				console.log('New Project Create Success!');
			});			
		}else{
			p.editor.game.setup(p.config);
			p.editor.ui.gamePane.setupConfig();
			console.log('game setup ready');
			p.editor.scene.setup(finished);
			console.log('New Project Create Success!');
		}		
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
		this.editor.file.createTemplate(project.path,'mygame.js');
		this.editor.file.createTemplate(project.path,'createscene.js');
		this.editor.file.createTemplate(project.path,'phaser.min.js');
		this.editor.file.readFile(project.path+'/mygame.js',function(data){
			data = data.replace(/{w}/g, config.display.width);
			data = data.replace(/{h}/g, config.display.height);
			editor.file.writeFile(project.path+'/mygame.js',data);
			if(load==true){
				editor.project.load(project,function(){editor.scene.add('preload');});
				//editor.scene.add('preload');
			}
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
		this.editor.scene.scenes={};
		this.editor.res.clearAll();
		this.editor.scene.reset();
		this.editor.ui.scenePane.reset();
		this.currentProject=null;
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
