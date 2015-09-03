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
AngoraEditor.ManagerController = function (editor) {

  this.project  = new AngoraEditor.ManagerController.ProjectManager(editor);

  this.game     = new AngoraEditor.ManagerController.GameManager(editor);

  this.gameNode = new AngoraEditor.ManagerController.GameNodeManager(editor);

  this.resource = new AngoraEditor.ManagerController.ResourceManager(editor);

  this.app      = new AngoraEditor.ManagerController.AppManager(editor);

  this.view     = new AngoraEditor.ManagerController.ViewManager(editor);

  this.code     = new AngoraEditor.ManagerController.CodeManager(editor);

  this.boot();
}
AngoraEditor.ManagerController.prototype = {
	/**
	* Setup all the manager objects
	*
	* @method AngoraEditor#boot
	* @protected
	* @param
	*/
	boot : function () {


	}
}

AngoraEditor.ManagerController.prototype.constructor = AngoraEditor.ManagerController;
