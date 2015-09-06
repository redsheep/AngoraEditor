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
AngoraEditor.ManagerController.ProjectManager = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
}
AngoraEditor.ManagerController.ProjectManager.prototype = {
	/**
	* load project
	* @method load
	* @param {string} project
	*/
	load: function(project){
		var self=this;
		self.editor.Data.clear();
		self.editor.UI.resetAll();
		self.editor.Data.project.onStateLoaded=function(){
			for(var state in self.editor.Data.game.states){
				self.editor.UI.scenePanel.add(state);
			}
		}
		self.editor.Data.project.onResourceLoaded=function(){
			var resources = self.editor.Data.game.resources;
			for(var key in resources){
				self.editor.Manager.resource.add(resources[key]);
			}
			self.editor.UI.gamePanel.startLoadResources();
		}
		self.editor.Data.project.load(project);
		self.editor.UI.menu.activeMenu();
	},
	add : function(project,finished){
		this.editor.Data.project.add(project,finished);
	},
	/**
	* remove project
	* @method remove
	* @param {string} project name
	*/
	remove : function (name) {
		this.editor.Data.project.remove(name);
	},
	getPath: function(){
		return this.editor.Data.project.path;
	},
	/**
	* save project
	* @method save
	* @param
	*/
	save : function () {
		this.editor.Data.project.saveCurrentState();
		var path=this.editor.Data.project.path;
		var state=this.editor.Data.game.curState.name;
		this.editor.Data.system.File.writeFile(path+'/{0}.script.js'.format(state),
			this.editor.Manager.code.getCode(state),function(){
				console.log('success save state code');
		});
	},
	/**
	* release project with compress js file
	* @method release
	* @param
	*/
	release: function() {
		this.editor.Data.project.release();
	},
	/**
	*
	* @method
	* @param
	*/
	close: function(){
		this.editor.Data.game.reset();
		this.editor.Data.project.reset();
	}
}
AngoraEditor.ManagerController.ProjectManager.prototype.constructor = AngoraEditor.ManagerController.ProjectManager;
