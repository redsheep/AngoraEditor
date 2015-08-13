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
	loadAll:function(){
		var resources = this.editor.Data.game.resources;
		for(var resID in resources){
			this.editor.UI.gamePanel.addResource(resources[resID]);
		}
	},
	getAll:function(){
		var res = {};
		res.Global = this.editor.Data.game.resources;
		if(this.editor.Data.game.curState!=null)
			res.Local = this.editor.Data.game.curState.resources;
		return res;
	},
	get:function(resID){
		return this.editor.Data.game.resources[resID];
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
		this.editor.UI.gamePanel.addResource(res);
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
