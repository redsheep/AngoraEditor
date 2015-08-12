/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor constructor
 *
 * Instantiate a new <code>AngoraEditor</code> object.
 * @class AngoraEditor
 * @classdesc
 * @constructor
 */
AngoraEditor.ProjectModel = function (Data) {
	this.Data 	= Data;
	this.config = {};
	this.path 	= null;
}

AngoraEditor.ProjectModel.prototype = {
	add:function(project){
		this.Data.sysyem.file.readFile('/data/projects.json',function(data){
			var projects=JSON.parse(data);
			projects[project.name]=project;
			this.Data.filesystem.writeFile('/data/projects.json',JSON.stringify(projects, null, '\t'))
		});
	},
	save:function(){
		//this.Data.filesystem.writeFile();
	},
	load:function(project){
		var self = this;
		this.config=project.config;
		this.path=project.path;
		this.Data.system.File.readFile(project.path+'/scenes.json',function(data){
			var states = JSON.parse(data);
			for (var state in states){
				self.Data.game.addState(state);
			}
			self.onStateLoaded();
		});
		this.Data.system.File.readFile(project.path+'/preload.res',function(data){
			var resources = JSON.parse(data);
			for (var key in resources){
				self.Data.game.addResource(resources[key]);
			}
			self.onResourceLoaded();
		});
		//this.Data.game.load();
	},
	setConfig:function(param,value){
		this.config[param]=value;
	},
	clear:function(){
		this.config={};
		this.path=null;
	},
	onStateLoaded:function(){},
	onResourceLoaded:function(){}
}

AngoraEditor.ProjectModel.prototype.constructor = AngoraEditor.ProjectModel;
