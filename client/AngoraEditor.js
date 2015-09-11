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

	this.Data		= new AngoraEditor.DataModel();

	this.Manager= new AngoraEditor.ManagerController(this);

	this.UI			= new AngoraEditor.UIComponent(this);

}
AngoraEditor.prototype.constructor = AngoraEditor;
