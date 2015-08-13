// Point class
function Point(x,y){
  this.x = x;
  this.y = y;
  this.rotateRight = function(p1, p2){
    // cross product, + is counterclockwise, - is clockwise
    return ((p2.x*y-p2.y*x) - (p1.x*y-p1.y*x) + (p1.x*p2.y-p1.y*p2.x))<0;
  };
};
// ConvexHull class
function ConvexHull(){
  this.hull = new Array();
  this.points = new Array();
  this.addpoint=function(x,y){
    this.points.push(new Point(x,y));
  };
  this.calculate = function(){
    this.points.sort(function compare(p1,p2) {return p1.x - p2.x;});
    this.hull=new Array();
    upperHull = new Array();
    this.calcUpperhull(upperHull);
    for(var i = 0; i < upperHull.length; i++)
      this.hull.push(upperHull[i]);

    lowerHull = new Array();
    this.calcLowerhull(lowerHull);
    for(var i = 0; i < lowerHull.length; i++)
      this.hull.push(lowerHull[i]);
  };
  this.calcUpperhull = function(upperHull){
    var i = 0;
    upperHull.push(this.points[i]);
    i++;
    upperHull.push(this.points[i]);
    i++;
    // Start upperHull scan
    for(i; i < this.points.length; i++){
      upperHull.push(this.points[i]);
      while(
        upperHull.length>2 && // more than 2 points
        !upperHull[upperHull.length-3].rotateRight(upperHull[upperHull.length-1],upperHull[upperHull.length-2]) // last 3 points make left turn
      )
        upperHull.splice(upperHull.indexOf(upperHull[upperHull.length-2]), 1); // remove middle point
    }
  };
  this.calcLowerhull = function(lowerHull){
    var i = this.points.length-1;
    lowerHull.push(this.points[i]);
    i--;
    lowerHull.push(this.points[i]);
    i--;
    // Start lowerHull scan
    for(i; i >= 0; i--){
      lowerHull.push(this.points[i]);
      while(
        lowerHull.length>2 && // more than 2 points
        !lowerHull[lowerHull.length-3].rotateRight(lowerHull[lowerHull.length-1],lowerHull[lowerHull.length-2]) // last 3 points make left turn
      )
        lowerHull.splice(lowerHull.indexOf(lowerHull[lowerHull.length-2]), 1); // remove middle point
    }
  };
};
AngoraEditor.UIComponent.PhysicsEditor=function(editor){
  this.editor=editor;
  this.title = 'PhysicsEditor';
  this.view = '	<div id="page" class="easyui-layout" fit="true"> \
  	<div data-options="region:\'north\'" style="height:64px;"> \
  		<div style="overflow:hidden"> \
  			<select id="decompmethod" class="easyui-combobox" style="width:200px;"> \
  				<option value="concave">concave</option> \
  				<option value="convex">simple convex</option> \
  			</select> \
  			<a id="removePolygon" class="easyui-linkbutton" data-options="iconCls:\'icon-ae-remove\'" style="border:none"></a> \
  		</div> \
  	</div> \
  	<div id="physicsbody" data-options="region:\'center\'" > \
  		<img id="sprite"></img> \
  		<canvas id="convex"></canvas> \
  	</div> \
  	<div data-options="region:\'east\'" style="width:150px;"> \
  		<div id="polygonproperty">property</div> \
  	</div> \
  	<div data-options="region:\'south\'" style="height:64px;"> \
  		<button id="btn_ok" style="float:left;margin-top:10px;">OK</button> \
  		<button id="btn_cancel" style="float:right;margin-top:10px;">Cancel</button> \
  	</div> \
  	</div>';
  this.width = 480;
  this.height = 480;
  this.modal = true;
  this.resize = false;
  //this.onConfirm = null;
  //this.onCreate = null;
}
AngoraEditor.UIComponent.PhysicsEditor.prototype={
  show: function () {
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
    var self = this;
    var editor=this.editor;
    var selected = editor.Manager.gameNode.getSelected();
		var res=editor.Manager.resource.get(selected.property.image);
		var path=editor.Manager.project.getPath()+"/"+res.path;
		var body=selected.property.bodyShape;
		var scalex=res.width/256;
		var scaley=res.height/256;
    $("#page").layout();

		var convas=document.getElementById("convex");
		var ctx=convas.getContext("2d");
		ctx.canvas.height=256;
		ctx.canvas.width=256;
		var convex = new ConvexHull();
		//var concave = new decomp.Polygon();
		var points=[];
		var colors = ["#f99","#9f9","#99f","#ff9"];
		var selectedmethod="concave";

		function loadImage(path, width, height, target) {
			$('#sprite').attr('src',path);
			$('#sprite').load(function() {
				ctx.rect(0,0,256,256);
				ctx.stroke();
			});
		}
		function render(){
			ctx.clearRect ( 0 , 0 , ctx.canvas.width, ctx.canvas.height );
			for( i in points){
				ctx.beginPath();
				ctx.strokeStyle = 'red';
				ctx.fillStyle = 'red';
				ctx.arc(points[i][0], points[i][1], 4, 0, 2 * Math.PI, false);
				ctx.stroke();
			}
			if(selectedmethod=="concave"){
				concave.vertices = points.slice();
				concave.makeCCW();
				var polys = concave.quickDecomp();
				for(var i=0; i<polys.length; i++){
					ctx.strokeStyle = colors[i%(colors.length)];
					ctx.lineWidth = 3;
					var poly = polys[i];
					ctx.beginPath();
					var p = poly.vertices[0];
					ctx.moveTo(p[0],p[1]);
					for(var j=0; j<poly.vertices.length; j++){
						var p = poly.vertices[j];
						ctx.lineTo(p[0],p[1]);
					}
					ctx.closePath();
					ctx.stroke();
				}
			}else{
				//convex.points=points.slice();
				convex.calculate();
				ctx.beginPath();
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 3;
				for(var i = 1; i < convex.hull.length; i++){
					p1 = convex.hull[i-1];
					p2 = convex.hull[i];
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(p2.x, p2.y);
				}
				ctx.closePath();
				ctx.stroke();
			}
		}
		loadImage(path, 64, 64, '#sprite');
		$('#convex').click(function(e){
			var offset = $(this).offset();
			addPoint(e.clientX-offset.left, e.clientY-offset.top);
			render();
		});
		function addPoint(x,y){
			points.push([x,y]);
			convex.addpoint(x,y);
		}
		if(typeof body=="object"){
			for(p in body){
				addPoint(body[p][0]/scalex,body[p][1]/scaley);
			}
			render();
		}
		$('#decompmethod').combobox({
			onSelect: function(rec){
				selectedmethod=rec.value;
				render();
			}
		});
		$('#removePolygon').click(function(){
			convex = new ConvexHull();
			concave = new decomp.Polygon();
			points=[];
			render();
		});
		$("#btn_ok").click(function(){
			if(selectedmethod=="concave"){
				for(i in points){
					points[i][0]*=scalex;points[i][1]*=scaley;
				}
				editor.attr.setAttr(editor.node.selected,'body',points);
			}else{
				var polygon=[];
				var prepoint=[null,null];
				for(p in convex.hull){
					var point = [parseInt(convex.hull[p].x*scalex),parseInt(convex.hull[p].y*scaley)];
					if(point[0]!=prepoint[0]&&point[1]!=prepoint[1])
						polygon.push(point);
					prepoint=point;
				}
				editor.attr.setAttr(editor.node.selected,'body',polygon);
			}
			$('#dd').dialog('close');
		});
		$("#btn_cancel").click(function(){
			$('#dd').dialog('close');
		});
    self.onShow(self);
  },
  onClose:function(self){ },
  onCreate:function(){ },
  onConfirm:function(project){ }
}

AngoraEditor.UIComponent.PhysicsEditor.constructor=AngoraEditor.UIComponent.PhysicsEditor;
