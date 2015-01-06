/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.GamePaneManager constructor
 *
 * Instantiate <code>AngoraEditor.GamePaneManager</code> object.
 * @class AngoraEditor.GamePaneManager
 * @classdesc
 * @constructor
 */
AngoraEditor.GamePaneManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Jquery Object}
	 */
	this.pane=null;
	/**
	 * @property {boolean} is dragging object
	 */
	this.dragging=false;
	/**
	 * @property {Object} selected node
	 */
	this.selected=null;
	/**
	 * @property {Object} stamp node
	 */
	this.stampNode=null;
	/**
	 * @property {boolean}
	 */
	this.stamping=false;
	/**
	 * @property {number} scale ratio
	 */
	this.scale=1.0;
	
	this.setup();
}
AngoraEditor.GamePaneManager.prototype = {
	/**
	* setup
	* @method setup
	* @param 
	*/	
	setup: function(){
		var editor=this.editor;
		this.pane=$('#scene');
/* 		this.pane.mousedown(function(e){
			editor.ui.propertyGrid.reset();
			editor.ui.nodeTree.unselect();
			editor.ui.propertyGrid.loadData(editor.scene.config);
		}); */
		//this.pane.append("<div id='stamp' class='stamp'><div>");
	},
	/**
	* setup the game pane
	* @method loadData
	* @param scene
	*/	
	loadData: function(scene){
		var editor=this.editor;
		for( key in scene){
			var node=scene[key];
			this.add(node);
		}
	},
	/**
	* setup the game pane from game configuration
	* @method setupConfig
	* @param 
	*/
	setupConfig : function(){
		this.pane.css('width',this.editor.game.display.width);
		this.pane.css('height',this.editor.game.display.height);
		console.log('setup game config success!');
	},
	/**
	* add a node to the game pane DOM
	* @method add
	* @param {Object} node
	*/
	add: function(node){
		var editor=this.editor;
		var parent=this.pane;
		//if(editor.node.selected==null)
		//	parent=this.pane;
		//else
		//	parent=$('#'+editor.node.selected.id);
		parent.append("<div id='{0}' class='{1}'><div>".format(node.id,node.type));
		var nodeDiv=$('#'+node.id);
		switch(node.type){
			case 'image':
			case 'button':
			case 'tilesprite':
			case 'animate':
			case 'sprite'://<img draggable='false'/>
				//parent.append("<div id='{0}' class='{1}'><div>".format(node.id,node.type));
				//nodeDiv=$('#'+node.id);
				var projectpath=editor.project.currentProject.path.replace(/\\/g, '/');
				var res=editor.res.get(node.image);
				if(typeof res!='undefined'){
					nodeDiv.css('background-image',"url('{0}/{1}')".format(projectpath,res.path));
					if(res.type=='spritesheet'){
						var x=Math.max(0,node.frame%res.Xframe);
						var y=Math.floor(node.frame/res.Xframe);
						var sizex=res.width/res.Xframe;
						var sizey=res.height/res.Yframe;
						nodeDiv.css('background-position','-{0}px -{1}px'.format(sizex*x,sizey*y));
					}
				}
				//nodeDiv.css('background-size',"100% 100%");
				nodeDiv.css('background-size',"{0} {1}".format(parseInt(node.width)/node.scaleX,parseInt(node.height)/node.scaleY));
				nodeDiv.css('background-repeat','no-repeat'); 
				nodeDiv.css('width',parseInt(node.width)/node.scaleX+'px');
				nodeDiv.css('height',parseInt(node.height)/node.scaleY+'px');
				nodeDiv.css('transform', 'scale({0},{1})'.format(node.scaleX,node.scaleY));
				//nodeDiv.draggable();
				//nodeDiv.resizable();
				break;
			case 'group':
				//nodeDiv.css('width','100px');
				//nodeDiv.css('height','100px');
				break;
			case 'particle':
				nodeDiv.css('width','32px');
				nodeDiv.css('height','32px');
				break;
			case 'text':
				nodeDiv.text(node.text);
				nodeDiv.css('font-family',node.fontFamily);
				nodeDiv.css('font-size',node.fontSize+'px');
				nodeDiv.css('color',node.fontColor);
				nodeDiv.css('text-align', node.textAlign);
				break;
			case 'bitmaptext':
				nodeDiv.text(node.text);
				nodeDiv.css('font-size',node.fontSize+'px');
				break;
			case 'sound': break;
			default:break;
		}
		if(node.visible=='true') nodeDiv.show();
		else nodeDiv.hide();
		nodeDiv.css('border','1px solid orange');
		nodeDiv.css({top: parseInt(node.y), left: parseInt(node.x), position:'absolute'});
		nodeDiv.css('transform-origin', '0 0');
		//nodeDiv.css('transform', 'scale(1) rotate(0deg)');
		nodeDiv.mousedown(function(e){
			e.stopPropagation();
			if(editor.ui.gamePane.stamping){
				editor.node.add(editor.node.stampNode);
				editor.ui.nodeTree.addNode(editor.node.stampNode);
				var newnode=editor.node.clone(editor.node.stampNode);
				editor.node.stampNode=newnode;
				editor.ui.nodeTree.unselect();
				editor.node.selected=null;
				editor.ui.gamePane.add(newnode);
				editor.ui.gamePane.select(newnode.id);
				//alert();
			}else{
				editor.ui.gamePane.mouse={x:e.pageX,y:e.pageY};
				editor.ui.gamePane.select($(this).attr('id'));
				editor.ui.nodeTree.select($(this).attr('id'));
				editor.ui.gamePane.selected.pos=$(this).position();
				editor.ui.gamePane.dragging=true;
			}
		});
		return nodeDiv;
	},
	/**
	* update the z-index of the node
	* @method updateZOrder
	* @param {Object} node
	* @param {number} zindex
	*/
	updateZOrder:function(node,zindex){
		var nodeDiv=$('#'+node.id);
		if(nodeDiv.length>0)
			nodeDiv.css('z-index',zindex);
	},
	/**
	* update the node css style
	* @method update
	* @param {string} attr
	* @param {string} value
	*/
	update: function(attr,value){
		var editor=this.editor;
		var nodeDiv=this.selected;
		var node=editor.node.selected;
		switch(attr){
			case 'id':
				nodeDiv.attr('id',value);
				break;
			case 'image':
				var res=editor.res.get(value);
				var projectpath=editor.project.currentProject.path.replace(/\\/g, '/');
				nodeDiv.css('background-image',"url('{0}/{1}')".format(projectpath,res.path));
				nodeDiv.css('background-repeat','no-repeat'); 
				if(res.type=='spritesheet'){
					editor.attr.setAttr(node,'nwidth',res.width/parseInt(res.Xframe));
					editor.attr.setAttr(node,'nheight',res.height/parseInt(res.Yframe));	
				}else{
					editor.attr.setAttr(node,'nwidth',res.width);
					editor.attr.setAttr(node,'nheight',res.height);
				}
				break;
			case 'visible':
				//alert(value=='true');
				//var res=editor.res.get(value);
				if(value=='true') nodeDiv.show();//.css('visibility','visible');
				else	nodeDiv.hide();
				break;
			case 'frame':
				var res=editor.res.get(node.image);
				if(res.type=='spritesheet'){
					var x=Math.max(0,value%res.Xframe);
					var y=Math.floor(value/res.Xframe);
					var sizex=res.width/res.Xframe;
					var sizey=res.height/res.Yframe;
					nodeDiv.css('background-position','-{0}px -{1}px'.format(sizex*x,sizey*y));
				}				
				break;
			case 'x':nodeDiv.css('left',parseInt(value));break;
			case 'y':nodeDiv.css('top',parseInt(value));break;
			case 'width':nodeDiv.css('width',value);break;
			case 'height':nodeDiv.css('height',value);break;
			case 'text':nodeDiv.text(value);break;
			case 'fontSize':nodeDiv.css('font-size',value+'px');break;
			case 'scaleX':nodeDiv.css('transform', 'scale({0},{1})'.format(value,node.scaleY));break;
			case 'scaleY':nodeDiv.css('transform', 'scale({0},{1})'.format(node.scaleX,value));break;
			default: break;
		}
	},
	/**
	* remove node from game pane DOM
	* @method remove
	* @param {Object} node
	*/	
	remove: function(node){
		$('#'+node.id).remove();
	},
	/**
	* select a node of game pane DOM
	* @method select
	* @param {string} id
	*/	
	select: function(id){
		$('.selected').removeClass('selected');
		this.selected=$('#'+id);
		this.selected.addClass('selected');
	},
	/**
	* scale the game pane DOM
	* @method scaleScene
	* @param {number} scale
	*/
	scaleScene: function(value){
		this.scale+=value*0.1;
		if(this.scale<0.3)
			this.scale=0.3;
		$('#preview').css('transform', 'scale({0})'.format(this.scale));
		$('#preview').css('width',1024/this.scale);
		$('#preview').css('height',768/this.scale);
	},
	/**
	* clear the game pane DOM
	* @method reset
	* @param 
	*/
	reset: function(){
		this.pane.empty();
	}
}

AngoraEditor.GamePaneManager.prototype.constructor = AngoraEditor.GamePaneManager;