var {sceneName} = function(game) {
  this.game = game;
  this.sceneName="{sceneName}";
  this.sceneResFile="{sceneName}.res"+'?'+ new Date().getTime();
  this.sceneNodeFile="{sceneName}.scn"+'?'+ new Date().getTime();
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
};
{sceneName}.prototype = {
  preload: function() {
    this.load.text('sceneRes', this.sceneResFile);
    this.load.text('sceneNode', this.sceneNodeFile);
    this.customLoad();
  },
  create: function() {
    this.sceneRes = JSON.parse(this.cache.getText('sceneRes'));
    for(i in this.sceneRes){
      LoadRes(this,this.sceneRes[i]);
    }
    this.load.onLoadComplete.addOnce(this.loadComplete,this);
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
    this.isLoadComplete=true;
    this.customCreate();
    this.isCreateFinished=true;
  },
  update:function(){
    if(this.isCreateFinished){
      this.customUpdate();
    }else{
      this.customPreUpdate();
    }
  },
  customLoad:function(){},
  customCreate:function(){},
  customPreUpdate:function(){},
  customUpdate:function(){}
};
LoadScript('{sceneName}.script.js');
