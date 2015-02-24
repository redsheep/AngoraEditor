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
AngoraEditor.SystemConfig = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor 		= editor;
	/**
	 * @property {string} - application path
	 */
	this.appPath		= null;
	/**
	 * @property {string} - template path
	 */
	this.templatePath	= null;
	/**
	 * @property {string} - workspace path
	 */
	this.workspacePath	= null;
	/**
	 * @property {string} - project path
	 */
	this.projectFile	= null;
	this.configFile		= null;
	this.langPath		= null;
	/**
	 * @property {Object} - application config
	 */
	this.config	= {};
}

AngoraEditor.SystemConfig.prototype = {
	setup: function(func){
		this.appPath		= "";//Ti.App.appURLToPath('app://');
		this.templatePath	= this.appPath+"/template";
		this.workspacePath	= this.appPath+"/workspace";
		this.projectFile	= this.appPath+"/data/projects.json";
		this.configFile		= this.appPath+"/data/perferences.cfg";
		this.langPath		= this.appPath+"/data/lang";
		var editor=this.editor;
		this.editor.file.readFile(this.configFile,function(data){
			editor.system.config=JSON.parse(data);
			console.log('system setup');
			func();
		});
	},
	save : function(){
		this.editor.file.writeFile(this.configFile,JSON.stringify(this.config,null,2));
	},
	/**
	* 
	* @method 
	* @param 
	*/
	get : function (config, value) {},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	set : function (config, value) {},
	/**
	* 
	*
	* @method 
	* @param 
	*/
	exit : function () {}
}
AngoraEditor.SystemConfig.prototype.constructor = AngoraEditor.SystemConfig;
