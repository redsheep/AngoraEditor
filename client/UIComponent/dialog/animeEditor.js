
AngoraEditor.UIComponent.AnimeEditor=function(){
  this.view = '	<div class="easyui-layout" fit="true">  \
	<div data-options="region:\'north\'" style="height:64px;"> \
		<div style="overflow:hidden"> \
			<select id="animations" class="easyui-combobox" name="anim" style="width:128px"></select> \
			<a id="addAnim" class="easyui-linkbutton" data-options="iconCls:\'icon-ae-add\'" style="border:none"></a> \
			<a id="removeAnim" class="easyui-linkbutton" data-options="iconCls:\'icon-ae-remove\'" style="border:none"></a> \
		</div> \
	</div> \
	<div data-options="region:\'center\'" > \
		<div id="container" style="position:relative;"> \
			<img id="atlas" style="position:absolute;left:0;top:0;"></img> \
			<div id="animrect" style="position:absolute;left:0;top:0;border:1px solid red;height:16px;width:16px;"></div> \
		</div> \
	</div> \
	<div data-options="region:\'east\'" style="width:150px;"> \
		<div id="animeproperty">property</div> \
		<button id="anim_preview" style="position:absolute;bottom:0px;">preview</button> \
	</div> \
	<div data-options="region:\'south\'" style="height:64px;"> \
		<button id="btn_ok" style="float:left;margin-top:10px;">OK</button> \
		<button id="btn_cancel" style="float:right;margin-top:10px;">Cancel</button> \
	</div> \
	<div id="dd_preview"><div id="preview_img" style="margin: 0 auto;"></div></div> \
	</div>';
}
AngoraEditor.UIComponent.AnimeEditor.prototype={
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
  onLoad:function(){
    var editor = edt;
  	var customclass=editor.project.customclass;
  	if(customclass!=null){
  		types[types.length-1].children=[];
  		for(i in customclass){
  			types[types.length-1].children.push({
  				"text" : customclass[i].clsname,
  				"iconCls" : "icon-ae-custom",
  				"type" : 'custom'
  			});
  		}
  	}
  	$('#tt').tree({
  		data : types,
  		onDblClick : function (nodetype) {
  			if($('#tt').tree('isLeaf', nodetype.target)==false) return false;
  			var cls=(nodetype.type==='custom'&&customclass!==null)?customclass[nodetype.text]:undefined;
  			var node = editor.node.create(nodetype.type,cls);
  			editor.node.add(node);
  			editor.ui.nodeTree.addNode(node);
  			editor.ui.gamePane.add(node);
  			$('#dd').dialog('close');
  		}
  	});
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.AnimeEditor.constructor=AngoraEditor.UIComponent.AnimeEditor;
