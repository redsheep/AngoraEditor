var {sceneName} = function(game) {
  this.game = game;
  this.sceneName="{sceneName}";
  this.sceneResFile="{sceneName}.res";
  this.sceneNodeFile="{sceneName}.scn";
  this.sceneScriptsFile="{sceneName}.scripts";
  this.configFile="config.json";
  this.worldConfigFile="{sceneName}.config";
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
};
{sceneName}.prototype = {
  preload: function() {
	this.load.text('sceneRes', this.sceneResFile);
	this.load.text('sceneNode', this.sceneNodeFile);
	this.load.text('sceneScripts', this.sceneScriptsFile);
	this.load.text('config',this.configFile);
	this.load.text('worldConfig',this.worldConfigFile);
	this.customLoad();
  },
  create: function() {
	var config=JSON.parse(this.cache.getText('config'));
	var worldConfig=JSON.parse(this.cache.getText('worldConfig'));
	/*this.game.scale.width = parseInt(config.display.width);
    this.game.scale.height = parseInt(config.display.height);
	this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.setScreenSize();*/
	if(config.physics.enable){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.x = 0;//worldConfig.gravity.x;
		this.game.physics.arcade.gravity.y = 100;//worldConfig.gravity.y;
	}
 	for(ev in worldConfig.input){
		if(worldConfig.input[ev]!="")
		this.game.input[ev].add(this[worldConfig.input[ev]],this);
	} 
	//this.game.sound.volume=config.sound.volume;
	//if(config.sound.enable==false)
	//	this.game.sound.volume=0;
    this.stage.backgroundColor = worldConfig.backgroundColor;
	this.world.setBounds(0, 0, worldConfig.world.width, worldConfig.world.height);
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
LoadScript('{sceneName}.script.js');
// State1.prototype.update=function(){
//   if(this.isLoadComplete)
// 	objects['MushRoom'].x++;
// }