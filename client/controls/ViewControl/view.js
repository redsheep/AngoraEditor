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
			self.editor.Manager.project.add(project);
			self.editor.Manager.project.load(project);
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

  }
}

AngoraEditor.ManagerController.ViewManager.prototype.constructor = AngoraEditor.ManagerController.ViewManager;
