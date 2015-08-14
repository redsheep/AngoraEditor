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
AngoraEditor.ScenePanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {jquery object}
	 */
	this.Dom = $('#scenes');

	this.setupCallback();
}
AngoraEditor.ScenePanel.prototype = {
	setupCallback:function(){
		var self = this;
		this.Dom.delegate('.sceneitem', 'click', function () {
			self.editor.Manager.game.loadState(this.innerHTML);
		});
		$("#addScene").click(function () {
			self.editor.Manager.game.addState();
		});
		$("#removeScene").click(function () {
			self.editor.Manager.game.removeState();
		});
	},
	/**
	 * add a new scene
	 * @method add
	 * @param {string} scene
	 */
	add : function (scene) {
		var newdiv = "<li sceneID='{0}' class='sceneitem'>{1}</li>";
		this.Dom.append(newdiv.format(scene, scene));
	},
	/**
	 * remove a scene
	 * @method remove
	 * @param {string} scene
	 */
	remove : function (scene) {
		$(".sceneitem[sceneID='" + scene + "']").remove();
	},
	/**
	 * reset scene
	 * @method reset
	 * @param
	 */
	reset : function () {
		this.Dom.empty();
	}
}

AngoraEditor.ScenePanel.prototype.constructor = AngoraEditor.ScenePanel;