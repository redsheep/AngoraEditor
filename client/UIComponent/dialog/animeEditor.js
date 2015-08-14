
AngoraEditor.UIComponent.AnimeEditor=function(editor){
  this.editor = editor;
  this.view = '	<div id="page" class="easyui-layout" fit="true">  \
	<div data-options="region:\'north\'" style="height:64px;"> \
		<div style="overflow:hidden"> \
			<select id="animations" class="easyui-combobox" name="anim" style="width:128px"></select> \
			<a id="addAnim" data-options="iconCls:\'icon-ae-add\'" style="border:none"></a> \
			<a id="removeAnim" data-options="iconCls:\'icon-ae-remove\'" style="border:none"></a> \
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
  this.title="AnimateEditor";
  this.width = 480;
  this.height = 320;
  this.modal = true;
  this.resize = false;
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
      title: self.title,
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
    var self = this;
    var editor=this.editor;
    var selected = editor.Manager.gameNode.getSelected();
		var spritesheet=editor.Manager.resource.get(selected.property.image);
		var path=editor.Manager.project.getPath()+"/"+spritesheet.path;
		$('#atlas').attr('src',path);
		var rows=parseInt(spritesheet.Yframe);
		var cols=parseInt(spritesheet.Xframe);
		var w=spritesheet.width/spritesheet.Xframe;
		var h=spritesheet.height/spritesheet.Yframe;
		var animations=selected.animations;
		var comboxValues=[];
		var currentAnim=null;
		var index=0;
		var previewFrame=0;
		var anim_Interval=null;
    $('#page').layout();
    $('#addAnim').linkbutton();
    $('#removeAnim').linkbutton();
		if(animations!=""){
			for(key in animations){
				comboxValues.push({'text':key,'value':key});
			}
		}
		$('#preview_img').css('height',h);
		$('#preview_img').css('width',w);
		$('#preview_img').css('background-image','url('+path+')');
		$('#animations').combobox({
			valueField: 'value',
			textField: 'text',
			data : comboxValues,
			onSelect: function(record){
				currentAnim=record.value;
				var anim=animations[record.value];
				$('#animeproperty').propertygrid('loadData',[
					{"name":"frameRate","value":anim.frameRate,"editor":"numberbox"},
					{"name":"loop","value":anim.loop,"editor":{"type":"checkbox","options":{"on":true,"off":false}}},
					{"name":"sequence","value":anim.sequence.toString(),"editor":"text"}
				]);
			}
		});
		$('#animrect').css({width:w,height:h});
		$('#animeproperty').propertygrid({
			data : '',
			onEndEdit : function (index, field, changes) {
				var name = field['name'];
				var value = field['value'];
				switch (name) {
				case 'sequence':
					try{
						animations[currentAnim].sequence=JSON.parse("["+value+"]");
					}catch(e){
						field['value']=animations[currentAnim].sequence.toString();
					}
				default:
					animations[currentAnim][name]=value;
					break;
				}
			}
		});
		$('#atlas').mousemove(function(e){
			var dposleft=$('#dd').dialog('dialog')[0].offsetLeft;
			var dpostop=$('#dd').dialog('dialog')[0].offsetTop;
			var cpos=$('#atlas').position();
			var stpos=$('#container').parent().scrollTop();
			var slpos=$('#container').parent().scrollLeft();
			var left=Math.max(0,Math.floor((e.pageX-dposleft-w/2+slpos)/w)*w);
			var top=Math.max(0,Math.floor((e.pageY-dpostop-64-h/2+stpos)/h)*h);
			$('#animrect').css({left:left,top:top});
			index=top/h*cols+left/w;
		});
		$('#addAnim').click(function(){
			editor.ui.prompt('Add Animate','Enter animation name',function(name){
				if (typeof name=='undefined' && name.trim() == '')return;
				currentAnim=name;
				if(animations=="")animations={};
				animations[currentAnim]={frameRate:60,loop:true,sequence:[]};
				comboxValues.push({'text':name,'value':name});
				$('#animations').combobox('loadData', comboxValues);
				$('#animations').combobox('select', name);
			});
		});
		$('#animrect').click(function(){
			if(currentAnim!=null){
				animations[currentAnim].sequence.push(index);
				$('#animeproperty').propertygrid('updateRow',{
					index: 2,
					row: {
						value:animations[currentAnim].sequence.toString()
					}
				});
			}
		});
		function changeFrame(){
			//if(curframe<animations[currentAnim].sequence.length){
				var f=animations[currentAnim].sequence[previewFrame];
				$("#preview_img").css('background-position', '-{0}px -{1}px'.format(f%cols*w,parseInt(f/cols)*h));
				previewFrame=(previewFrame+1)%animations[currentAnim].sequence.length;
				console.log('loop');
			//	setTimeout(changeFrame(curframe+1), 1000/parseInt(animations[currentAnim].frameRate));
			//}
		}
		$('#anim_preview').click(function(){
			$('#dd_preview').dialog({
				title: 'My Dialog',
				width: 200,
				height: 200,
				closed: false,
				cache: false,
				modal: true,
				onOpen:function(){
					if(typeof animations[currentAnim]!='undefined'){
						previewFrame=0;
						anim_Interval=setInterval(changeFrame, 1000/parseInt(animations[currentAnim].frameRate));
					}
				},
				onBeforeClose:function(){
					if(anim_Interval!=null){
						clearInterval(anim_Interval);
						anim_Interval=null;
					}
				}
			});

		});
		//$('#dd').dialog({onBeforeClose:stopAnim});
		$("#btn_ok").click(function(){
			//editor.res.anim=animations;
			editor.attr.setAttr(editor.node.selected,'animations',animations);
			$('#dd').dialog('close');
		});
		$("#btn_cancel").click(function(){
			$('#dd').dialog('close');
		});
    self.onShow(self);
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.AnimeEditor.constructor=AngoraEditor.UIComponent.AnimeEditor;