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

	this.system 	= new AngoraEditor.SystemController();

	this.project	= new AngoraEditor.ProjectModel(this);

  this.game 		= new AngoraEditor.GameModel(this);

	return this;
}

AngoraEditor.DataModel.prototype = {
	getAllProjects:function(success){
		var projectfile = this.system.Path.projectFile;
		this.system.File.readFile(projectfile,success);
	},
	clear:function(){
		this.project.clear();
		this.game.clear();
	}
}

AngoraEditor.DataModel.prototype.constructor = AngoraEditor.DataModel;
