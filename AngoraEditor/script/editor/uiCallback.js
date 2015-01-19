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

	$('#preview').mousemove(function (e) {
		//console.log(editor.ui.gamePane.dragging);
		if(editor.ui.gamePane.offseting){
			var md = editor.ui.gamePane.mouse;
			//editor.ui.gamePane.offset.x+=(e.pageX - md.x);
			//editor.ui.gamePane.offset.y+=(e.pageY - md.y);
			$('#scene').css('transform', 'translate({0}px,{1}px)'.format(editor.ui.gamePane.offset.x+e.pageX - md.x,editor.ui.gamePane.offset.y+e.pageY - md.y));
			$('#preview').css('background-position', '{0}px {1}px'.format(editor.ui.gamePane.offset.x+e.pageX - md.x,editor.ui.gamePane.offset.y+e.pageY - md.y));
			//background-position:10px 10px;
		}
		else if (editor.ui.gamePane.dragging) {
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
	$('#preview').mousedown(function(e){
		editor.ui.propertyGrid.reset();
		editor.ui.nodeTree.unselect();
		editor.ui.propertyGrid.loadData(editor.scene.config);
		editor.ui.eventPane.loadData(editor.scene.config);
		editor.ui.gamePane.mouse={x:e.pageX,y:e.pageY};
		if(e.which==2)
			editor.ui.gamePane.offseting=true;
	});
	$('#preview').mouseup(function (e) {
		if(e.which==2){
		editor.ui.gamePane.offseting = false;
		var md = editor.ui.gamePane.mouse;
		editor.ui.gamePane.offset.x+=(e.pageX - md.x);
		editor.ui.gamePane.offset.y+=(e.pageY - md.y);
		}else{
		editor.ui.gamePane.dragging = false;
		}
	});
	$('#preview').mouseleave(function (e) {
		editor.ui.gamePane.dragging = false;
		if(editor.ui.gamePane.offseting){
			editor.ui.gamePane.offseting = false;
			console.log(e.pageX,e.pageY);
			var md = editor.ui.gamePane.mouse;
			editor.ui.gamePane.offset.x+=(e.pageX - md.x);
			editor.ui.gamePane.offset.y+=(e.pageY - md.y);
		}
	});
	$('#preview').mousewheel(function (e) {
		var origin={x:e.pageX,y:e.pageY};
		editor.ui.gamePane.scaleScene(e.deltaY,origin);
	});
	$("#addNode").click(function () {
		editor.ui.showDialog('/dialog/nodetype');
	});
	$("#addScene").click(function () {
		var sceneName = prompt('Enter scene name', '');
		if (sceneName != null) {
			editor.scene.add(sceneName);
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
	$("#moveupNode").click(function () {
		//var zindex = editor.node.selected.zindex - 1;
		//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
	});
	$("#movedownNode").click(function () {
		//var zindex = editor.node.selected.zindex - 1;
		//editor.attr.setAttr(editor.node.selected, 'z-index', zindex);
	});
	$("#submenu_tools").menu({onClick:function (item) {
		switch(item.id){
		case 'anime':editor.ui.showAnimationEditor(function(){});break;
		case 'audio':editor.ui.showAudioEditor(function(){});break;
		case 'physics':editor.ui.showPhysicsEditor();break;
		case 'particle':editor.ui.showParticleEditor();break;
		case 'tilemap':editor.ui.showTiledMapEditor();break;
		case 'resource':editor.ui.showResourceEditor();break;
		case 'stamp':
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
			break;
		default:break;
		}
	}});
	$("#submenu_run").menu({onClick:function (item) {
		switch(item.id){
		case 'run':editor.ui.runProject();break;
		case 'release':editor.project.release();break;
		default:break;
		}
	}});
	$("#submenu_help").menu({onClick:function (item) {
		switch(item.id){
		case 'about':editor.ui.showDialog("/dialog/about",420,320,function(){});break;
		case 'help':editor.ui.showDialog("http://docs.phaser.io/");break;
		default:break;
		}
	}});
	$("#submenu_app").menu({onClick:function (item) {
		editor.ui.showDialog("/dialog/app",360,360,function(){});
	}});
	$("#submenu_file").menu({onClick:function (item) {
		switch(item.id){
		case 'newProject':editor.ui.showNewProjectDialog();break;
		case 'openProject':editor.ui.showOpenProjectDialog();break;
		case 'saveProject':editor.project.save();break;
		case 'closeProject':editor.project.close();break;
		default:break;
		}
	}});
	$("#submenu_view").menu({onClick:function (item) {
		switch(item.id){
		case 'setgridsize':
			var size=prompt('Enter grid size','32');
			if(size==''){
				editor.ui.gridSize=32;
			}else{
				editor.ui.gridSize=parseInt(size);
			}
			$('#preview').css('background-size','{0}px {0}px'.format(editor.ui.gridSize));
			break;
		case 'snaptogrid':
			if(editor.ui.snapToGrid==false){
				editor.ui.snapToGrid=true;
			}else{
				editor.ui.snapToGrid=false;
			}
			break;
		case 'showgrid':
			if(editor.ui.showGrid==false){
				$('#preview').addClass('grid');
				editor.ui.showGrid=true;
			}else{
				$('#preview').removeClass('grid');
				editor.ui.showGrid=false;
			}
			break;
		default:break;
		}
	}});
	$('.cm_additem').click(function(e){
		var type = $(this)[0].children[0].innerHTML;
		var node = editor.node.create(type);
		var offset = $('#scene').offset();
		node.x=editor.ui.contextMenu.menuposX-offset.left;
		node.y=editor.ui.contextMenu.menuposY-offset.top;
		editor.node.add(node);
		editor.ui.nodeTree.addNode(node);
		editor.ui.gamePane.add(node);
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
		editor.ui.contextMenu.showContextMenu(e.pageX,e.pageY);
	});
	$(document).bind('contextmenu',function(e){
		if($(document.activeElement).is('textarea'))
			return true;
		e.preventDefault();
		return false;
	});
	this.unactiveMenu();
}
