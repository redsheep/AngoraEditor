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
AngoraEditor.SystemController = function () {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	//this.editor 		= editor;
	/**
	 * @property {string} - application path
	 */
	this.Path	=	{
		appPath				: "",
		templatePath	: "/template",
		workspacePath	: "/workspace",
		projectFile		: "/data/projects.json",
		configFile		: "/data/perferences.cfg",
		langPath			: "/data/lang"
	};

	this.perferences= {};

	this.File				= new AngoraEditor.FileManager();

	this.clipboard	= null;

	this.history		= null;

}

AngoraEditor.SystemController.prototype = {
	loadPerferences: function(finished){
		/*var editor=this.editor;
		editor.file.readFile(this.configFile,function(data){
			editor.system.config=JSON.parse(data);
			finished();
		});*/
	},

	applyModify : function () {

	},
	/**
	*
	* @method
	* @param
	*/
	get : function (param) {

	},
	/**
	*
	*
	* @method
	* @param
	*/
	set : function (param, value) {

	},
	/**
	*
	*
	* @method
	* @param
	*/
	exit : function () {

	}
}
AngoraEditor.SystemController.prototype.constructor = AngoraEditor.SystemController;
