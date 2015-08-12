
AngoraEditor.UIComponent.ParticleEditor=function(editor){
  this.editor=editor;
  this.href = '/dialog/openProject';
  this.view = '<div id="container" class="easyui-layout" fit="true">  \
  	<div data-options="region:\'south\'" style="overflow:hidden">  \
  		<button id="btn_ok" style="float:left;margin-top:10px;">OK</button>  \
  		<button id="btn_cancel" style="float:right;margin-top:10px;">Cancel</button>  \
  	</div>  \
  	<div id="particles" data-options="region:\'center\'" style="overflow:hidden;width:350px;height:480px;">  \
  	</div>  \
  	<div data-options="region:\'east\'" style="overflow:hidden;width:200px;">  \
  		<div id="particleproperty">property</div>  \
  	</div>  \
  </div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.ParticleEditor.prototype={
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
		if(editor.node.selected==null){
			$('#dd').dialog('close');
			return false;
		}
		var selected=editor.node.selected;
		var emitter;
		var data=[];
		for( key in selected){
			if(key=='x'||key=='y')continue;
			switch(key){
			case 'id':
			case 'type':
			case 'visible':type='none';break;
			default:type='numberbox';break;
			}
			data.push({name:key,value:selected[key],group:'default',editor:type});
		}
		$('#particleproperty').propertygrid({
			data: data,
			onEndEdit : function (index, field, changes) {
				var name = field['name'];
				var value = field['value'];
				emitter[name]=parseInt(value);
				selected[name]=parseInt(value);
			}
		});
		var game = new Phaser.Game(300, 400, Phaser.CANVAS, 'particles', { preload: preload, create: create, render: render});

		function preload() {
			game.load.image('particle', 'data/particle.png');
		}
		function create() {
			game.stage.backgroundColor = '#000000';
			emitter = game.add.emitter(game.world.centerX, game.world.centerY);
			emitter = emitter.makeParticles('particle');
			emitter.start(false);
			for(key in selected){
				if(key=='x'||key=='y')continue;
				emitter[key]=selected[key];
			}
			game.input.onDown.add(updatePoint, this);
		}
		function updatePoint(e){
			if (game.input.mousePointer.isDown){
				emitter.x=game.input.activePointer.worldX;
				emitter.y=game.input.activePointer.worldY;
			}
		}
		function render() {
			game.debug.text(emitter.total, 32, 32);
		}
		$("#btn_ok").click(function(){
			for(key in selected){
				if(key=='x'||key=='y')continue;
				editor.attr.setAttr(editor.node.selected,key,selected[key]);
			}
			$('#dd').dialog('close');
		});
		$("#btn_cancel").click(function(){
			$('#dd').dialog('close');
		});
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(project){ }
}

AngoraEditor.UIComponent.ParticleEditor.constructor=AngoraEditor.UIComponent.ParticleEditor;
