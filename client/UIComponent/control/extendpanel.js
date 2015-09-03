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
AngoraEditor.ExtendPanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.editors=[];

  this.Dom=$('#extendTab');

	this.setup();
}
AngoraEditor.ExtendPanel.prototype = {
  setup:function(){
		this.Dom.append("<div class='resrect'>light</div>");
		this.Dom.append("<div class='resrect'>trigger</div>");
		this.Dom.append("<div class='resrect'></div>");
  }
}

AngoraEditor.ExtendPanel.prototype.constructor = AngoraEditor.ExtendPanel;
