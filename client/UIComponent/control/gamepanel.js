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
AngoraEditor.GamePanel = function (editor) {
	/**
	* @property {AngoraEditor} - reference of editor
	*/
	this.editor = editor;
	/**
	* @property {Jquery Object}
	*/
	this.Dom=$('#preview');

	this.game = new Phaser.Game(this.Dom.width(),this.Dom.height(), Phaser.CANVAS,'preview',this);

	this.setupUICallback();
}
AngoraEditor.GamePanel.prototype = {
	setupUICallback:function(){
		var self = this;
		this.Dom.mousedown(function(e){
			self.dragPos={x:e.clientX,y:e.clientY};
		});
		this.Dom.mousemove(function (e) {
			if(e.which===3){
				var dx=self.dragPos.x-e.clientX;
				var dy=self.dragPos.y-e.clientY;
				self.game.camera.x+=dx;
				self.game.camera.y+=dy;
				self.dragPos={x:e.clientX,y:e.clientY};
			}
		});
		this.Dom.mousewheel(function (e) {
			var scale = self.game.world.scale.x;
			scale += e.deltaY*0.1;
			if(scale<0.5)	scale=0.5;
			else if(scale>1.5) scale=1.5;
			self.game.world.scale.setTo(scale,scale);
			//self.game.camera.setSize(800/scale,600/scale);
			centerX=self.game.camera.x+self.game.camera.width/2;
			centerY=self.game.camera.y+self.game.camera.height/2;
			newWidth=500/scale;
			newHeight=500/scale;
			self.game.camera.setSize(newWidth,newHeight);
			self.game.camera.setPosition(centerX-newWidth/2,centerY-newHeight/2);
			//console.log(self.bg);
		});
		this.Dom.bind('contextmenu',function(e){
			e.preventDefault();
			//console.log('mouse right click');
			//editor.ui.contextMenu.showContextMenu(e.pageX,e.pageY);
		});
	},
	preload:function(){
		this.game.load.image('GAMECANVSBG','/client/resources/grid.jpg');
	},
	create:function(){
		var self = this;
		//var iBg = new Image();
		//iBg.src = this.bgData;
		//this.game.cache.addImage('bg', this.bgData, iBg);
		this.game.world.setBounds(-1024,-1024,2048,2048);
		this.game.world.removeAll();
		//var config = {width:800,height:600};//editor.Data.project.config;
		this.game.stage.backgroundColor = '#4d4d4d';
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.scale.setShowAll();

		var clickOnWorld=function(sprite, pointer){
			self.editor.Manager.gameNode.unselect();
		};
		var bg = this.game.add.tileSprite(0,0,4096,4096,'GAMECANVSBG');
		bg.anchor.set(0.5,0.5);
		bg.inputEnabled = true;
		bg.events.onInputDown.add(clickOnWorld,this);

		var bounds = this.game.add.graphics( 0, 0 );
		bounds.beginFill(0x000000, 1);
		bounds.alpha=0.5;
		bounds.drawRect(0, 0, 400, 400);
		bounds.inputEnabled = true;
		bounds.events.onInputDown.add(clickOnWorld,this);

		var create = function(x,y,anchorType){
			//var self = this;
			var anchor = self.game.add.graphics( x, y );
			anchor.anchorType=anchorType;
			anchor.beginFill(0xff0000, 1);
			anchor.drawRect(-5, -5, 10, 10);
			anchor.inputEnabled = true;
			anchor.input.enableDrag(false);
			anchor.events.onInputDown.add(function(sprite, pointer){
				if(pointer.button === Phaser.Mouse.LEFT_BUTTON){
					sprite.input.draggable = true;
					sprite.startPoint={x:sprite.x,y:sprite.y};
					//sprite.startGroupOffset={x:sprite.game.anchorGroup.x,y:sprite.game.anchorGroup.y};
				}else{
					sprite.input.draggable = false;
				}
			}, this);
			anchor.events.onDragUpdate.add(
				function(sprite, pointer, dragX, dragY, snapPoint){
					var dx=(dragX-sprite.startPoint.x)/sprite.game.world.scale.x;
					sprite.x=Math.round(sprite.startPoint.x+dx);
					var dy=(dragY-sprite.startPoint.y)/sprite.game.world.scale.y;
					sprite.y=Math.round(sprite.startPoint.y+dy);
					var x,y,w,h;
					//switch (sprite.anchorType) {
					//	case "LT":
							x=Math.round(sprite.game.anchorLT.x);
							y=Math.round(sprite.game.anchorLT.y);
							w=Math.round(sprite.game.anchorRB.x-sprite.game.anchorLT.x);
							h=Math.round(sprite.game.anchorRB.y-sprite.game.anchorLT.y);
					//		break;
					//	case "RB":
					//		w=Math.round(sprite.game.anchorRB.x-sprite.game.anchorLT.x);
					//		h=Math.round(sprite.game.anchorRB.y-sprite.game.anchorLT.y);
					//		break;
					//	default:
					//}
					self.snapAnchorToObject(x,y,w,h);
					self.editor.Manager.gameNode.updateProperty('x',x);
					self.editor.Manager.gameNode.updateProperty('y',y);
					self.editor.Manager.gameNode.updateProperty('width',w);
					self.editor.Manager.gameNode.updateProperty('height',h);
				},this);
			return anchor;
		};
		//this.game.anchorSprite=this.game.add.sprite(0,0);
		this.game.anchorBounds=this.game.add.graphics(0,0);
		this.game.anchorBounds.inputEnabled = true;
		this.game.anchorBounds.input.enableDrag(false);
		this.game.anchorBounds.hitArea=new Phaser.Rectangle(0,0,100,100);
		this.game.anchorBounds.events.onInputDown.add(function(sprite, pointer){
			if(pointer.button === Phaser.Mouse.LEFT_BUTTON){
				sprite.input.draggable = true;
				sprite.startPoint={x:sprite.x,y:sprite.y};
				//sprite.startGroupOffset={x:sprite.game.anchorGroup.x,y:sprite.game.anchorGroup.y};
			}else{
				sprite.input.draggable = false;
			}
		}, this);
		this.game.anchorBounds.events.onDragUpdate.add(
			function(sprite, pointer, dragX, dragY, snapPoint){
				var dx=(dragX-sprite.startPoint.x)/sprite.game.world.scale.x;
				sprite.x=Math.round(sprite.startPoint.x+dx);
				var dy=(dragY-sprite.startPoint.y)/sprite.game.world.scale.y;
				sprite.y=Math.round(sprite.startPoint.y+dy);
				//sprite.hitArea.x=sprite.hitArea.y=0;
				//sprite.x=sprite.y=0;
				//console.log(sprite.x,sprite.y,sprite.game.anchorGroup.x,sprite.game.anchorGroup.y);
				//sprite.x=sprite.y=0;
				var x=Math.round(sprite.x);
				var y=Math.round(sprite.y);
				self.editor.Manager.gameNode.updateProperty('x',x);
				self.editor.Manager.gameNode.updateProperty('y',y);
				//self.snapAnchorToObject(sprite.x,sprite.y,sprite.hitArea.width,sprite.hitArea.height);
				self.snapAnchorToObject(x,y,sprite.hitArea.width,sprite.hitArea.height);
			},this);
		this.game.anchorLT=create(0,0,"LT");
		this.game.anchorRB=create(100,100,"RB");
		this.game.anchorGroup=this.game.add.group();
		this.game.anchorGroup.addChild(this.game.anchorBounds);
		this.game.anchorGroup.addChild(this.game.anchorLT);
		this.game.anchorGroup.addChild(this.game.anchorRB);
		this.game.anchorGroup.visible=false;
	},
	update:function(){
		if(this.game.anchorGroup.visible){
			this.game.anchorBounds.clear();
			this.game.anchorBounds.lineStyle(2, 0xff0000, 1);
			var rect = this.game.anchorBounds.hitArea;
			this.game.anchorBounds.drawRect(rect.x,rect.y,rect.width,rect.height);
			//this.game.anchorBounds.moveTo(this.game.anchorLT.x,this.game.anchorLT.y);
			//this.game.anchorBounds.lineTo(this.game.anchorRB.x,this.game.anchorLT.y);
			//this.game.anchorBounds.lineTo(this.game.anchorRB.x,this.game.anchorRB.y);
			//this.game.anchorBounds.lineTo(this.game.anchorLT.x,this.game.anchorRB.y);
			//this.game.anchorBounds.lineTo(this.game.anchorLT.x,this.game.anchorLT.y);
		}
		/*if(this.game.selected!=null && this.delay%8==0){
			this.editor.Manager.gameNode.updateProperty('x',this.game.selected.x);
			this.editor.Manager.gameNode.updateProperty('y',this.game.selected.y);
			this.editor.Manager.gameNode.updateProperty('width',this.game.selected.width);
			this.editor.Manager.gameNode.updateProperty('height',this.game.selected.height);
			this.editor.Manager.gameNode.updateProperty('scaleX',this.game.selected.scale.x);
			this.editor.Manager.gameNode.updateProperty('scaleY',this.game.selected.scale.y);
		}*/
		//this.delay++;
	},
	/**
	* setup
	* @method setup
	* @param
	*/
	setup: function(){
		var editor = this.editor;
		//this.game.world.setBounds(-1024,-1024,2048,2048);
		this.game.world.removeAll();
		this.create();

		var resources=editor.Data.game.curState.resources;
		for(var key in resources){
			this.addResource(resources[key]);
		}
		//this.game.load.onLoadComplete.addOnce(function(){
			var nodes = editor.Data.game.curState.nodes;
			for(var key in nodes){
				this.addNode(nodes[key]);
			}
		//},this);
	},
	snapAnchorToObject:function(x,y,w,h){
		var selected = this.editor.Manager.gameNode.getSelected();
		var index = this.game.world.getChildIndex(selected.ref)+1;
		if(index>=this.game.world.children.length-1)
			this.game.world.bringToTop(this.game.anchorGroup);
		else
			this.game.world.setChildIndex(this.game.anchorGroup,index);
		//this.game.world.bringToTop(this.game.anchorGroup);
		this.game.anchorLT.x=x;
		this.game.anchorLT.y=y;
		this.game.anchorRB.x=x+parseFloat(w);
		this.game.anchorRB.y=y+parseFloat(h);
		this.game.anchorBounds.x=x;
		this.game.anchorBounds.y=y;
		this.game.anchorBounds.hitArea.setTo(0,0,parseFloat(w),parseFloat(h));
		//this.game.anchorSprite.x=x;
		//this.game.anchorSprite.y=y;
		//this.game.anchorSprite.width=parseInt(w);
		//this.game.anchorSprite.height=parseInt(h);
	},
	hideAnchor:function(){
		this.game.anchorGroup.visible=false;
	},
	showAnchor:function(){
		this.game.anchorGroup.visible=true;
	},
	addResource:function(res){
		var game = this.game;
		var projectPath = this.editor.Data.project.path;
		var respath = '{0}/{1}'.format(projectPath,res.path);
		switch (res.type) {
			case 'image':
				game.load.image(res.id,respath);
				break;
			case 'spritesheet':
				game.load.spritesheet(res.id, respath, parseInt(res.width/res.Xframe), parseInt(res.height/res.Yframe));
			default:
		}
	},
	startLoadResources:function(){
		this.game.load.start();
	},
	addNode:function(node){
		//this.editor.Data.game.curState.addNode(node);
		var game=this.game;
		var gameNode = null;
		switch (node.type) {
			case 'sprite':
			case 'animate':
				gameNode = game.add.sprite(node.property.x,node.property.y,node.property.image);
				break;
			case 'tilesprite':
				gameNode = game.add.tileSprite(node.property.x,node.property.y,
					node.property.width,node.property.height,node.property.image);
				break;
			default:
		}
		if(gameNode!=null){
			//gameNode.scale.set(node.property.scaleX,node.property.scaleY);
			//gameNode.fixedToCamera=true;
	    gameNode.inputEnabled = true;
			//gameNode.input.enableDrag(false);
			gameNode.events.onInputDown.add(function(sprite, pointer){
				self.editor.Manager.gameNode.select(node.id);
				sprite.game.anchorBounds.startPoint={x:sprite.x,y:sprite.y};
				sprite.game.anchorBounds.input.startDrag(pointer);
			}, this);
		}
		return gameNode;
	},
	/**
	* remove node from game pane DOM
	* @method remove
	* @param {Object} node
	*/
	remove: function(node){
		this.editor.Manager.gameNode.remove(this.game,node);
	},
	/**
	* select a node of game pane DOM
	* @method select
	* @param {string} id
	*/
	select: function(id){

	},
	unselect:function(){

	},
	/**
	* clear the game pane DOM
	* @method reset
	* @param
	*/
	reset: function(){
		this.game.world.removeAll();
		this.create();
		//this.pane.empty();
		//this.offset={x:0,y:0};
	}
}

AngoraEditor.GamePanel.prototype.constructor = AngoraEditor.GamePanel;
