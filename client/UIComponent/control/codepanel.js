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
AngoraEditor.CodePanel = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */
	this.editors=[];

  this.Dom=$('#codepanel');

  this.currentEditor=null;
}
AngoraEditor.CodePanel.prototype = {
	existsTab:function(title){
		return $('#tabs').tabs('exists',title);
	},
	selectTab:function(title){
		if(this.existsTab(title)){
			$('#tabs').tabs('select',title);
			return true;
		}else{
			return false;
		}
	},
	createTab:function(title,type){
		var editor=this.editor;
		$('#tabs').tabs('add',{
		   id:'tab_'+title,
		   title:title,
		   closable:true,
			 selected:false,
		   content:'<textarea id="{0}_script" type="{1}"></textarea>'.format(title,type),
		   cache:true
		});
	},
	removeTab:function(){
		$('#tabs').tabs('close',title);
	},
  createEditor:function(title, script, type){
		var pane=document.getElementById(title+"_script");
		var codeEditor = CodeMirror.fromTextArea(pane, {
			lineNumbers : true,
			mode : "javascript",
			extraKeys: {"Shift-Space": "autocomplete"},
			gutters : ["CodeMirror-lint-markers"],
			theme: 'zenburn',
			lint : true
		});
		this.editors[title]={'editor':codeEditor,'changes':false,type:type}
		//this.codeChanges[title]=false;
		codeEditor.setValue(script);
		//codeEditor.on("change",function(){editor.ui.codeEditors[title].changes=true;});
  },
	removeEditor:function(title){
		var pane=document.getElementById(title+"_script");
		pane.CodeMirror.toTextArea();
	},
  addCodeEditor:function(title, script, type){
		if(!this.existsTab(title)){
			this.createTab(title,type);
    	this.createEditor(title, script, type);
		}
  },
  removeCodeEditor:function(title){
		this.removeEditor(title);
		this.removeTab(title);
  },
	reloadCodeEditor:function(title,script){
		this.editors[title].editor.setValue(script);
	},
	updateCodeEditor:function(title,script){
		this.editors[title].editor.replaceRange(script, {line: Infinity});
	}
}

AngoraEditor.CodePanel.prototype.constructor = AngoraEditor.CodePanel;
