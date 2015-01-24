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
AngoraEditor.FileManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
}
AngoraEditor.FileManager.prototype = {
	/**
	* create a new directory
	* @method createDirectory
	* @param {string} filepath
	*/
	createDirectory : function (filepath) {
		//var file = Ti.Filesystem.getFile(filepath);
		//file.createDirectory();
		$.get('/mkdir',{"path":filepath});
	},
	/**
	* create a new file
	* @method createFile
	* @param {string} filepath
	*/
	createFile : function (filepath) {
		//var file = Ti.Filesystem.getFile(filepath);
		//file.touch();
		//return file;
	},
	/**
	* 
	* @method copyFile
	* @param {string} src - source file path
	* @param {string} dest - destination file path
	* @param {string} filename
	*/
	copyFile : function (src, dest,filename) {
		/*if(typeof filename==='undefined'){
			var file = Ti.Filesystem.getFile(src);
			file.copy(dest);
		}else{
			var file = Ti.Filesystem.getFile("{0}\\{1}".format(src,filename));
			file.copy("{0}\\{1}".format(dest,filename));
		}*/
		//$.get('/copyfile',{"src":templatefile,"dest":scenefile});
	},
	/**
	* create file from template file
	* @method copyFile
	* @param {string} path - project path
	* @param {string} src - source file name
	* @param {string} dest - destination file name
	*/
	createTemplate: function(path,src,dest) {
		if(typeof dest==='undefined') dest=src;
		$.get('/createTemplate',{"src":src,"path":path,"dest":dest});
	},
	/**
	* read file
	* @method readFile
	* @param {string} filepath
	* @param {function} func - callback function when read success
	*/
	readFile : function (filepath,func) {
		//var file = Ti.Filesystem.getFile(filepath);
		//return file.read().toString();
		//var m_data;
		var url='/read'+filepath+'?'+ new Date().getTime()
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
	writeFile : function (filepath, contents) {
		//var file = Ti.Filesystem.getFile(filepath);
		//return file.write(contents);
		$.post('/write',{"path":filepath,"data":contents});
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
		//var file = Ti.Filesystem.getFile(filepath);
		//return file.deleteFile();
	},
	/**
	* is the file exist
	* @method existFile
	* @param {string} filepath
	*/
	existFile : function (filepath) {
		//var file = Ti.Filesystem.getFile(filepath);
		//return file.exists();
	},
	/**
	* is the file empty
	* @method emptyFile
	* @param {string} filepath
	*/
	emptyFile : function (filepath) {
		//var file = Ti.Filesystem.getFile(filepath);
		//return file.size() === 0;
	},
	/**
	* upload file
	* @method uploadFile
	* @param {string} url
	* @param {string} data
	* @param {function} func
	*/	
	uploadFile: function(url,data,func) {
		$.ajax({
			url : url,
			type: "POST",
			data : data,
			cache: false,
			dataType: 'json', 
			processData: false,
			contentType: false,
			success:function(data){
				func(data);
			},
			error: function(){
				alert('upload failed');   
			}
		});
	},
	/**
	* open file select dialog and upload
	* @method openFileDialog
	* @param {string} basepath
	* @param {function} func
	*/
	openFileDialog : function (basepath, func) {
		//Ti.UI.openFileChooserDialog(func);
		var p=this;
		
		$("#upload").off('change').on('change',function (){
			$('#filedialog').trigger('submit');
		});
		//$('#filedialog').submit(function(){
		//	p.uploadFile('/files',data, func);
		//});
		var projectpath=this.editor.project.currentProject.path;
		$("#filedialog").off('submit').on('submit',function(event) {
			event.preventDefault();
			var data = new FormData(this);
			$.ajax({
				type        : "POST",
				url         : "files{0}/data".format(projectpath),
				data        : data,
				contentType : false,
				processData : false
			}).done(function (data) {
				func(data);
			}); 
			return true;
		});
		$("#upload").trigger('click');
	},
	/**
	* open folder select dialog
	* @method openFolderDialog
	* @param {function} func
	*/
	openFolderDialog : function (func) {
		//Ti.UI.openFolderChooserDialog(func);
	}
}
AngoraEditor.FileManager.prototype.constructor = AngoraEditor.FileManager;
