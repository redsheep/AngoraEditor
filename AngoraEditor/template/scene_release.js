var {sceneName} = function(game) {
  this.game = game;
  this.sceneName="{sceneName}";
  this.sceneRes={sceneName}_res;
  this.sceneNode={sceneName}_scn;
  this.worldConfig={sceneName}_config;
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
  this.physicType="ARCADE";
};
{sceneName}.prototype = {
  preload: function() {
	this.customLoad();
  },
  create: function() {
	var worldConfig=this.worldConfig;
  	if(parseBoolean(worldConfig.physics.enable)){
		this.physicType=worldConfig.physics.type;
		if(this.worldConfig.physics.type=="ARCADE"){
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
	for(i in this.sceneRes){
	  LoadRes(this,this.sceneRes[i]);
	}
	this.load.start();
  },
  loadComplete: function(){
	for(i in this.sceneNode){
	  this.objects[this.sceneNode[i].id]=createObject(this,this.sceneNode[i]);
	  if(typeof this.sceneNode[i].group!='undefined'){
		this.objects[this.sceneNode[i].group].add(this.objects[this.sceneNode[i].id]);
	  }
	}
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