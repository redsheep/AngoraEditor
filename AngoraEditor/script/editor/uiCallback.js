/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 *
 *
 *
 * @class
 * @classdesc
 * @constructor
 */
AngoraEditor.UI.prototype.setupUICallback = function () {
	var editor = this.editor;

	$('#attributes').propertygrid({
		onEndEdit : function (index, field, changes) {
			var name = field['name'];
			var value = field['value'];
			if(editor.node.selected==null){
				editor.scene.setConfig(name,field['group'],value);
			}else{
				switch (name) {
				case 'id':
					editor.ui.nodeTree.updateNode(editor.node.selected.id, value);
					editor.attr.setAttr(editor.node.selected, 'id', value);
					break;
				default:
					editor.attr.setAttr(editor.node.selected,name,value);
					break;
				}
			}
		},
		onDblClickRow:function(index, field){
			var name = field['name'];
			var value = field['value'];
			switch (name) {
			case 'image':
			case 'assetatlas':
				editor.ui.showResourceEditor(function () {
					var id = editor.res.selected['id'];
					editor.attr.setAttr(editor.node.selected, name, id);
				});
				break;
			case 'animations':
				editor.ui.showAnimationEditor(function(){
					//alert(JSON.stringify(editor.res.anim));
					//editor.node.selected['animations']=editor.res.anim;
					//editor.attr.setAttr(editor.node.selected, 'animations', editor.res.anim);
				});
				break;
			case 'font':
				editor.ui.showResourceEditor(function(){
					var id = editor.res.selected['id'];
					editor.attr.setAttr(editor.node.selected, name, id);
				});
				break;
			case 'audio':
				editor.ui.showResourceEditor(function () {
					var id = editor.res.selected['id'];
					editor.attr.setAttr(editor.node.selected, 'audio', id);
				});
				break;
			case 'tracks':
				editor.ui.showAudioEditor(function () {
					console.log('audio modify complete!');
				});
				break;
			default:
				break;
			}				
		}
	});
	$('#preview').mousemove(function (e) {
		//console.log(editor.ui.gamePane.dragging);
		if (editor.ui.gamePane.dragging) {
			var pos = editor.ui.gamePane.selected.pos;
			var md = editor.ui.gamePane.mouse;
			var left = Math.round((pos.left + (e.pageX - md.x)) / editor.ui.gamePane.scale);
			var top = Math.round((pos.top + (e.pageY - md.y)) / editor.ui.gamePane.scale);
			if(editor.ui.snapToGrid){
				var gridsize=editor.ui.gridSize;
				var left = Math.round(left/gridsize)*gridsize;
				var top = Math.round(top/gridsize)*gridsize;
			}
			editor.attr.setAttr(editor.node.selected, 'x', left);
			editor.attr.setAttr(editor.node.selected, 'y', top);
		}else if(editor.ui.gamePane.stamping){
			var offset=$(this).offset();
			//var pos = editor.ui.gamePane.stampNode.position();
			//var md = editor.ui.gamePane.mouse;
			var w=editor.node.stampNode.width;
			var h=editor.node.stampNode.height;
			var left = Math.round((e.pageX-offset.left-w/2) / editor.ui.gamePane.scale);
			var top = Math.round((e.pageY-offset.top-h/2) / editor.ui.gamePane.scale);
			if(editor.ui.snapToGrid){
				var gridsize=editor.ui.gridSize;
				var left = Math.round(left/gridsize)*gridsize;
				var top = Math.round(top/gridsize)*gridsize;
			}
			editor.attr.setAttr(editor.node.stampNode, 'x', left);
			editor.attr.setAttr(editor.node.stampNode, 'y', top);
		}
	});
	$('#preview').mouseup(function () {
		editor.ui.gamePane.dragging = false;
	});
	$('#preview').mouseleave(function () {
		editor.ui.gamePane.dragging = false;
	});
	$('#preview').mousewheel(function (event) {
		editor.ui.gamePane.scaleScene(event.deltaY);
	});
	/*$('#preview').mousedown(function () {
		console.log('mouse down');
		if(typeof editor.node.stampNode!=='undefined'){
			alert(JSON.stringify(editor.node.stampNode));
			edtior.node.add(editor.node.stampNode);
			alert();
			var node=editor.node.clone(editor.node.stampNode);
			editor.node.stampNode=node;
			//editor.ui.nodeTree.unselect();
			editor.node.selected=null;
			editor.ui.gamePane.addStampNode(node);
			alert();
		}
	});*/
	$('#stamp').click(function(){
		//editor.ui.gamePane.stampNode=editor.node.selected;
		if(editor.ui.gamePane.stamping){
			editor.ui.gamePane.stamping=false;
			editor.node.stampNode=null;
			editor.ui.gamePane.selected.remove();
		}else{
			editor.ui.gamePane.stamping=true;
			var newnode=editor.node.clone(editor.node.selected);
			editor.node.stampNode=newnode;
			editor.ui.nodeTree.unselect();
			editor.node.selected=null;
			editor.ui.gamePane.add(newnode);
			editor.ui.gamePane.select(newnode.id);
		}
	});
	$("#addNode").click(function () {
		editor.ui.showDialog('/dialog/nodetype');
		/*dlg.addEventListener(Ti.CLOSED, function (event) {
			if(dlg.result==true){
				var type = dlg.type;
				var node = editor.node.create(type);
				editor.node.add(node);
				editor.ui.nodeTree.addNode(node);
				editor.ui.gamePane.add(node);
			}
			//editor.game.addResource(res);
			//var node=editor.node.create(res.type);
			//editor.game.addNode(node);
		});*/
	});
	$("#addScene").click(function () {
		var sceneName = prompt('Enter scene name', '');
		if (sceneName != null) {
			editor.scene.add(sceneName);
		}
		/*var dlg=editor.ui.showDialog('app://newScene.html');
		dlg.editor=editor;
		dlg.addEventListener(Ti.CLOSED,function(event){
		dlg.sceneName;
		dlg.sceneConfig;
		});*/
	});
	$('#setgridsize').click(function(){
		var size=prompt('Enter grid size','32');
		if(size==''){
			editor.ui.gridSize=32;
		}else{
			editor.ui.gridSize=parseInt(size);
		}
		$('#preview').css('background-size','{0}px {0}px'.format(editor.ui.gridSize));
	});
	$('#snaptogrid').click(function(){
		if(editor.ui.snapToGrid==false){
			editor.ui.snapToGrid=true;
		}else{
			editor.ui.snapToGrid=false;
		}
	});
	$('#showgrid').click(function(){
		if(editor.ui.showGrid==false){
			$('#preview').css('background',"url('data/cell.png') repeat");
			editor.ui.showGrid=true;
		}else{
			$('#preview').css('background',"");
			editor.ui.showGrid=false;
		}
	});
	$('#addEvent').click(function(){
		
	});
	$('#addProperty').click(function(){
		
	});
	$("#removeScene").click(function () {
		var r = confirm("remove local file?");
		editor.scene.remove(editor.scene.curScene,r);
	});
	$("#removeNode").click(function () {
		editor.node.remove(editor.node.selected);
		editor.ui.nodeTree.removeNode();
		editor.ui.gamePane.remove(editor.node.selected);
		editor.ui.propertyGrid.reset();
	});
	$("#cm_remove").click(function () {
		$("#removeNode").trigger('click');
	});
	$("#moveupNode").click(function () {
		//var zindex = editor.node.selected.zindex - 1;
		//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
	});
	$("#movedownNode").click(function () {
		//var zindex = editor.node.selected.zindex - 1;
		//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
	});
	$('#newProject').click(function () {
		editor.ui.showNewProjectDialog();
	});
	$('#openProject').click(function () {
		editor.ui.showOpenProjectDialog();
	});
	$('#saveProject').click(function () {
		editor.project.save();
	});
	$("#resource").click(function () {
		editor.ui.showResourceEditor();
	});
	$("#tilemap").click(function () {
		editor.ui.showTiledMapEditor();
	});
	$("#particle").click(function () {
		editor.ui.showParticleEditor();
	});
	$("#physics").click(function () {
		editor.ui.showPhysicsEditor();
	});
	$("#run").click(function () {
		editor.ui.runProject();
	});
	$("#help").click(function () {
		editor.ui.showDialog("http://docs.phaser.io/");
	});
	$("#about").click(function () {
		editor.ui.showDialog("/dialog/about",420,320,function(){});
	});
	$("#app").click(function () {
		editor.ui.showDialog("/dialog/app",360,360,function(){});
	});
	$("#audio").click(function () {
		editor.ui.showDialog("/dialog/audioEditor",400,400,function(){});
	});
	$("#anime").click(function () {
		editor.ui.showAnimationEditor(function(){});
	});
	$("#release").click(function () {
		editor.project.release();
	});
	$('#preview').mousedown(function(e){
		editor.ui.propertyGrid.reset();
		editor.ui.nodeTree.unselect();
		editor.ui.propertyGrid.loadData(editor.scene.config);
		editor.ui.eventPane.loadData(editor.scene.config);
	});
	$('body').keydown(function(e){
		if (e.ctrlKey){
			switch(e.which){
			case 78: $('#newProject').trigger('click');return false;
			case 79: $('#openProject').trigger('click');return false;
			case 83: $('#saveProject').trigger('click');return false;
			}
			return true;
		}
		else if(e.altKey){
			switch(e.which){
			case 83: $('#stamp').trigger('click');return false;
			}
			return true;
		}
	});
	$('#preview').bind('contextmenu',function(e){
		e.preventDefault();
		$('#context').menu('show', {
			left: e.pageX,
			top: e.pageY
		});
	});
	$('#nodetreepanel').bind('contextmenu',function(e){
		e.preventDefault();
		$('#context').menu('show', {
			left: e.pageX,
			top: e.pageY
		});
	});
	$(document).bind('contextmenu',function(e){
		e.preventDefault();
		return false;
	});
}
