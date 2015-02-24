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
	console.log('start setup callback');
	/*this.showRegion=parseBoolean(this.editor.system.config.display.worldBounds);
	this.showGrid=parseBoolean(this.editor.system.config.display.showGrid);
	this.gridSize=parseInt(this.editor.system.config.display.gridSize);
	if(this.showRegion)$('#worldbounds').css('visibility','visible');
	if(!this.showGrid)$('#preview').removeClass('grid');
	$('#preview').css('background-size','{0}px {0}px'.format(this.gridSize));*/
	$('#preview').mousemove(function (e) {
		//console.log(editor.ui.gamePane.dragging);
		if(editor.ui.gamePane.offseting){
			var md = editor.ui.gamePane.mouse;
			//editor.ui.gamePane.offset.x+=(e.pageX - md.x);
			//editor.ui.gamePane.offset.y+=(e.pageY - md.y);
			$('#scene').css('transform', 'translate({0}px,{1}px)'.format(editor.ui.gamePane.offset.x+e.pageX - md.x,editor.ui.gamePane.offset.y+e.pageY - md.y));
			$('#worldbounds').css('transform', 'translate({0}px,{1}px)'.format(editor.ui.gamePane.offset.x+e.pageX - md.x,editor.ui.gamePane.offset.y+e.pageY - md.y));
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
			editor.attr.setAttr(editor.node.selected, 'dx', left);
			editor.attr.setAttr(editor.node.selected, 'dy', top);
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
			editor.attr.setAttr(editor.node.stampNode, 'dx', left);
			editor.attr.setAttr(editor.node.stampNode, 'dy', top);
		}
	});
	$('#preview').mousedown(function(e){
		if(editor.project.currentProject==null)return;
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
		if(editor.project.currentProject==null)return;
		editor.ui.showDialog('/dialog/nodetype');
	});
	$("#addScene").click(function () {
		if(editor.project.currentProject==null)return;
		editor.ui.prompt('Add Scene','Enter scene name',function(r){
			if (typeof r!='undefined' && r.trim() != '') editor.scene.add(r);
		});
	});
	$('#addEvent').click(function(){
		if(editor.node.selected==null)return;
	});
	$('#addProperty').click(function(){
		if(editor.node.selected==null)return;
		editor.ui.prompt("add property","Enter new property name",function(name){
			if (typeof name!='undefined' && name.trim() != '')
				editor.attr.addAttr(editor.node.selected, name,'',true);
		});
	});
	$("#removeScene").click(function () {
		if(editor.project.currentProject==null)return;
		editor.ui.confirm('Warning',"remove local file?",function(r){
			editor.scene.remove(editor.scene.curScene,r);
		});
	});
	$("#removeNode").click(function () {
		if(editor.project.currentProject==null || editor.node.selected==null)return;
		editor.node.remove(editor.node.selected.id);
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
		case 'tilemap':
			if(editor.node.selected.tilemap!="")
				editor.ui.showTiledMapEditor();
			break;
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
		case 'preferences':editor.ui.showDialog("/dialog/preferences",420,320,function(){});break;
		case 'help':editor.ui.showDialog("/dialog/help",240,320,function(){},false,true);break;
		default:break;
		}
	}});
	$("#submenu_app").menu({onClick:function (item) {
		switch(item.id){
		case 'app':
		editor.ui.showDialog("/dialog/app",360,360,function(){});
		break;
		case 'custom':
		editor.ui.showDialog("/dialog/classwizard",360,360,function(){});
		break;
		}
	}});
	$("#submenu_file").menu({onClick:function (item) {
		switch(item.id){
		case 'newProject':
			if(editor.project.currentProject!=null)
				$('#closeProject').trigger('click');
			editor.ui.showNewProjectDialog();
			break;
		case 'openProject':
			if(editor.project.currentProject!=null)
				$('#closeProject').trigger('click');
			editor.ui.showOpenProjectDialog();
			break;
		case 'saveProject':editor.scene.save();break;
		case 'closeProject':	
			if(editor.scene.isChanged()){
				var r = confirm("do you want to save changed?");
				if(r)editor.scene.save();
			}
			editor.ui.confirm('Warning',"Are you sure to close current project?",function(r){
				if(r){
					editor.project.close();
				}
			});
			break;
		default:break;
		}
	}});
	$("#submenu_view").menu({onClick:function (item) {
		switch(item.id){
		case 'setgridsize':
			editor.ui.prompt('Change Size','Enter grid size',function(size){
				if (typeof size!='undefined' && size.trim() != ''){
					editor.ui.gridSize=32;
				}else{
					editor.ui.gridSize=parseInt(size);
				}
				$('#preview').css('background-size','{0}px {0}px'.format(editor.ui.gridSize));
			});
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
		case 'showregion':
			if(editor.ui.showRegion==false){
				$('#worldbounds').css('visibility','visible');
				editor.ui.showRegion=true;
			}else{
				$('#worldbounds').css('visibility','hidden');
				editor.ui.showRegion=false;
			}
			break;
		default:break;
		}
	}});
	$('#tabs').tabs({
	  /*onSelect:function(title,index){
		editor.ui.codeEditor=editor.ui.codeEditors[title];
	  },*/
	  onBeforeClose: function(title,index){
		//if(title=='preview'||title==editor.scene.curScene)return true;
		if(editor.ui.codeEditors[title].changes){
			var r = confirm("Do you want to save changes");
			if (r == true) {
				var myInstance = $('#'+title).data('CodeMirrorInstance');
				editor.file.writeFile('{0}/{1}.js'.format(editor.project.currentProject.path,title),editor.ui.codeEditors[title].editor.getValue());
				editor.ui.codeEditors[title].changes=false;
				return true;
			}
		}
	  }
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
	console.log('finished setup callback');
}
