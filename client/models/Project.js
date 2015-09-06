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
	this.template = null;
}

AngoraEditor.ProjectModel.prototype = {
	add:function(project,finished){
		var self=this;
		this.Data.system.File.readFile('/data/projects.json',function(data){
			var projects=JSON.parse(data);
			projects[project.name]=project;
			self.template = new AngoraEditor.PhaserTemplate(self.Data);
			self.Data.system.File.writeFile('/data/projects.json',JSON.stringify(projects, null, '\t'))
			self.Data.system.File.createDirectory(project.path,function(){
				self.template.createTemplate(project,finished);
			});
		});
	},
	addState:function(scene,finished,path){
		var self = this;
		var path = path || this.path;
		this.Data.system.File.readFile(path+'/scenes.json',function(data){
			var scenes=JSON.parse(data);
			scenes[scene]={'name':scene,'id':scene};
			self.Data.system.File.writeFile(path+'/scenes.json',JSON.stringify(scenes, null, '\t'));
			self.template.createScene(path,scene,finished);
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
		this.Data.system.File.readFile(project.path+'/global.res',function(data){
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
