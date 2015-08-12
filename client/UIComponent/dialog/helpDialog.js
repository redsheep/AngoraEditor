
AngoraEditor.UIComponent.HelpDialog=function(){
  this.editor=editor;
  this.href = '/dialog/Help';
  this.view = '	<div> \
	<input id="ss"></input>  \
    <div id="mm" style="width:120px"> \
    <div data-options="name:\'Sprite\',iconCls:\'icon-ae-sprite\'">Sprite</div> \
    <div data-options="name:\'Animation\',iconCls:\'icon-ae-anim\'">Animation</div> \
	<div data-options="name:\'TileMap\',iconCls:\'icon-ae-tilemap\'">TileMap</div> \
	<div data-options="name:\'Audio\',iconCls:\'icon-ae-audio\'">Audio</div> \
	<div data-options="name:\'Arcade\',iconCls:\'icon-ae-physics\'">Arcade</div> \
	<div data-options="name:\'P2\',iconCls:\'icon-ae-physics\'">P2JS</div> \
    </div>  \
	</div> \
	<div id="content"> \
	</div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
}
AngoraEditor.UIComponent.HelpDialog.prototype={
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
    $('#ss').searchbox({
			searcher:function(value,name){
				$.getJSON('/docs/phaser_docs?cls={0}&args={1}'.format(name,value),function(result){
					$('#content').empty();
					for(i in result){
					var row=result[i];
					parameters=row.parameters.split('@')
					paraarray=[];
					for(i in parameters)
						paraarray.push(parameters[i].split(':')[0]);
					//row.help = row.help.replace(/\n/g, '<br/>');
					$('#content').append("<h3 class='accordion-toggle'>{0}</h3><div class='accordion-content'><h3 class='method'>{0}({1})</h3><p>{2}</p></div>".format(row.name,paraarray.toString(),row.help.replace(/\\n/g, '')));
					}
				});
			},
			menu:'#mm',
			prompt:'Enter Property or Method'
		});
		$('#content').delegate('.accordion-toggle','click',function(){
			console.log('');
		  //Expand or collapse this panel
		  $(this).next().slideToggle('fast');
		  //Hide the other panels
		  $(".accordion-content").not($(this).next()).slideUp('fast');
		});
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.HelpDialog.constructor=AngoraEditor.UIComponent.HelpDialog;
