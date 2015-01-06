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
AngoraEditor = function () {
	/**
	 * @property {AngoraEditor.UI} ui
	 */
	this.ui = null;
	/**
	 * @property {AngoraEditor.FileManager}
	 */
	this.file = null;
	/**
	 * @property {AngoraEditor.SceneManager}
	 */
	this.scene = null;
	/**
	 * @property {AngoraEditor.GameManager}
	 */
	this.game = null;
	/**
	 * @property {AngoraEditor.ResourceManager}
	 */
	this.res = null;
	/**
	 * @property {AngoraEditor.ProjectManager}
	 */
	this.project = null;
	/**
	 * @property {AngoraEditor.NodeManager}
	 */
	this.node = null;
	/**
	 * @property {AngoraEditor.NodeAttrManager}
	 */
	this.attr = null;
	/**
	 * @property {AngoraEditor.ScriptManager}
	 */
	this.script = null;
	/**
	 * @property {AngoraEditor.SystemConfig}
	 */
	this.system = null;
	//setup and run editor
	this.boot();
	return this;
}
AngoraEditor.prototype = {
	/**
	* Setup all the manager objects
	*
	* @method AngoraEditor#boot
	* @protected
	* @param 
	*/
	boot : function () {
		this.ui 	= new AngoraEditor.UI(this);
		console.log('ui ready');
		this.file 	= new AngoraEditor.FileManager(this);
		console.log('file ready');
		this.scene 	= new AngoraEditor.SceneManager(this);
		console.log('scene ready');
		this.game 	= new AngoraEditor.GameManager(this);
		console.log('game ready');
		this.res 	= new AngoraEditor.ResourceManager(this);
		console.log('resource ready');
		this.project= new AngoraEditor.ProjectManager(this);
		console.log('project ready');
		this.node	= new AngoraEditor.NodeManager(this);
		console.log('node ready');
		this.attr	= new AngoraEditor.NodeAttrManager(this);
		console.log('attr ready');
		this.script	= new AngoraEditor.ScriptManager(this);
		console.log('script ready');
		this.system	= new AngoraEditor.SystemConfig(this);
		console.log('system ready');
		
		this.system.setup();
		this.ui.setup();
		this.project.setup();
	}
}

AngoraEditor.prototype.constructor = AngoraEditor;
