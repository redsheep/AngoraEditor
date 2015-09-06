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

	this.UI=null;

	this.Data=null;

	this.Manager=null;

	this.boot();
	return this;
}
AngoraEditor.prototype = {
	/**
	* Setup all the manager objects
	*
	* @method AngoraEditor#boot
	* @protected
	* @param
	*/
	boot : function () {
		this.UI				= new AngoraEditor.UIComponent(this);

		this.Manager	= new AngoraEditor.ManagerController(this);

		this.Data			=	new AngoraEditor.DataModel();

	}
}
AngoraEditor.prototype.constructor = AngoraEditor;
