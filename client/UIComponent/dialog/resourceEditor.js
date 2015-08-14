AngoraEditor.UIComponent.ResourceEditor=function(editor){
  this.editor=editor;
  this.href = '/dialog/openProject';
  this.view = '<div id="page" class="easyui-layout" fit="true"> \
  	<div data-options="region:\'center\'"> \
  		<div id="resourcepane" class="easyui-accordion" fit="true"> \
  			<div id="res_image" title="Image"> \
  				<div id="addimgbtn" class="resrect addbtn"></div> \
  			</div> \
  			<div id="res_audio" title="Audio"> \
  				<div id="addsndbtn" class="resrect addbtn"></div> \
  			</div> \
  			<div id="res_other" title="Other"> \
  				<div id="addotherbtn" class="resrect addbtn"></div> \
  			</div> \
  		</div>  \
  	</div> \
  	<div data-options="region:\'south\'" style="overflow:hidden">  \
  		<button id="okbtn">OK</button>  \
  		<button id="cancelbtn">Cancel</button>  \
  	</div> \
  	<div id="otherdd"></div> \
  	<div id="cm_res" class="easyui-menu">  \
  		<div id="cm_remove_res">Remove</div>  \
  		<div> \
  			<span>SetAs</span> \
  			<div>  \
  			<div id="cm_set_local">LocalResource</div> \
  			<div id="cm_set_global">GlobalResource</div> \
  			</div> \
  		</div>  \
  		<div> \
  			<span>Convert To</span>  \
  			<div>  \
  			<div id="cm_to_sheet">SpriteSheet</div>  \
  			<div id="cm_to_image">Image</div>  \
  			</div> \
  		</div>  \
  	</div> \
  	<div id="dd_sheet" class="easyui-dialog" title="Convert to Sheet" style="width:360px;height:380px;" data-options="closed:true,modal:true">\
  		<div style="text-align:center;">  \
  		<p><img id="convert_img" style="max-height:200px;max-width:340px;"></p> \
  		<p>Xframe:<input id="Xframe" class="easyui-numberbox"/></p> \
  		<p>Yframe:<input id="Yframe" class="easyui-numberbox"/></p> \
  		</div>    \
  		<div style="text-align:center;padding:5px">   \
  		<a id="sheet_convert" class="easyui-linkbutton">Convert</a>   \
  		</div>    \
      </div>    \
  </div>';
  this.width = 640;
  this.height = 480;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.ResourceEditor.prototype={
  show: function () {
    self=this;
    //$.get(this.href,function(data){
      $('#dd').html(this.view);
      self.onLoad(self);
    //});
  },
  onShow:function(){
    var self = this;
    $('#dd').dialog({
      title: self.href.split('/').pop(),
      left:(window.innerWidth-self.width)/2,
      top:(window.innerHeight-self.height)/2,
      width: self.width,
      height: self.height,
      resizable: self.resize,
      closed: false,
      cache: false,
      //href: path,
      modal: self.modal
      //onLoad: self.onLoad(self),
      //onClose: self.onClose(self)
    });
  },
  addObjectToPane : function (resID,pane,projectpath,respath,which){
    if($('#'+resID).length!=0)return;
    if(projectpath!=null)
      respath = projectpath+"/"+respath;
    $('#res_'+pane).prepend("<div class='resrect'><img id='{0}' src='{1}'/> \
      <span class='key'>{0}</span><span class='{2}'></span></div>".format(resID,respath,which));
  },
  onLoad:function(self){
    var editor=this.editor;
  	var projectpath = editor.Data.project.path;
  	var resources=editor.Manager.resource.getAll();
    $('#dd_sheet').dialog();
    $('#cm_res').menu();
    $('#page').layout();
    $('#resourcepane').accordion();
  	for( resID in resources.Global){
  		var type=resources.Global[resID].type;
  		if(type=='image'||type=='spritesheet'||type=='atlas'){
  			this.addObjectToPane(resID,'image',projectpath,resources.Global[resID].path,'global');
  		}else if(type=='audio'){
  			this.addObjectToPane(resID,'audio',null,'/data/audio.png','global');
  		}else{
  			this.addObjectToPane(resID,'other',null,"/data/{0}.png".format(type),'global');
  		}
  	}
  	$('#resourcepane').delegate('.resrect',"mousedown",function(){
  		var selected=$(".selectedrect");
  		if(selected.length>0)
  			selected.removeClass("selectedrect");
  		$(this).addClass("selectedrect");
  	});
  	$('#addimgbtn').click(function(){
  		editor.file.openFileDialog('',function(files){
  			var uploads=JSON.parse(files);
  			for( i in uploads ){
  				var filename = uploads[i];
  				var resID = filename.substr(0, filename.lastIndexOf('.')) || filename;
  				var respath = "{0}/data/{1}".format(projectpath,filename);
  				addObjectToPane(resID,'image',respath,'global');
  				$('#'+resID).load(function(){
  					var filepath = $(this).attr('src');
  					var filename = filepath.substr(filepath.lastIndexOf('/')+1,filepath.length);
  					var res={path:filename,height:this.naturalHeight,width:this.naturalWidth};
  					var resID = filename.substr(0, filename.lastIndexOf('.')) || filename;
  					editor.res.add(resID,'image',res);
  				});
  			}
  		},'image/*', true);
  	});
  	$('#addsndbtn').click(function(){
  		editor.file.openFileDialog('',function(files){
  			var uploads=JSON.parse(files);
  			for( i in uploads ){
  				var filename = uploads[i];
  				var resID = filename.substr(0, filename.lastIndexOf('.')) || filename;
  				addObjectToPane(resID,'audio',"/data/audio.png".format(type),'global');
  				editor.res.add(resID,'audio',{path:filename});
  			}
  		},'audio/*', true);
  	});
  	$("#cm_res").menu({onClick:function (item) {
  		var resID=$(".selectedrect img").attr('id');
  		switch(item.id){
  		case 'cm_remove_res':
  			editor.res.remove(resID);
  			$(".selectedrect").remove();break;
  		case 'cm_set_global':
  			editor.res.setAsGlobalRes(resID);
  			if($(".selectedrect").children().eq(2).hasClass('local')){
  				$(".selectedrect").children().eq(2).removeClass('local')
  				$(".selectedrect").children().eq(2).addClass('global')
  			}
  			break;
  		case 'cm_set_local':
  			editor.res.setAsLocalRes(resID);
  			if($(".selectedrect").children().eq(2).hasClass('global')){
  				$(".selectedrect").children().eq(2).removeClass('global')
  				$(".selectedrect").children().eq(2).addClass('local')
  			}
  			break;
  		case 'cm_to_sheet':
  			$('#convert_img').prop('src',"{0}/{1}".format(projectpath,editor.res.get(resID).path));
  			$('#dd_sheet').dialog('open');
  			break;
  		case 'cm_to_image':
  			var res=editor.res.get(resID);
  			res.type='image';
  			res.Xframe=undefined;
  			res.Yframe=undefined;
  			break;
  		default:break;
  		}
  	}});
  	$(".resrect").bind('contextmenu',function(e){
  		e.preventDefault();
  		$('#cm_res').menu('show', {
  			left: e.pageX,
  			top: e.pageY
  		});
  	});
  	$('#sheet_convert').click(function(){
  		var resID=$(".selectedrect img").attr('id');
  		var res=editor.res.get(resID);
  		res.type='spritesheet';
  		res.Xframe=$('#Xframe').val();
  		res.Yframe=$('#Yframe').val();
  		$('#dd_sheet').dialog('close');
  	});
  	$('#addotherbtn').click(function(){
  		var dlg=$('#otherdd').dialog({
  			title: 'My Dialog',
  			width: 360,
  			height: 400,
  			closed: false,
  			cache: false,
  			href: "/dialog/otherResource",
  			modal: true,
  			onClose: function(){
  				var newres=editor.res.selected;
  				var resID=newres.id;
  				switch(newres.type){
  				case 'spritesheet':
  				case 'atlas':
  					addObjectToPane(resID,'image',null,'global');
  					break;
  				default:
  					addObjectToPane(resID,'other',"/data/{0}.png".format(newres.type),'global');
  					break;
  				}

  			}
  		});
  	});
  	$('#okbtn').click(function(){
  		resID = $(".selectedrect img").attr('id');
      self.onConfirm(resID);
  		$('#dd').dialog('close');
  	});
  	$('#canclebtn').click(function(){
  		$('#dd').dialog('close');
  	});
    this.onShow();
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(resID){ }
}

AngoraEditor.UIComponent.ResourceEditor.constructor=AngoraEditor.UIComponent.ResourceEditor;
