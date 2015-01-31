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
AngoraEditor.ScriptManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
}
AngoraEditor.ScriptManager.prototype = {
	/**
	* load scene script
	* @method loadSceneScript
	* @param {string} scene name
	* @param {function} - callback after scene script loaded
	*/
	loadSceneScript : function (scene, func) {
		var projectpath = this.editor.project.currentProject.path;
		this.editor.file.readFile('{0}/{1}.script.js'.format(projectpath, scene),function(data){
			func(data);
		});
	},
	/**
	* create scene script for new scene
	* @method createScript
	* @param {string} scene name
	*/
	createScript : function (scene) {
	var editor=this.editor;
		var projectpath = this.editor.project.currentProject.path;
		this.editor.file.readFile('/template/scene.js',function(data){
			var sceneScript = data.replace(/{sceneName}/g, scene);
			editor.file.writeFile("{0}/{1}.js".format(projectpath, scene), sceneScript);		
		});
		this.editor.file.readFile('/template/scene.script.js',function(data){
			if(scene=='preload')
				data+="\n{sceneName}.prototype.shotdown=function(){}";
			var customSceneScript = data.replace(/{sceneName}/g, scene);
			editor.file.writeFile("{0}/{1}.script.js".format(projectpath, scene), customSceneScript);
		});
	},
	/**
	* save script
	* @method saveScript
	* @param 
	*/
	saveScript : function (scene) {},
	/**
	* add a new Script
	* @method addScript
	* @param 
	*/
	addScript : function () {},
	/**
	* add custom scirpt to node
	* @method addScriptToNode
	* @param 
	*/
	addScriptToNode : function (node) {}
}
AngoraEditor.ScriptManager.prototype.constructor = AngoraEditor.ScriptManager;
