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
AngoraEditor.ManagerController.ViewManager = function (editor) {
  this.editor = editor;
}
AngoraEditor.ManagerController.ViewManager.prototype = {
	/**
	* Setup all the manager objects
	*
	* @method AngoraEditor#boot
	* @protected
	* @param
	*/
  showAnimeEditor : function () {
    var dlg = new AngoraEditor.UIComponent.AnimeEditor(this.editor);
    dlg.show();
	},
  showAudioEditor : function () {
    var dlg = new AngoraEditor.UIComponent.AudioEditor(this.editor);
    dlg.show();
	},
  showParticleEditor : function () {
    var dlg = new AngoraEditor.UIComponent.ParticleEditor(this.editor);
    dlg.show();
    return dlg;
	},
  showPhysicsEditor : function () {
    var dlg = new AngoraEditor.UIComponent.PhysicsEditor(this.editor);
    dlg.show();
    return dlg;
	},
  showResourceEditor : function () {
    var dlg = new AngoraEditor.UIComponent.ResourceEditor(this.editor);
    dlg.show();
    return dlg;
	},
  showTilemapEditor : function () {
    var dlg = new AngoraEditor.UIComponent.TilemapEditor(this.editor);
    dlg.show();
    return dlg;
	},
  showHelpDialog : function(){
    var dlg = new AngoraEditor.UIComponent.HelpDialog(this.editor);
    dlg.show();
    return dlg;
  },
  showNewNodeDialog: function(){
    var dlg = new AngoraEditor.UIComponent.NewNodeDialog(this.editor);
    dlg.show();
    return dlg;
  },
  showNewProjectDialog : function () {
    var self = this;
		var dlg = new AngoraEditor.UIComponent.NewProjectDialog(this.editor);
		dlg.onConfirm = function(project){
			self.editor.Manager.project.add(project,function(){
        self.editor.Manager.project.load(project);
      });
		}
		dlg.show();
	},
  showOpenProjectDialog : function(){
    var self = this;
		var dlg = new AngoraEditor.UIComponent.OpenProjectDialog(this.editor);
		dlg.onConfirm = self.editor.Manager.project.load;
		dlg.onCreate = self.showNewProjectDialog;
		dlg.show();
    return dlg;
  },
  showAboutDialog : function(){

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
  openFileDialog : function (basepath, func, accept, multi) {
    //Ti.UI.openFileChooserDialog(func);
    var self=this;
    if(typeof multi==='undefined'){$('#upload').removeProp('multiple');multi=false;}
    else {$('#upload').prop('multiple');multi=true;}
    if(typeof accept==='undefined')$('#upload').removeProp('accept');
    else $('#upload').prop('accept', accept);

    $("#upload").off('change').on('change',function (){
      $('#filedialog').trigger('submit');
    });
    //$('#filedialog').submit(function(){
    //	p.uploadFile('/files',data, func);
    //});
    var projectpath=this.editor.Data.project.path;
    $("#filedialog").off('submit').on('submit',function(event) {
      event.preventDefault();
      var formData = new FormData();
      // Loop through each of the selected files.
      var files = $("#upload")[0].files;
      formData.append('num_files', files.length);
      formData.append('multiple', multi.toString());
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        // Add the file to the request.
        formData.append('image'+i, file, file.name);
      }
      $.ajax({
        type        : "POST",
        url         : "files{0}/data".format(projectpath),
        data        : formData,
        contentType : false,
        processData : false
      }).done(function (data) {
        func(data);
      });
      return true;
    });
    $("#upload").trigger('click');
  },

  readTempFile : function(func){
    var p=this;
    $("#upload").off('change').on('change',function (){
      $('#filedialog').trigger('submit');
    });
    $("#filedialog").off('submit').on('submit',function(event) {
      event.preventDefault();
      var data = new FormData(this);
      $.ajax({
        type        : "POST",
        url         : "temp",
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

AngoraEditor.ManagerController.ViewManager.prototype.constructor = AngoraEditor.ManagerController.ViewManager;
