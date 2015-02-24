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
		var editor=this;
		this.file 	= new AngoraEditor.FileManager(this);
		console.log('file ready');
		this.system	= new AngoraEditor.SystemConfig(this);
		console.log('system ready');
		this.system.setup(function(){
			editor.ui 	= new AngoraEditor.UI(editor);
			console.log('ui ready');
			editor.scene 	= new AngoraEditor.SceneManager(editor);
			console.log('scene ready');
			editor.game 	= new AngoraEditor.GameManager(editor);
			console.log('game ready');
			editor.res 	= new AngoraEditor.ResourceManager(editor);
			console.log('resource ready');
			editor.project= new AngoraEditor.ProjectManager(editor);
			console.log('project ready');
			editor.node	= new AngoraEditor.NodeManager(editor);
			console.log('node ready');
			editor.attr	= new AngoraEditor.NodeAttrManager(editor);
			console.log('attr ready');
			editor.script	= new AngoraEditor.ScriptManager(editor);
			console.log('script ready');
			
			editor.project.setup();
			editor.ui.setup();
		});
	}
}

AngoraEditor.prototype.constructor = AngoraEditor;
