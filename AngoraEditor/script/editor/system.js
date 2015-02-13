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
	this.setup();
}

AngoraEditor.SystemConfig.prototype = {
	setup: function(){
		this.appPath		= "";//Ti.App.appURLToPath('app://');
		this.templatePath	= this.appPath+"/template";
		this.workspacePath	= this.appPath+"/workspace";
		this.projectFile	= this.appPath+"/data/projects.json";
		this.configFile		= this.appPath+"/data/perferences.cfg";
		this.langPath		= this.appPath+"/data/lang";
		var editor=this.editor;
		this.editor.file.readFile(this.configFile,function(data){
			editor.system.config=JSON.parse(data);
			editor.ui.showRegion=parseBoolean(editor.system.config.display.worldBounds);
			if(editor.ui.showRegion)$('#worldbounds').css('visibility','visible');
			editor.ui.showGrid=parseBoolean(editor.system.config.display.showGrid);
			if(!editor.ui.showGrid)$('#preview').removeClass('grid');
			editor.ui.gridSize=parseInt(editor.system.config.display.gridSize);
			$('#preview').css('background-size','{0}px {0}px'.format(editor.ui.gridSize));
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
