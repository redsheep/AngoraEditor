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
	this.startState =null;
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
			self.template.createScene(path,scene,function(){
				if(self.startState==null){
					self.startState=scene;
					self.template.setupStartState(path,scene,finished);
				}
			});
		});
	},
	saveCurrentState:function(){
		var state=this.Data.game.curState.name;
		var nodes={};
		for(var key in this.Data.game.curState.nodes){
			var node = this.Data.game.curState.nodes[key];
			nodes[node.id]={id:node.id,type:node.type};
			for(var key in node.property){
				nodes[node.id][key]=node.property[key];
			}
		}
		this.Data.system.File.writeFile(this.path+'/{0}.scn'.format(state),
			JSON.stringify(nodes, null, '\t'),function(){
				console.log('success save state',state);
		});
		var resources={};
		for(var key in this.Data.game.resources){
			var res = this.Data.game.resources[key];
			resources[res.id]={id:res.id,type:res.type,path:res.path};
			for(var key in res.property){
				resources[res.id][key]=res.property[key];
			}
		}
		this.Data.system.File.writeFile(this.path+'/global.res',
			JSON.stringify(resources, null, '\t'),function(){
				console.log('success save resources');
		});
	},
	load:function(project){
		var self = this;
		this.config=project.config;
		this.path=project.path;
		if(this.template==null)
			this.template = new AngoraEditor.PhaserTemplate(self.Data);
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
		this.startState=null;
		this.template=null;
	},
	onStateLoaded:function(){},
	onResourceLoaded:function(){}
}

AngoraEditor.ProjectModel.prototype.constructor = AngoraEditor.ProjectModel;
