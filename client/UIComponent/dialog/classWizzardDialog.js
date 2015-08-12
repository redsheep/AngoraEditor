
AngoraEditor.UIComponent.ClassWizzard=function(){
  this.editor=editor;
  this.href = '/dialog/newProject';
  this.view = '<div class="easyui-layout" fit="true"> \
  	<div data-options="region:\'north\'">  \
  		<div style="overflow:hidden"> \
  			<a id="addClass" class="easyui-linkbutton" data-options="iconCls:\'icon-ae-add\'" style="border:none"></a> \
  			<a id="removeClass" class="easyui-linkbutton" data-options="iconCls:\'icon-ae-remove\'" style="border:none"></a> \
  		</div>  \
  	</div> \
  	<div data-options="region:\'center\'" style="width:150px;overflow:hidden;">  \
  		<table id="tb_class" fit=true></table>  \
  	</div> \
  	<div data-options="region:\'south\'" style="height:48px;"> \
  		<button id="btn_ok" style="float:left;margin-top:4px;">EditCode</button>  \
  		<button id="btn_cancel" style="float:right;margin-top:4px;">Cancel</button> \
  	</div> \
</div>  \
  <div id="dd_class" class="easyui-dialog" data-options="closed:true" title="CreateClass" style="padding:10px 60px 20px 60px">  \
  	<table cellpadding="5">  \
  		<tr><td>ClassName:</td> \
  		<td><input id="clsname" type="text" value=''></input></td>  \
  		</tr> \
  		<tr><td>BaseClass:</td> \
  			<td><select id=\'basecls\'>  \
  				<option>Sprite</option> \
  				<option>Particle</option> \
  			</select></td> \
  		</tr> \
  	</table> \
  	<div style="text-align:center;padding:5px">  \
  		<a id="confirm" class="easyui-linkbutton" >OK</a> \
  		<a id="cancel" class="easyui-linkbutton" >Cancel</a>  \
  	</div>
  </div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
}
AngoraEditor.UIComponent.ClassWizzard.prototype={
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
    var editor=edt;
		$('#addClass').click(function(){
			$('#dd_class').dialog('open');
		});
		$('#removeClass').click(function(){
			var selectedcls=$('#tb_class').datagrid('getSelected');
			if(selectedcls!=null){
				editor.project.removeCustomClass(selectedcls);
			}
		});
		$('#confirm').click(function(){
			var clsname=$('#clsname').val();
			var basecls=$('#basecls').val();
			if(clsname.trim()!=''){
				var newcls={clsname:clsname,basecls:basecls,clsfile:clsname+'.js'};
				editor.project.addCustomClass(newcls);
				$('#tb_class').datagrid('appendRow',newcls);
			}
			$('#dd_class').dialog('close');
		});
		$('#cancel').click(function(){
			$('#dd_class').dialog('close');
		});
		$('#tb_class').datagrid({
			fitColumns:true,
			singleSelect:true,
			columns:[[
				{field:'clsname',title:'ClassName',width:96},
				{field:'basecls',title:'BaseClass',width:96},
				{field:'clsfile',title:'ClasssFile',width:96}
			]]
		});
		var classes=editor.project.customclass;
		for(c in classes){
			$('#tb_class').datagrid('appendRow',classes[c]);
		}
		$('#btn_ok').click(function(){
			var selectedcls=$('#tb_class').datagrid('getSelected');
			if(selectedcls!=null){
				//open with codemirror
				editor.file.readFile('{0}/{1}'.format(editor.project.currentProject.path,selectedcls.clsfile),function(script){
					editor.ui.setupScript(selectedcls.clsname,script,'customClass');
				});
			}
			$('#dd').dialog('close');
		});
		$('#btn_cancel').click(function(){
			$('#dd').dialog('close');
		});
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.ClassWizzard.constructor=AngoraEditor.UIComponent.ClassWizzard;
