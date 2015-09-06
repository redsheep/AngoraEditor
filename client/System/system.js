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
AngoraEditor.SystemManager = function () {
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

	this.perferences= null;//new AngoraEditor.PerferenceManager();

	this.File				= new AngoraEditor.FileManager();

	this.Clipboard	= null;//new AngoraEditor.ClipboardManager();

	this.Language		= null;//new AngoraEditor.LanguageManager();

	this.Template		= new AngoraEditor.PhaserTemplate();

}

AngoraEditor.SystemManager.prototype = {

}
AngoraEditor.SystemManager.prototype.constructor = AngoraEditor.SystemManager;
