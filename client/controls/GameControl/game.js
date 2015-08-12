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
	this.editor		=editor;

}
AngoraEditor.ManagerController.GameManager.prototype={

	loadState: function(state){
		this.editor.Data.game.loadState(state);
		this.editor.UI.nodeTree.setup();
		this.editor.UI.gamePanel.setup();
	},
	removeState: function(state){
		this.editor.Data.game.removeState(state);
	}
}

AngoraEditor.ManagerController.GameManager.prototype.constructor=AngoraEditor.ManagerController.GameManager;
