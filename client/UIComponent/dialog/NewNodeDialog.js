
AngoraEditor.UIComponent.NewNodeDialog=function(){
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
}
AngoraEditor.UIComponent.NewNodeDialog.prototype={
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
  onClose:function(){

  }
}

AngoraEditor.UIComponent.NewNodeDialog.constructor=AngoraEditor.UIComponent.NewNodeDialog;
