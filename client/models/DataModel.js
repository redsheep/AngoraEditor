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
AngoraEditor.DataModel = function () {

	this.project	= new AngoraEditor.ProjectModel();

  this.game 		= new AngoraEditor.GameModel();

	return this;
}

AngoraEditor.DataModel.prototype = {
	getAllProjects:function(success){
		var projectfile = System.Path.projectFile;
		System.File.readFile(projectfile,success);
	},
	load:function(project){
		this.project.load(project);
		this.game.load(project);
	},
	save:function(project){
		//this.project.save();
		//this.game.save();
	},
	clear:function(){
		this.project.clear();
		this.game.clear();
	}
}

AngoraEditor.DataModel.prototype.constructor = AngoraEditor.DataModel;
