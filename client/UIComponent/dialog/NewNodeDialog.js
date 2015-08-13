
AngoraEditor.UIComponent.NewNodeDialog=function(editor){
  this.types = [{
  		"text" : "Node2D",
  		"iconCls" : "icon-ae-node2d",
  		"type" : "node2d",
  		"children" : [{
  				"text" : "Sprite",
  				"iconCls" : "icon-ae-sprite",
  				"type" : "sprite"
  			}, {
  				"text" : "TileSprite",
  				"iconCls" : "icon-ae-prite",
  				"type" : "tilesprite"
  			}, {
  				"text" : "Animation",
  				"iconCls" : "icon-ae-anim",
  				"type" : "animate"
  			}, {
  				"text" : "Image",
  				"iconCls" : "icon-ae-image",
  				"type" : "image"
  			}
  		]
  	}, {
  		"text" : "Geometry",
  		"iconCls" : "icon-ae-geom",
  		"type" : "geometry"
  	}, {
  		"text" : "ParticleEmitter",
  		"iconCls" : "icon-ae-particle",
  		"type" : "particle"
  	}, {
  		"text" : "Group",
  		"iconCls" : "icon-ae-group",
  		"type" : "group",
  		"children" : [{
  				"text" : "Group",
  				"iconCls" : "icon-ae-group",
  				"type" : "group"
  			}, {
  				"text" : "PhysicsGroup",
  				"iconCls" : "icon-ae-group",
  				"type" : "physicsgroup"
  			}, {
  				"text" : "SpriteBatch",
  				"iconCls" : "icon-ae-group",
  				"type" : "spritebatch"
  			}/*, {
  				"text" : "AnimateGroup",
  				"iconCls" : "icon-ae-group",
  				"type" : "animategroup"
  			}*/
  		]
  	}, {
  		"text" : "Tilemap",
  		"iconCls" : "icon-ae-tilemap",
  		"type" : "tilemap"
  	}, {
  		"text" : "Camera",
  		"iconCls" : "icon-ae-camera",
  		"type" : "camera"
  	}, {
  		"text" : "Timer",
  		"iconCls" : "icon-ae-timer",
  		"type" : "timer"
  	}, {
  		"text" : "Audio",
  		"iconCls" : "icon-ae-audio",
  		"type" : "audio"
  	}, {
  		"text" : "Text",
  		"iconCls" : "icon-ae-textnode",
  		"type" : "textnode",
  		"children" : [{
  				"text" : "Text",
  				"iconCls" : "icon-ae-text",
  				"type" : "text"
  			}, {
  				"text" : "BitmapText",
  				"iconCls" : "icon-ae-bitmaptext",
  				"type" : "bitmaptext"
  			}
  		]
  	}, {
  		"text" : "GUI",
  		"iconCls" : "icon-ae-gui",
  		"type" : "gui",
  		"children" : [{
  				"text" : "Button",
  				"iconCls" : "icon-ae-button",
  				"type" : "button"
  			}
  		]
  	}, {
  		"text" : "customNode",
  		"iconCls" : "icon-ae-custom",
  		"type" : "custom"
  	}
  ];
  this.editor=editor;
  this.title = "New Game Object";
  this.view = '<div class="easyui-layout" fit="true">  \
                	<div data-options="region:\'center\'" style="overflow:scoll;">  \
                		<ul id="tt" class="easyui-tree">  \
                		</ul>  \
                	</div>  \
                </div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
}
AngoraEditor.UIComponent.NewNodeDialog.prototype={
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
  onLoad:function(self){
    var editor = this.editor;
    var types = this.types;
  	/*var customclass=editor.project.customclass;
  	if(customclass!=null){
  		types[types.length-1].children=[];
  		for(i in customclass){
  			types[types.length-1].children.push({
  				"text" : customclass[i].clsname,
  				"iconCls" : "icon-ae-custom",
  				"type" : 'custom'
  			});
  		}
  	}*/
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
    self.onShow(self);
  },
  onClose:function(){},
  onConfirm:function(project){}
}

AngoraEditor.UIComponent.NewNodeDialog.constructor=AngoraEditor.UIComponent.NewNodeDialog;
