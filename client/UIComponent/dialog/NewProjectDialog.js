
AngoraEditor.UIComponent.NewProjectDialog=function(editor){
  this.editor=editor;
  this.href = '/dialog/newProject';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
}
AngoraEditor.UIComponent.NewProjectDialog.prototype={
  show: function (path, w, h, modal, resize) {
    self=this;
    $.get(this.href,function(data){
      $('#dd').html(data);
      self.onLoad(self);
    });
  },
  onShow:function(self){
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
  onLoad:function(self){
    var editor = self.editor;
    self.onShow(self);
		$('#confirm').click(function(){
			var name=$('#name').val();
			var path=editor.system.workspacePath+'/'+name;
			var DisplayX=$('#DisplayX').val();
			var DisplayY=$('#DisplayY').val();
			var Render=$('#Render').val();
			var AntiAlias=$('#AntiAlias').is(':checked');
			var Physics=$('#Physics').val();
			var project={
				name: name,
				path: path,
				icons: '',
				descript:''
			};
			var config={
				display:{width:DisplayX,height:DisplayY},
				render:Render,
				antialias:true,
				physics:Physics,
				plugins:''
			};
			self.onConfirm(project);
			//editor.project.load(project);
			$('#dd').dialog('close');
		});
		$('#cancel').click(function(){
			$('#dd').dialog('close');
		});
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.NewProjectDialog.constructor=AngoraEditor.UIComponent.NewProjectDialog;
