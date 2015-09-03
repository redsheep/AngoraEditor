/**
* @author RedSheep <redsheep@foxmail.com>
* @copyright
* @license
*/
/**
* AngoraEditor.EventPaneManager constructor
*
* Instantiate <code>AngoraEditor.EventPaneManager</code> object.
* @class AngoraEditor.EventPaneManager
* @classdesc
* @constructor
*/
AngoraEditor.ResourcePanel = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
	/**
	* @property {Array} - events of selected node
	*/
	this.editors=[];

	this.Dom=$('#resourceTab');
}
AngoraEditor.ResourcePanel.prototype = {
	setup:function(){

	},
	addObjectToPane : function (resID,projectpath,respath,which){
		if($('#'+resID).length!=0)return;
		if(projectpath!=null)	respath = projectpath+"/"+respath;
		this.Dom.prepend("<div class='resrect'><img id='{0}' src='{1}'/> \
		<span class='key'>{0}</span><span class='{2}'></span></div>".format(resID,respath,which));
	},
	addResource : function(res){
		var projectpath	= this.editor.Data.project.path;
		var resources		= this.editor.Manager.resource.getAll();
		var type				=	resources.Global[res.id].type;
		if(type=='image'||type=='spritesheet'||type=='atlas'){
			this.addObjectToPane(res.id,projectpath,res.path,'global');
		}
	}
}

AngoraEditor.ResourcePanel.prototype.constructor = AngoraEditor.ResourcePanel;
