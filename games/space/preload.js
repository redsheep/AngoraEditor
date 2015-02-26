var preload_res={"bullet":{"id":"bullet","type":"image","path":"data/bullet.png","height":18,"width":33},"enemy":{"id":"enemy","type":"image","path":"data/enemy.png","height":69,"width":109},"enemy2":{"id":"enemy2","type":"image","path":"data/enemy2.png","height":61,"width":108},"ship":{"id":"ship","type":"image","path":"data/ship.png","height":64,"width":75}}
var preload_scn={}
var preload_config={"backgroundColor":"#000000","world":{"x":0,"y":0,"width":"800","height":"600","collideWorldBounds":false},"camera":{"x":0,"y":0,"width":"800","height":"600"},"physics":{"enable":false,"type":"ARCADE","gravityX":0,"gravityY":0},"input":{"onDown":"","onHold":"","onTap":"","onUp":""}}
var preload=function(game){this.game=game;this.sceneName="preload";this.sceneRes=preload_res;this.sceneNode=preload_scn;this.worldConfig=preload_config;this.isLoadComplete=false;this.isCreateFinished=false;this.objects={};this.physicType="ARCADE";};preload.prototype={preload:function(){this.customLoad();},create:function(){var worldConfig=this.worldConfig;this.stage.backgroundColor=worldConfig.backgroundColor;this.world.setBounds(parseInt(worldConfig.world.x),parseInt(worldConfig.world.y),parseInt(worldConfig.world.width),parseInt(worldConfig.world.height));if(parseBoolean(worldConfig.physics.enable)){this.physicType=worldConfig.physics.type;if(this.worldConfig.physics.type=="ARCADE"){this.game.physics.startSystem(Phaser.Physics.ARCADE);this.game.physics.arcade.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.arcade.gravity.y=parseInt(worldConfig.physics.gravityY);}else if(worldConfig.physics.type=="P2JS"){this.game.physics.startSystem(Phaser.Physics.P2JS);this.game.physics.p2.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.p2.gravity.y=parseInt(worldConfig.physics.gravityY);}}
for(ev in worldConfig.input){if(worldConfig.input[ev]!="")
this.game.input[ev].add(this[worldConfig.input[ev]],this);}
this.load.onLoadComplete.addOnce(this.loadComplete,this);for(i in this.sceneRes){LoadRes(this,this.sceneRes[i]);}
this.load.start();},loadComplete:function(){for(i in this.sceneNode){this.objects[this.sceneNode[i].id]=createObject(this,this.sceneNode[i]);if(typeof this.sceneNode[i].group!='undefined'){this.objects[this.sceneNode[i].group].add(this.objects[this.sceneNode[i].id]);}}
this.isLoadComplete=true;this.customCreate();this.isCreateFinished=true;},update:function(){if(this.isCreateFinished){this.customUpdate();}
else{this.customPreUpdate();}},customLoad:function(){},customCreate:function(){},customPreUpdate:function(){},customUpdate:function(){},shutdown:function(){for(obj in this.objects){game.world.remove(this.objects[obj]);}
this.objects={};for(res in this.sceneRes){removeRes(this,this.sceneRes[res]);}
this.sceneRes={};}};preload.prototype.customLoad=function(){}
preload.prototype.customCreate=function(){game.state.start('main');}
preload.prototype.customUpdate=function(){}
preload.prototype.shutdown=function(){}