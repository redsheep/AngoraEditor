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
AngoraEditor.GameModel = function () {
	this.resources	= {};

  this.states			= {};

	this.basePath		= null;

	this.curState		= null;

	this.startState =null;

}

AngoraEditor.GameModel.prototype = {
	load:function(project){
		this.basePath=project.path;
		this.getAllStates();
		this.getResources();
	},
	getAllStates:function(project){
		var self=this;
		System.File.readFile(this.basePath+'/scenes.json',function(data){
			var states = JSON.parse(data);
			for (var state in states){
				self.addState(state);
			}
			self.onStateLoaded();
		});
	},
	loadState:function(state){
		this.curState=this.states[state];
	},
	addState:function(state){
		var self=this;
		this.states[state]=new StateModel(this,state);
		System.Template.createScene(self.basePath,state,function(){
			if(self.startState==null){
				self.startState=state;
				System.Template.setupStartState(self.basePath,state);
			}
		});
		this.saveState(state);
	},
	removeState:function(state){
		delete this.states[state];
		this.saveState(state);
	},
	saveState:function(state){
		var self=this;
		System.File.readFile(this.basePath+'/scenes.json',function(data){
			var scenes=JSON.parse(data);
			scenes[state]={'name':state,'id':state};
			System.File.writeFile(self.basePath+'/scenes.json',JSON.stringify(scenes, null, '\t'));
		});
	},
	getResources:function(){
		var self=this;
		System.File.readFile(this.basePath+'/global.res',function(data){
			var resources = JSON.parse(data);
			for (var key in resources){
				self.addResource(resources[key]);
			}
			self.onResourceLoaded();
		});
	},
	addResource:function(res){
		if(res.id in this.resources) return;
		this.resources[res.id]=new Resource(res);
		System.History.addRecord({type:'resource',operate:'add',target:res.id});
	},
	removeResource:function(res){
		delete this.resources[res.id];
		System.History.addRecord({type:'resource',operate:'remove',target:res.id});
	},
	saveResource:function(){
		var resources={};
		for(var key in this.resources){
			var res = this.resources[key];
			resources[res.id]={id:res.id,type:res.type,path:res.path};
			for(var key in res.property){
				resources[res.id][key]=res.property[key];
			}
		}
		System.File.writeFile(this.basePath+'/global.res',
			JSON.stringify(resources, null, '\t'),function(){
				console.log('success save resources');
		});
	},
	clear:function(){
		this.resources={};
		this.states={};
		this.curState=null;
		this.basePath=null;
		System.History.clear();
	},
	onStateLoaded:function(){},
	onResourceLoaded:function(){}
}

AngoraEditor.GameModel.prototype.constructor = AngoraEditor.GameModel;
