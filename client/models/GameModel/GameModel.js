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
AngoraEditor.GameModel = function (Data) {

	this.Data				=	Data;

	this.resources	= {};

  this.states			= {};

	this.curState		= null;

	return this;
}

AngoraEditor.GameModel.prototype = {
	addState:function(state,create){
		this.states[state]=new StateModel(this.Data,state,create);
	},
	removeState:function(state){
		delete this.states[state];
	},
	loadState:function(state){
		this.curState=this.states[state];
	},
	addResource:function(res){
		this.resources[res.id]=res;
	},
	removeResource:function(res){
		delete this.resources[res.id];
	},
	clear:function(){
		this.resources={};
		this.states={};
		this.curState=null;
	}
}

AngoraEditor.GameModel.prototype.constructor = AngoraEditor.GameModel;
