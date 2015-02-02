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
AngoraEditor.ScenePaneManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {jquery object}
	 */
	this.pane = $('#scenes');
}
AngoraEditor.ScenePaneManager.prototype = {
	/**
	 * load and setup scene pane DOM
	 * @method loadData
	 * @param {string} scene
	 */
	loadData : function (scene) {
		var editor = this.editor;
		var scenes = editor.scene.scenes;
		var newdiv = "<button sceneID='{0}' class='sceneitem'>{1}</button>";
		for (i in scenes) {
			this.pane.append(newdiv.format(i, scenes[i].name));
		}
		this.pane.delegate('.sceneitem', 'click', function () {
			if(editor.scene.isChanged()){
				editor.ui.confirm('Warning',"do you want to save changed?",function(r){
					if(r) editor.scene.save();
				});
			}
			var sceneDiv=$('.selectedsceneitem');
			if(sceneDiv.length>0){
				sceneDiv.removeClass('selectedsceneitem');
			}
			$(this).addClass('selectedsceneitem');
			editor.scene.load($(this).attr('sceneID'));
		});
	},
	/**
	 * add a new scene
	 * @method add
	 * @param {string} scene
	 */
	add : function (scene) {
		var editor = this.editor;
		var newdiv = "<button sceneID='{0}' class='sceneitem'>{1}</button>";
		this.pane.append(newdiv.format(scene, scene));
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
		this.pane.empty();
	}
}

AngoraEditor.ScenePaneManager.prototype.constructor = AngoraEditor.ScenePaneManager;
