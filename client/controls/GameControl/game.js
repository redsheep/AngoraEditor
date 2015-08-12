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
AngoraEditor.ManagerController.GameManager=function(editor){
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor			=	editor;
}
AngoraEditor.ManagerController.GameManager.prototype={

	loadState: function(state){
		this.editor.Data.game.loadState(state);
		this.editor.UI.nodeTree.setup();
		this.editor.UI.gamePanel.setup();
	},
	addState:function(state){
		var self = this;
		this.editor.UI.prompt('Add Scene','Enter scene name',function(state){
			self.editor.Data.game.addState(state,true);
			self.editor.UI.scenePanel.add(state);
		});
	},
	removeState: function(state){
		var self = this;
		this.editor.UI.confirm('Warning',"remove local file?",function(r){
			var state =  self.editor.Data.game.curState.name;
			self.editor.Data.game.removeState(state);
			self.editor.UI.scenePanel.remove(state);
		});
	}
}

AngoraEditor.ManagerController.GameManager.prototype.constructor=AngoraEditor.ManagerController.GameManager;
