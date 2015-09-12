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
AngoraEditor.ProjectModel = function () {
	this.config = {};
	this.path 	= null;
}

AngoraEditor.ProjectModel.prototype = {
	load:function(project){
		var self = this;
		this.config=project.config;
		this.path=project.path;
		System.History.setProject(this);
	},
	add:function(project,finished){
		var self=this;
		System.File.readFile('/data/projects.json',function(data){
			var projects=JSON.parse(data);
			projects[project.name]=project;
			System.Template = new AngoraEditor.PhaserTemplate(self.Data);
			//System.File.writeFile('/data/projects.json',JSON.stringify(projects, null, '\t'))
			System.File.createDirectory(project.path,function(){
				System.History.createLogFile(project);
				System.Template.createTemplate(project,finished);
			});
		});
	},
	setConfig:function(param,value){
		this.config[param]=value;
	},
	clear:function(){
		this.config={};
		this.path=null;
		this.startState=null;
		this.template=null;
	}
}

AngoraEditor.ProjectModel.prototype.constructor = AngoraEditor.ProjectModel;
