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
	
	this.offset={x:0,y:0};
	this.offseting=false;
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
		this.pane.css('width',this.editor.scene.config.world.width);
		this.pane.css('height',this.editor.scene.config.world.height);
		console.log('setup game config success!');
	},
	/**
	* add a node to the game pane DOM
	* @method add
	* @param {Object} node
	*/
	add: function(node,parent){
		var editor=this.editor;
		if(typeof parent==='undefined')
			parent=this.pane;
		//if(editor.node.selected==null)
		//	parent=this.pane;
		//else
		//	parent=$('#'+editor.node.selected.id);
		parent.append("<div id='{0}' class='{1}'><div>".format(node.id,node.type));
		var nodeDiv=$('#'+node.id);
		var type=node.type;
		if(node.type==='custom')type=node.basecls.toLowerCase();
		switch(type){
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
					}else if(res.type=='atlas'){
						editor.file.readFile(projectpath+'/'+res.data,function(data){
							var data=JSON.parse(data);
							nodeDiv.css('background-position','-{0}px -{1}px'.format(-data['frames'][0]['frame']['x'],-data['frames'][0]['frame']['y']));
						});
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
			case 'physicsGroup':
			case 'group':
				nodeDiv.html('group');
				nodeDiv.css('background-color','lightblue');
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
			case 'tilemap':
				nodeDiv.css('width',node.tileW*node.tilesetW);
				nodeDiv.css('height',node.tileH*node.tilesetH);
				nodeDiv.css('background-repeat','no-repeat'); 
				editor.node.locked[node.id]=true;
				break;
			case 'sound': break;
			default:break;
		}
		if(node.visible=='true') nodeDiv.show();
		else nodeDiv.hide();
		nodeDiv.css('border','1px solid orange');
		if(typeof node.anchorX!='undefined'&&typeof node.anchorY!='undefined'){
			nodeDiv.css({left: parseInt(node.x)-parseInt(node.width)*parseFloat(node.anchorX), top: parseInt(node.y)-parseInt(node.height)*parseFloat(node.anchorY), position:'absolute'});
			nodeDiv.css('transform-origin', '{0}% {1}%'.format(parseFloat(node.anchorX)*100,parseFloat(node.anchorY)*100));
		}
		else{
			nodeDiv.css({left: parseInt(node.x), top: parseInt(node.y), position:'absolute'});
			nodeDiv.css('transform-origin', '0 0');
		}
		//nodeDiv.css({left: parseInt(node.x), top: parseInt(node.y), position:'absolute'});		//nodeDiv.css('transform','translate({0}px,{1}px)'.format(parseInt(node.x),parseInt(node.y)));
		
		//nodeDiv.css('transform', 'scale(1) rotate(0deg)');
		nodeDiv.mousedown(function(e){
			if(e.which==2)
				return true;
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
				editor.ui.activeMenuItem(newnode.type);
			}else{
				var selectedid=$(this).attr('id');
				editor.ui.gamePane.mouse={x:e.pageX,y:e.pageY};
				editor.ui.gamePane.select(selectedid);
				editor.ui.nodeTree.select(selectedid);
				editor.ui.gamePane.selected.pos=$(this).position();
				if(e.which==1&& editor.node.locked[selectedid]!=true){
				editor.ui.gamePane.dragging=true;
				}
			}
		});
		if(typeof node.children!='undefined'){
			for(i in node.children){
				this.add(node.children[i],nodeDiv);
			}
		}
	},
	/**
	* update the z-index of the node
	* @method updateZOrder
	* @param {Object} node
	* @param {number} zindex
	*/
	updateZorder:function(node,zindex){
		for(i in node){
			zindex++;
			var nodeDiv=$('#'+node[i].id);
			nodeDiv.css('z-index',zindex);
			if(typeof node[i].children!='undefined')
				zindex=this.updateZorder(node[i].children,zindex);
		}
		return zindex;
	},
	updateGroup:function(id,target){
		var nodeDiv=$('#'+id);
		nodeDiv.detach();//.parent().remove(nodeDiv);
		var newparent=this.pane;
		if(typeof target!='undefined')
			newparent=$('#'+target);
		newparent.append(nodeDiv);
	},
	/**
	* update the node css style
	* @method update
	* @param {string} attr
	* @param {string} value
	*/
	update: function(node,attr,value){
		var editor=this.editor;
		var nodeDiv=$('#'+node.id);
		//var node=editor.node.selected;
		switch(attr){
			case 'id':
				nodeDiv.attr('id',value);
				break;
			case 'image':
				var res=editor.res.get(value);
				var projectpath=editor.project.currentProject.path;//.replace(/\\/g, '/');
				nodeDiv.css('background-image',"url('{0}/{1}')".format(projectpath,res.path));
				nodeDiv.css('background-repeat','no-repeat'); 
				if(res.type=='spritesheet'){
					editor.attr.setAttr(node,'nwidth',res.width/parseInt(res.Xframe));
					editor.attr.setAttr(node,'nheight',res.height/parseInt(res.Yframe));	
				}else if(res.type=='atlas'){
					editor.file.readFile(projectpath+'/'+res.data,function(data){
						var data=JSON.parse(data);
						editor.attr.setAttr(node,'nwidth',data['frames'][0]['frame']['w']);
						editor.attr.setAttr(node,'nheight',data['frames'][0]['frame']['h']);
					});
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
			case 'x': if(typeof node.anchorX!='undefined')nodeDiv.css('left',parseInt(value)-parseInt(node.width)*parseFloat(node.anchorX));else nodeDiv.css('left',parseInt(value));break;//nodeDiv.css('transform','translate({0}px,{1}px)'.format(parseInt(node.x),parseInt(node.y)));break;
			case 'y':if(typeof node.anchorY!='undefined')nodeDiv.css('top',parseInt(value)-parseInt(node.height)*parseFloat(node.anchorY));else nodeDiv.css('top',parseInt(value));break;//nodeDiv.css('transform','translate({0}px,{1}px)'.format(parseInt(node.x),parseInt(node.y)));break;
			case 'width':nodeDiv.css('width',value);break;
			case 'height':nodeDiv.css('height',value);break;
			case 'text':nodeDiv.text(value);break;
			case 'fontSize':nodeDiv.css('font-size',value+'px');break;
			case 'scaleX':nodeDiv.css('transform', 'scale({0},{1})'.format(value,node.scaleY));break;
			case 'scaleY':nodeDiv.css('transform', 'scale({0},{1})'.format(node.scaleX,value));break;
			case 'anchorX':nodeDiv.css('transform-origin', '{0}% {1}%'.format(parseFloat(node.anchorX)*100,parseFloat(value)*100));break;
			case 'anchorY':nodeDiv.css('transform-origin', '{0}% {1}%'.format(parseFloat(value)*100,parseFloat(node.anchorY)*100));break;
			case 'rotation':nodeDiv.css('transform', 'rotate({0}deg)'.format(node.rotation,value));break;
			case 'tilemap':
				var res=editor.res.get(node.tilemap);
				editor.file.readFile(editor.project.currentProject.path+'/'+res.data,function(data){
					var map=JSON.parse(data);
					editor.attr.setAttr(node,'tilesetH',map.tileheight);
					editor.attr.setAttr(node,'tilesetW',map.tilewidth);
					editor.attr.setAttr(node,'tileH',map.height);
					editor.attr.setAttr(node,'tileW',map.width);
					nodeDiv.css('height',map.tileheight*map.height);
					nodeDiv.css('width',map.tilewidth*map.width);
				});
				break;
			case 'mapcache':nodeDiv.css('background-image',"url('{0}')".format(value));break;
			default: break;
		}
	},
	updateWorld: function(attr,value){
		value=parseInt(value);
		switch(attr){
		case 'x':$('#worldbounds').css('left',value);break;
		case 'y':$('#worldbounds').css('top',value);break;
		case 'width':$('#worldbounds').css('width',value);break;
		case 'height':$('#worldbounds').css('height',value);break;
		default:break;
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
		$('.nodeselected').removeClass('nodeselected');
		this.selected=$('#'+id);
		this.selected.addClass('nodeselected');
	},
	unselect:function(){
		$('.nodeselected').removeClass('nodeselected');
	},
	/**
	* scale the game pane DOM
	* @method scaleScene
	* @param {number} scale
	*/
	scaleScene: function(value,origin){
		this.scale+=value*0.1;
		if(this.scale<0.3)
			this.scale=0.3;
		//$('#preview').css('transform-origin', '{0}px {1}px'.format(origin.x,origin.y));
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
		//this.offset={x:0,y:0};
	}
}

AngoraEditor.GamePaneManager.prototype.constructor = AngoraEditor.GamePaneManager;