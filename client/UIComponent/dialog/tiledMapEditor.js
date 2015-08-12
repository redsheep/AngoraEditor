AngoraEditor.UIComponent.TilemapEditor=function(editor){
  this.editor=editor;
  this.href = '/dialog/openProject';
  this.view = '<div class="easyui-layout" fit="true"> \
      <div data-options="region:\'south\'" style="overflow:hidden"> \
      <button id="btn_ok" style="float:left;margin-top:10px;">OK</button> \
    <button id="btn_cancel" style="float:right;margin-top:10px;">Cancel</button>  \
      </div>  \
      <div id="map" data-options="region:\'center\'"> \
      <div id="tilemapdiv"></div> \
      </div>  \
      <div id="leftContainer" data-options="region:\'east\',split:true" title="Scene" style="width:300px;"> \
          <div class="easyui-layout" fit="true">  \
              <div data-options="region:\'north\'" style="overflow:hidden"> \
        <a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:\'icon-add\'"></a> \
      </div>  \
              <div id="layer" data-options="region:\'center\'"></div> \
              <div id="tiles" data-options="region:\'south\'">  \
        <div id="tilesets"></div> \
        <div id="marker"></div> \
              </div>  \
          </div>  \
      </div>  \
  </div>';
  this.width = 400;
  this.height = 300;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.TilemapEditor.prototype={
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
		var mymarker=document.getElementById("marker");
		var tiles=document.getElementById("tiles");
		var tilesets=document.getElementById('tilesets');
		var pos = [0, 0];
		var tileid = { x: 0, y: 0 };
		//var tileRect = null;
		var mapPath=editor.project.currentProject.path+"/"+editor.res.get(editor.node.selected.tilemap).data;//"/data/features_test.json";
		var mapObject;
		var mapLayers;
		var mapTileSets;
		var mapLayerIndex={};

		var map;
		var layers={};
		var marker;
		var currentTile = 2;
		var currentLayer;
		var currentLayerName;
		var cursors;
		var selectedTab;
		var tilerows=0;
		var tilecols=0;
		var tilestart=0;
		var currenttileimg=null;

		var mouseDown = false;

		$("#tiles").on({
			mousemove: function (e) {
				pos[0] = e.clientX;//+tiles.scrollLeft;
				pos[1] = e.clientY;//+tiles.scrollTop;
			}
		});
		$('#tiles').delegate('img','mouseenter',function(){
			for(i in mapTileSets){
				if(mapTileSets[i].name==$(this).attr('id')){
					mymarker.style.height=mapTileSets[i].tileheight+'px';
					mymarker.style.width=mapTileSets[i].tilewidth+'px';
					tilerows=mapTileSets[i].imageheight/mapTileSets[i].tileheight;
					tilecols=mapTileSets[i].imagewidth/mapTileSets[i].tilewidth;
					tilestart=mapTileSets[i].firstgid;
					currenttileimg=$(this);
				}
			}
		});
		$("#marker").on({
			click: function (e) {
				currentTile = tileid.y * tilecols + tileid.x + tilestart;
			}
		});
		$('#map').mouseout(function(){
			if(typeof marker!='undefined')
				marker.visible=false;
		});
		$('#map').mouseover(function(){
			if(typeof marker!='undefined')
				marker.visible=true;
		});
		editor.file.readFile(mapPath, function(json) {
			mapObject=JSON.parse(json);
			mapLayers=mapObject['layers'];
			mapTileSets=mapObject['tilesets'];
			for( i in mapLayers){
				if(mapLayers[i].type=='tilelayer'){
				$('#layer').append("<div class='layer'>"+mapLayers[i].name+"</div>");
				mapLayerIndex[mapLayers[i].name]=i;
				}
			}
			/*for( i in mapTileSets){
				$('#tilesets').append('<img id="'+mapTileSets[i].name+'" src="data/'+mapTileSets[i].image+'"/>');
			}*/
			$('.layer').on('click',function(){
				var selected=$(".layer.selected");
				if(selected.length>0)
					selected.removeClass("selected");
				$(this).addClass("selected");
				var layername=this.innerHTML;
				changeLayer(layername);
			});
			function changeLayer(layername){
				for( i in layers){
					if(i==layername)
						layers[i].alpha=1.0;
					else
						layers[i].alpha=0.2;
				}
				currentLayerName=layername;
				currentLayer = layers[layername];
				map.setLayer(currentLayer);
				currentLayer.resizeWorld();
			}
			var game = new Phaser.Game(mapObject.tilewidth*mapObject.width, mapObject.tileheight*mapObject.height, Phaser.CANVAS, 'tilemapdiv', { preload: preload, create: create, update: update });

			function preload() {
				for(i in mapTileSets){
					var key=mapTileSets[i].name;
					var imgsrc=editor.project.currentProject.path+"/"+editor.res.get(editor.node.selected.tilemap).tileset[key];
					game.load.image(mapTileSets[i].name, imgsrc);
					$('#tilesets').append('<img id="'+mapTileSets[i].name+'" src="'+imgsrc+'"/>');
				}
				game.load.tilemap('map', mapPath+'?_='+new Date().getTime(), null, Phaser.Tilemap.TILED_JSON);
			}

			function create() {
				map = game.add.tilemap('map');

				for(i in mapTileSets){
					map.addTilesetImage(mapTileSets[i].name);
				}
				for(i in mapLayers){
					if(mapLayers[i].type=='tilelayer'){
						var layername=mapLayers[i].name;
						layers[layername] = map.createLayer(layername);
					}
				}
				changeLayer(mapLayers[0].name);

				//  Our painting marker
				marker = game.add.graphics();
				marker.lineStyle(2, 0x000000, 1);
				marker.drawRect(0, 0, 32, 32);
				game.input.setMoveCallback(updateMarker, this);

				cursors = game.input.keyboard.createCursorKeys();

			}

			function updateMarker() {
				marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
				marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;
				if (game.input.mousePointer.isDown){
					var offsetx=currentLayer.getTileX(marker.x);
					var offsety=currentLayer.getTileY(marker.y);
					if(game.input.mouse.button==Phaser.Mouse.LEFT_BUTTON){
					map.putTile(currentTile, offsetx, offsety, currentLayer);
					mapObject.layers[mapLayerIndex[currentLayerName]].data[offsety*mapObject.width+offsetx]=currentTile;}
					else if(game.input.mouse.button==Phaser.Mouse.RIGHT_BUTTON){
					map.putTile(null, offsetx, offsety, currentLayer);
					mapObject.layers[mapLayerIndex[currentLayerName]].data[offsety*mapObject.width+offsetx]=0;
					}
				}
			}
			function update() {
				//console.log(pos[0],pos[1],tileRect.width,tileRect.height);
				var tileRect=$("#tilesets").offset();
				var h=mymarker.clientHeight;
				var w=mymarker.clientWidth;
				var mtop=tileRect.top;
				if(currenttileimg!=null)
					mtop=currenttileimg.offset().top;
				tileid.x = game.math.snapToFloor(pos[0] - tileRect.left, w) / w;
				tileid.y = game.math.snapToFloor(pos[1] - mtop, h) / h;
				//console.log(tileid);
				mymarker.style.left = game.math.snapToFloor(pos[0] - tileRect.left, w)+  'px';
				mymarker.style.top = game.math.snapToFloor(pos[1] - tilesets.clientHeight - tileRect.top, h) - 1 + 'px';
			}
		});
		$("#btn_ok").click(function(){
			var canvas = document.getElementById('tilemapdiv').children[0];
			editor.ui.gamePane.update(editor.node.selected,'mapcache',canvas.toDataURL());
			editor.file.writeFile(mapPath,JSON.stringify(mapObject));
			$('#dd').dialog('close');
		});
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(project){ }
}

AngoraEditor.UIComponent.TilemapEditor.constructor=AngoraEditor.UIComponent.TilemapEditor;
