/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.GameManager constructor
 *
 * Instantiate <code>AngoraEditor.GameManager</code> object.
 * @class AngoraEditor.GameManager
 * @classdesc
 * @constructor
 */
AngoraEditor.ManagerController.CodeManager=function(editor){
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor			=	editor;
}
AngoraEditor.ManagerController.CodeManager.prototype={
	loadStateScript:function(state){
		var path = "{0}/{1}.script.js".format(this.editor.Data.project.path,state);
		System.File.readFile(path,function(script){
			self.editor.UI.codePanel.addCodeEditor(state,script,'stateScript');
		});
	},
	getCode:function(state){
		return self.editor.UI.codePanel.editors[state].editor.getValue();
	}
}

AngoraEditor.ManagerController.CodeManager.prototype.constructor=AngoraEditor.ManagerController.CodeManager;
