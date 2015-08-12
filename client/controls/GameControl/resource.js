/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.ResourceManager constructor
 *
 * Instantiate <code>AngoraEditor.ResourceManager</code> object.
 * @class AngoraEditor.ResourceManager
 * @classdesc
 * @constructor
 */
AngoraEditor.ManagerController.ResourceManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
}
AngoraEditor.ManagerController.ResourceManager.prototype = {
	load:function(game,res){
		var projectPath = this.editor.Data.project.path;
		switch (res.type) {
			case 'image':
				game.load.image(res.id,'{0}/{1}'.format(projectPath,res.path));
				break;
			default:
		}
	},
	/**
	* add a resource into the manager
	* @method
	* @param {string} id
	* @param {string} type
	* @param {Object} resource
	*/
	add : function (res) {
		this.editor.Data.game.addResource(res);
	},
	/**
	* remove a resource
	* @method remove
	* @param {string} id
	*/
	remove : function (resID) {
		this.editor.Data.game.removeResource(resID);
	},
	/**
	* clear all resource
	* @method clear
	* @param
	*/
	clear : function () {

	},
}

AngoraEditor.ManagerController.ResourceManager.prototype.constructor = AngoraEditor.ManagerController.ResourceManager;
