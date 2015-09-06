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
		this.editor.Data.system.File.readFile(path,function(script){
			self.editor.UI.codePanel.addCodeEditor(state,script,'stateScript');
		});
	}
}

AngoraEditor.ManagerController.CodeManager.prototype.constructor=AngoraEditor.ManagerController.CodeManager;
