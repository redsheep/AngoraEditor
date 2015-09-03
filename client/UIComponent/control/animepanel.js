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
AngoraEditor.AnimatePanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.editors=[];

  this.Dom=$('#animeTab');
}
AngoraEditor.AnimatePanel.prototype = {
  setup:function(){
		
  }
}

AngoraEditor.AnimatePanel.prototype.constructor = AngoraEditor.AnimatePanel;
