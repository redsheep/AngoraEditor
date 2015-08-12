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
Resource = function () {

	this.uid=null;

	this.type=null;

  this.property={};

	return this;
}

Resource.prototype = {
	addAttr:function(){

	},
	modifyAttr:function(){

	},
	removeAttr:function(){

	}

}

Resource.prototype.constructor = Resource;
