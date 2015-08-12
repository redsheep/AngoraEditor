
AngoraEditor.UIComponent.otherResources=function(editor){
  this.editor=editor;
  this.href = '/dialog/openProject';
  this.view = '	<div style="padding:10px 30px 20px 30px"> \
  	<div id="form" style="text-align:center;"> \
  		<p>ID:<input id="resID" class=".easyui-textbox"/><p>  \
  		<select id="cc" class="easyui-combobox" name="dept" style="width:200px;"> \
  			<option>spritesheet</option> \
  			<option>atlas</option> \
  			<option>bitmapfont</option>  \
  			<option>tilemap</option> \
  			<option>text</option>  \
  		</select> \
  		<div id="options">  \
  		<p>asset:<input id="asset" class="file" readonly/><p> \
  		<p>Xframe:<input id="Xframe" class="easyui-numberbox"/></p> \
  		<p>Yframe:<input id="Yframe" class="easyui-numberbox"/></p> \
  		</div>  \
  		<img id="assetpreview" alt="preview"/>  \
  	</div> \
  	<div style="text-align:center;padding:5px">  \
  	<a id="confirm" class="easyui-linkbutton" >OK</a>  \
  	<a id="cancel" class="easyui-linkbutton" >Cancel</a> \
  	</div> \
  	</div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.otherResources.prototype={
  showPane :function (type){
		$('#options').empty();
		var options=null;
		switch(type){
		case 'spritesheet':
			options="<p>asset:<input id='asset' class='file' readonly/><p>"+
					"<p>Xframe:<input id='Xframe' class='easyui-numberbox'/></p>"+
					"<p>Yframe:<input id='Yframe' class='easyui-numberbox'/></p>";
			break;
		case 'atlas':
			options="<p>asset:<input id='asset' class='file' readonly/></p>"+
					"<p>atlasData:<input id='data' class='file' readonly/></p>";
			break;
		case 'bitmapfont':
			options="<p>bitmap:<input id='bitmap' class='file' readonly/></p>"+
					"<p>fontData:<input id='data' class='file' readonly/></p>";
			break;
		case 'tilemap':
			options="<p>tileData:<input id='data' class='file' readonly/></p>";
			break;
		case 'text':
			options="<p>file:<input id='data' class='file' readonly/></p>";
			break;
		default:
			options="";
			break;
		}
		$('#options').append(options);
	}
  show: function () {
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
    var editor=edt;
		var height;
		var width;
		var type='spritesheet';
		var tileset={};
		$('#cc').combobox({
			onSelect:function(record){
				showPane(record.value);
				$('#assetpreview').attr('src','');
				type=record.value;
				if(record.value!='tilemap')
					tileset={};
			}
		});
		$("#options").delegate('.file','dblclick',function(){
			var selected=$(this);
			editor.file.openFileDialog('',function(filename){
				selected.val(filename);
				if($('#resID').val()==''){
					$('#resID').val(filename.substr(0, filename.lastIndexOf('.')) || filename);
				}
				if(type=='spritesheet'){
					var projectpath = editor.project.currentProject.path;
					var respath = "{0}/data/{1}".format(projectpath,filename);
					$('#assetpreview').attr("src",respath);
					$('#assetpreview').one('load',function(){
						height=this.naturalHeight;
						width=this.naturalWidth;
					});
				}else if(type=='tilemap'){
					if(selected.attr('id')=='data'){
						var projectpath = editor.project.currentProject.path;
						var respath = "{0}/data/{1}".format(projectpath,filename);
						editor.file.readFile(respath,function(data){
							map=JSON.parse(data);
							for(i in map.tilesets){
								var img=map.tilesets[i].image;
								var imgid=img.substr(0, img.lastIndexOf('.')) || img;
								$('#options').append("<p>{0}:<input id='{0}' class='file' readonly/></p>".format(imgid));
							}
						});
					}else{
						var resid=filename.substr(0, filename.lastIndexOf('.')) || filename;
						tileset[resid]='data/'+filename;
					}
				}
			});
		});
		$('#confirm').click(function(){
			var resID=$('#resID').val();
			switch(type){
			case 'spritesheet':
				res={
					path:$('#asset').val(),
					Xframe:$('#Xframe').val(),
					Yframe:$('#Yframe').val(),
					height:height,
					width:width
				}
				break;
			case 'atlas':
				res={
					path:$('#asset').val(),
					data:$('#data').val()
				}
				break;
			case 'bitmapfont':
				res={
					bitmap:$('#bitmap').val(),
					data:$('#data').val()
				}
				break;
			case 'tilemap':
				res={
					tileset:tileset,
					data:$('#data').val()
				}
				break;
			case 'text':
				res={
					path:$('#data').val()
				};
				break;
			default:
				res=null;
				break;
			}
			res.id=resID;
			res.type=type;
			editor.res.add(resID,type,res);
			editor.res.selected=res;
			$('#otherdd').dialog('close');
		});
		$('#cancel').click(function(){
			$('#otherdd').dialog('close');
		});
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(project){ }
}

AngoraEditor.UIComponent.otherResources.constructor=AngoraEditor.UIComponent.otherResources;
