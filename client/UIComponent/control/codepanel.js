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
AngoraEditor.CodePanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.editors=[];

  this.Dom=$('#codepanel');

  this.currentEditor=null;

	this.setup();
}
AngoraEditor.CodePanel.prototype = {
  setup:function(){

  },
  createEditor:function(filename){
    createCodeMirror();
  },
  addCodeEditor:function(filename){
    this.createEditor(filename);
    this.Dom.addTab();
  },
  removeCodeEditor:function(filename){
    this.Dom.closeTab();
    this.editors[filename].close();
  }
}

AngoraEditor.CodePanel.prototype.constructor = AngoraEditor.CodePanel;
