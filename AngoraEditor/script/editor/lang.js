/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.LanguageManger constructor
 *
 * Instantiate <code>AngoraEditor.LanguageManger</code> object.
 * @class AngoraEditor.LanguageManger
 * @classdesc
 * @constructor
 */
AngoraEditor.LanguageManger = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {jquery object}
	 */
	this.menu = {};
}
AngoraEditor.LanguageManger.prototype = {
	setup: function(lang){
		editor=this.editor;
		editor.file.readFile('{0}/{1}.lang'.format(editor.system.langPath,lang),function(data){
			var langdata=JSON.parse(data);
			
		});
	}
}

AngoraEditor.LanguageManger.prototype.constructor = AngoraEditor.LanguageManger;
