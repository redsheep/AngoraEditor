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
AngoraEditor.Layout = function () {
  this.Dom=$('#layout');
}

AngoraEditor.Layout.prototype = {
  function addPanel(dock,control){
    this.Dom.layout('add',{
      region:dock,
      title:'Title',
      split:true,
      href:control.view
    });
  }
}

AngoraEditor.Layout.prototype.constructor = AngoraEditor.Layout;
