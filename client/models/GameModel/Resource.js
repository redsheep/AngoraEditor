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
Resource = function (res) {

	this.id=res.id;

	this.type=res.type;

	this.path=res.path;

  this.property={};

	for(var key in res){
		if(key=='id' || key=='type' ||key=='path') continue;
		this.property[key]=res[key];
	}

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
