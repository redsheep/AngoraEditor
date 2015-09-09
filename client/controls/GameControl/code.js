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
	loadStateScript:function(state,finished){
		var self=this;
		var path = "{0}/{1}.script.js".format(this.editor.Data.project.path,state);
		System.File.readFile(path,function(script){
			self.editor.UI.codePanel.addCodeEditor(state,script,'stateScript');
			if(finished!=null) finished();
		});
	},
	getStateCode:function(state){
		return this.editor.UI.codePanel.editors[state].editor.getValue();
	},
	addEvent:function(state,functionName){
		var self=this;
		self.editor.Manager.code.loadStateScript(state,function(){
			self.editor.UI.codePanel.updateCodeEditor(state,
			System.Template.createEvent({state:state,functionName:functionName}));
			self.showCode(state);
		});
	},
	showCode:function(state){
		this.editor.UI.codePanel.selectTab(state);
	}
}

AngoraEditor.ManagerController.CodeManager.prototype.constructor=AngoraEditor.ManagerController.CodeManager;
