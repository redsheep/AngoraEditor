var baseState = function(game) {
  this.game = game;
  this.isLoadComplete=false;
  this.isCreateFinished=false;
  this.objects={};
  this.init();
};
baseState.prototype = {
  preload: function() {
    this.load.text('sceneNode', this.sceneNodeFile);
    this.customLoad();
  },
  create: function() {
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
  init:function(){},
  customLoad:function(){},
  customCreate:function(){},
  customPreUpdate:function(){},
  customUpdate:function(){}
};
