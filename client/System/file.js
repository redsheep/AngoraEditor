/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.FileManager constructor
 *
 * Instantiate <code>AngoraEditor.FileManager</code> object.
 * @class AngoraEditor.FileManager
 * @classdesc
 * @constructor
 */
AngoraEditor.FileManager = function () {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	//this.editor = editor;
}
AngoraEditor.FileManager.prototype = {
	/**
	* create a new directory
	* @method createDirectory
	* @param {string} filepath
	*/
	createDirectory : function (filepath,func) {
		//var file = Ti.FileSystem.getFile(filepath);
		//file.createDirectory();
		$.get('/mkdir',{"path":filepath},func);
	},
	/**
	* is the file exist
	* @method existFile
	* @param {string} filepath
	*/
	existFile : function (filepath,func) {
		var url='/exist'+filepath+'?'+ new Date().getTime()
		return $.get(url,func);
	},
	/**
	* create file from template file
	* @method copyFile
	* @param {string} path - project path
	* @param {string} src - source file name
	* @param {string} dest - destination file name
	*/
	copyFile: function(path,src,dest,func) {
		if(typeof dest==='undefined') dest=src;
		$.get('/copy',{"src":src,"path":path,"dest":dest},func);
	},
	/**
	* read file
	* @method readFile
	* @param {string} filepath
	* @param {function} func - callback function when read success
	*/
	readFile : function (filepath,func) {
		//var file = Ti.FileSystem.getFile(filepath);
		//return file.read().toString();
		//var m_data;
		var url='/read'+filepath+'?'+ new Date().getTime();
		if(typeof func==='undefined')
			$.get(url);
		else
			$.get(url,function(data){
				func(data);
			});
		//return m_data;
	},
	/**
	* write file
	* @method writeFile
	* @param {string} filepath
	* @param {string} contents - content write to file
	*/
	writeFile : function (filepath, contents,func) {
		//var file = Ti.FileSystem.getFile(filepath);
		//return file.write(contents);
		$.post('/write',{"path":filepath,"data":contents},func);
		//.done(function(data){
		//	func(data);
		//});
	},
	/**
	* remove file
	* @method removeFile
	* @param {string} filepath
	*/
	removeFile : function (filepath,func) {
		var url='/remove'+filepath+'?'+ new Date().getTime()
		if(typeof func==='undefined')
			$.get(url);
		else
			$.get(url,function(data){
				func(data);
			});
		//var file = Ti.FileSystem.getFile(filepath);
		//return file.deleteFile();
	},
	/**
	* is the file empty
	* @method emptyFile
	* @param {string} filepath
	*/
	emptyFile : function (filepath) {
		//var file = Ti.FileSystem.getFile(filepath);
		//return file.size() === 0;
	}
}
AngoraEditor.FileManager.prototype.constructor = AngoraEditor.FileManager;
