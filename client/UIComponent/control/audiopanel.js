/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.EventPaneManager constructor
 *
 * Instantiate <code>AngoraEditor.EventPaneManager</code> object.
 * @class AngoraEditor.EventPaneManager
 * @classdesc
 * @constructor
 */
AngoraEditor.AudioPanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.editors=[];

  this.Dom=$('#audioTab');
}
AngoraEditor.AudioPanel.prototype = {
  setup:function(){

  }
}

AngoraEditor.AudioPanel.prototype.constructor = AngoraEditor.AudioPanel;
