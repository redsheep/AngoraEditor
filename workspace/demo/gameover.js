var gameover = function(game) {
  this.game = game;
  this.sceneName="gameover";
  this.sceneResFile="gameover.res"+'?'+ new Date().getTime();
  this.sceneNodeFile="gameover.scn"+'?'+ new Date().getTime();
  this.worldConfigFile="gameover.config"+'?'+ new Date().getTime();
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
  this.physicType="ARCADE";
};
gameover.prototype = {
  preload: function() {
	this.load.text('sceneRes', this.sceneResFile);
	this.load.text('sceneNode', this.sceneNodeFile);
	this.load.text('worldConfig',this.worldConfigFile);
	this.customLoad();
  },
  create: function() {
	var worldConfig=JSON.parse(this.cache.getText('worldConfig'));
	/*this.game.scale.width = parseInt(config.display.width);
    this.game.scale.height = parseInt(config.display.height);
	this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.setScreenSize();*/
	if(parseBoolean(worldConfig.physics.enable)){
		this.physicType=worldConfig.physics.type;
		if(worldConfig.physics.type=="ARCADE"){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.x = parseInt(worldConfig.physics.gravityX);
		this.game.physics.arcade.gravity.y = parseInt(worldConfig.physics.gravityY);
		}else if(worldConfig.physics.type=="P2JS"){
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.gravity.x = parseInt(worldConfig.physics.gravityX);
		this.game.physics.p2.gravity.y = parseInt(worldConfig.physics.gravityY);
		}
	}
 	for(ev in worldConfig.input){
		if(worldConfig.input[ev]!="")
		this.game.input[ev].add(this[worldConfig.input[ev]],this);
	}
    this.stage.backgroundColor = worldConfig.backgroundColor;
	this.world.setBounds(parseInt(worldConfig.world.x), parseInt(worldConfig.world.y), parseInt(worldConfig.world.width), parseInt(worldConfig.world.height));
	this.camera.bounds=new Phaser.Rectangle(parseInt(worldConfig.camera.x), parseInt(worldConfig.camera.y), parseInt(worldConfig.camera.width), parseInt(worldConfig.camera.height));
	this.load.onLoadComplete.addOnce(this.loadComplete,this);
	var sceneRes = JSON.parse(this.cache.getText('sceneRes'));
	for(i in sceneRes){
	  LoadRes(this,sceneRes[i]);
	}
	this.load.start();
  },
  loadComplete: function(){
	var sceneNode = JSON.parse(this.cache.getText('sceneNode'));
	for(i in sceneNode){
	  this.objects[sceneNode[i].id]=createObject(this,sceneNode[i]);
	  if(typeof sceneNode[i].group!='undefined'){
		this.objects[sceneNode[i].group].add(this.objects[sceneNode[i].id]);
	  }
	}
	/*var scripts = JSON.parse(this.cache.getText('sceneScripts'));
	for(ev in scripts){
	  var obj=objects[ev];
	  obj.inputEnabled=true;
	  for(e in scripts[ev]){
		obj.events[e].add(window[scripts[ev][e]],this);
	  }
	}*/
	this.isLoadComplete=true;
	this.customCreate();
	this.isCreateFinished=true;
  },
  update:function(){
	if(this.isCreateFinished){
		this.customUpdate();
	}
	else{
		this.customPreUpdate();
	}
  },
  customLoad:function(){},
  customCreate:function(){},
  customPreUpdate:function(){},
  customUpdate:function(){},
  shutdown:function(){
	for( obj in this.objects){
		game.world.remove(this.objects[obj]);
	}
  }
};
LoadScript('gameover.script.js');