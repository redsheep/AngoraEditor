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
	this.Container=$('#resPanel');
	this.Property=$('#resProperty');

	this.setupCallback();
}
AngoraEditor.ResourcePanel.prototype = {
	setupCallback:function(){
		var self=this;
		//this.Dom.append('<div id="resPanel" data-options="region:\'center\'"></div> \
		//								<div id="resProperty" data-options="region:\'east\'" style="width:100px;"></div>');
		//this.Dom.layout();
		//this.Property.propertygrid();
		this.Container.append('<div id="addimgbtn" class="resrect addbtn"></div>');
		$('#addimgbtn').click(function(){
			if(self.editor.Manager.project.getPath()==null) return;
  		self.editor.Manager.view.openFileDialog('',function(files){
				var projectpath = self.editor.Data.project.path;
  			var uploads=JSON.parse(files);
  			for( i in uploads ){
  				var filename = uploads[i];
  				var resID = filename.substr(0, filename.lastIndexOf('.')) || filename;
  				var respath = "{0}/data/{1}".format(projectpath,filename);
  				self.addObjectToPane(resID,null,respath,'global');
  				$('#'+resID).load(function(){
  					var filepath = $(this).attr('src');
  					var filename = filepath.substr(filepath.lastIndexOf('/')+1,filepath.length);
  					var resID = filename.substr(0, filename.lastIndexOf('.')) || filename;
  					var res={id:resID,type:'image',path:'data/'+filename,height:this.naturalHeight,width:this.naturalWidth};
  					self.editor.Manager.resource.add(res,true);
  				});
  			}
  		},'image/*', true);
  	});
		this.Container.delegate('.resrect',"click",function(e){
			e.stopImmediatePropagation();
  		var selected=$(".selectedrect");
  		if(selected.length>0)
  			selected.removeClass("selectedrect");
  		$(this).addClass("selectedrect");
			self.editor.Manager.resource.setSelected($(".selectedrect img").attr('id'));
			self.loadProperty();
  	});
		this.Container.click(function(){
			var selected=$(".selectedrect");
			if(selected.length>0)
				selected.removeClass("selectedrect");
			self.editor.Manager.resource.unSelect();
			self.resetProperty();
		});
	},
	addObjectToPane : function (resID,projectpath,respath,which){
		if($('#'+resID).length!=0)return;
		if(projectpath!=null)	respath = projectpath+"/"+respath;
		this.Container.prepend("<div class='resrect'><img id='{0}' src='{1}'/> \
		<span class='key'>{0}</span><span class='{2}'></span></div>".format(resID,respath,which));
	},
	addResource : function(res){
		var projectpath	= this.editor.Data.project.path;
		//var resources		= this.editor.Manager.resource.getAll();
		var type				=	res.type;//resources.Global[res.id].type;
		if(type=='image'||type=='spritesheet'||type=='atlas'){
			this.addObjectToPane(res.id,projectpath,res.path,'global');
		}
	},
	loadProperty:function(){
		var res = this.editor.Manager.resource.getSelected();
		if(res == null) return;
		var property = [];
		for(var key in res.property){
			property.push({name:key,value:res.property[key]});
		}
		this.Property.propertygrid('loadData',property);
		this.Dom.layout('expand','east');
	},
	resetProperty:function(){
		this.Property.propertygrid('loadData',[]);
		this.Dom.layout('collapse','east');
	}
}

AngoraEditor.ResourcePanel.prototype.constructor = AngoraEditor.ResourcePanel;
