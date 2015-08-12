
AngoraEditor.UIComponent.NewProjectDialog=function(editor){
  this.editor=editor;
  this.href = '/dialog/newProject';
  this.view = '<div style="padding:10px 60px 20px 60px">  \
  	<form id="ff" method="post"> \
  		<table cellpadding="5"> \
  			<tr> \
  				<td>Name:</td>  \
  				<td><input id="name" class="easyui-textbox" ></input></td>  \
  			</tr>  \
  			<tr>  \
  				<td>Width:</td>  \
  				<td><input id="DisplayX" class="easyui-numberspinner" value="800"></input></td>  \
  			</tr>  \
  			<tr>  \
  				<td>Height:</td>  \
  				<td><input id="DisplayY" class="easyui-numberspinner" value="600"></input></td>  \
  			</tr>  \
  			<tr>  \
  				<td>AntiAlias:</td>  \
  				<td><input id="AntiAlias" type="checkbox" checked="checked"></input></td>  \
  			</tr>  \
  			<tr>  \
  				<td>Render:</td>  \
  				<td><select id="Render" >  \
  					<option>AUTO</option>  \
  					<option>WEBGL</option>  \
  					<option>CANVAS</option>  \
  				</select></td>  \
  			</tr>  \
  			<tr>  \
  				<td>Physics:</td>  \
  				<td>  \
  					<select id="Physics" >  \
  						<option>ARCADE</option>  \
  						<option>P2JS</option>  \
  					</select>  \
  				</td>  \
  			</tr>  \
  		</table>  \
  	</form>  \
  	<div style="text-align:center;padding:5px">  \
  		<a id="confirm" class="easyui-linkbutton" >OK</a>  \
  		<a id="cancel" class="easyui-linkbutton" >Cancel</a>  \
  	</div>  \
  </div>  \
  </div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
}
AngoraEditor.UIComponent.NewProjectDialog.prototype={
  show: function (path, w, h, modal, resize) {
    self=this;
    //$.get(this.href,function(data){
      $('#dd').html(this.view);
      self.onLoad(self);
    //});
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
