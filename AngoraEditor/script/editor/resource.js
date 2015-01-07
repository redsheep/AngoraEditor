/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.ResourceManager constructor
 *
 * Instantiate <code>AngoraEditor.ResourceManager</code> object.
 * @class AngoraEditor.ResourceManager
 * @classdesc
 * @constructor
 */
AngoraEditor.ResourceManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Object} - global resources
	 */
	this.globalres={};
	/**
	 * @property {Object} - local resources
	 */
	this.localres={};
	/**
	 * @property {Object} - selected resource
	 */
	this.selected = null;
}
AngoraEditor.ResourceManager.prototype = {
	/**
	* setup the scene resource from json file
	* @method loadFromFile
	* @param {string} sceneName
	* @param {function} func - callback when load finished
	*/
	loadFromFile : function (scene,finished) {
		//this.clear();
		var editor = this.editor;
		
		//if (editor.file.emptyFile(filepath))
		//	return false;
		//this.resources = JSON.parse(editor.file.readFile(filepath));
		var p=this;
		if(scene=='preload') return;
		var localrespath = "{0}/{1}.res".format(editor.project.currentProject.path, scene);
		this.editor.file.readFile(localrespath,function(data){
			p.localres=JSON.parse(data);
			finished();
		});
	},
	/**
	* load the global res
	* @method loadPreloadRes
	* @param {function} func - callback when load finished
	*/
	loadPreloadRes : function(finished){
		var editor=this.editor;
		var p=this;
		var gloablrespath = "{0}/preload.res".format(editor.project.currentProject.path);
		this.editor.file.readFile(gloablrespath,function(data){
			p.globalres=JSON.parse(data);
			finished();
		});
	},
	/**
	* get game resource
	* @method get
	* @param {string} id
	*/
	get : function (resID) {
		var res=this.globalres[resID];
		if(typeof res==='undefined')
			res=this.localres[resID];
		return res;
	},
	/**
	* add a resource into the manager
	* @method 
	* @param {string} id
	* @param {string} type
	* @param {Object} resource
	*/
	add : function (id, type, res) {
		this.globalres[id] = {
			"id" : id,
			"type" : type
		}
		switch(type){
		case 'image':
			this.globalres[id]['path'] = "data/{0}".format(res.path);
			this.globalres[id]['height'] = res.height;//$('#'+id)[0].natrualHeight;
			this.globalres[id]['width'] = res.width;//$('#'+id)[0].natrualWidth;
			break;
		case 'audio':
		case 'text':
			this.globalres[id]['path'] = "data/{0}".format(res);
			break;
		case 'spritesheet':
			this.globalres[id]['path'] = "data/{0}".format(res.path);
			this.globalres[id]['Xframe'] = res.Xframe;
			this.globalres[id]['Yframe'] = res.Yframe;
			this.globalres[id]['width'] = res.width;
			this.globalres[id]['height'] = res.height;
			break;
		case 'atlas':
			this.globalres[id]['path'] = "data/{0}".format(res.path);
			this.globalres[id]['data'] = "data/{0}".format(res.data);
			break;
		case 'bitmapFont':
			this.globalres[id]['bitmap'] = "data/{0}".format(res.bitmap);
			this.globalres[id]['data'] = "data/{0}".format(res.data);
			break;
		case 'tileMap':
			this.globalres[id]['tileset'] = "data/{0}".format(res.tileset);
			this.globalres[id]['data'] = "data/{0}".format(res.data);
			break;
		default:
			break;
		}
		return this.globalres[id];
	},
	/**
	* remove a resource 
	* @method remove
	* @param {string} id
	*/
	remove : function (resID) {
		delete localres[resID];
	},
	/**
	* clear all resource 
	* @method clear
	* @param 
	*/
	clear : function () {
		this.localres = {};
		this.selected = null;
	},
	/**
	* clear all resource 
	* @method clear
	* @param 
	*/
	clearAll : function () {
		this.localres = {};
		this.globalres = {};
		this.selected = null;
	}
}

AngoraEditor.ResourceManager.prototype.constructor = AngoraEditor.ResourceManager;
