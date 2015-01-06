var {sceneName} = function(game) {
  this.game = game;
  this.sceneName="{sceneName}";
  this.sceneRes={sceneName}_res;
  this.sceneNode={sceneName}_scn;
  this.worldConfig={sceneName}_config;
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
};
{sceneName}.prototype = {
  preload: function() {
	this.customLoad();
  },
  create: function() {
 	for(ev in this.worldConfig.input){
		if(this.worldConfig.input[ev]!="")
		this.game.input[ev].add(this[this.worldConfig.input[ev]],this);
	}
    this.stage.backgroundColor = this.worldConfig.backgroundColor;
	this.world.setBounds(0, 0, this.worldConfig.world.width, this.worldConfig.world.height);
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