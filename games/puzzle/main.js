var main_res={}
var main_scn={"group0":{"id":"group0","type":"group","visible":"true","x":0,"y":0,"physics":false}}
var main_config={"backgroundColor":"#000000","world":{"x":0,"y":0,"width":"480","height":"480","collideWorldBounds":false},"camera":{"x":0,"y":0,"width":"480","height":"480"},"physics":{"enable":"true","type":"ARCADE","gravityX":0,"gravityY":0},"input":{"onDown":"game_onDown","onHold":"","onTap":"","onUp":"game_onUp"}}
var main=function(game){this.game=game;this.sceneName="main";this.sceneRes=main_res;this.sceneNode=main_scn;this.worldConfig=main_config;this.isLoadComplete=false;this.isCreateFinished=false;this.objects={};this.physicType="ARCADE";};main.prototype={preload:function(){this.customLoad();},create:function(){var worldConfig=this.worldConfig;this.stage.backgroundColor=worldConfig.backgroundColor;this.world.setBounds(parseInt(worldConfig.world.x),parseInt(worldConfig.world.y),parseInt(worldConfig.world.width),parseInt(worldConfig.world.height));if(parseBoolean(worldConfig.physics.enable)){this.physicType=worldConfig.physics.type;if(this.worldConfig.physics.type=="ARCADE"){this.game.physics.startSystem(Phaser.Physics.ARCADE);this.game.physics.arcade.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.arcade.gravity.y=parseInt(worldConfig.physics.gravityY);}else if(worldConfig.physics.type=="P2JS"){this.game.physics.startSystem(Phaser.Physics.P2JS);this.game.physics.p2.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.p2.gravity.y=parseInt(worldConfig.physics.gravityY);}}
for(ev in worldConfig.input){if(worldConfig.input[ev]!="")
this.game.input[ev].add(this[worldConfig.input[ev]],this);}
this.load.onLoadComplete.addOnce(this.loadComplete,this);for(i in this.sceneRes){LoadRes(this,this.sceneRes[i]);}
this.load.start();},loadComplete:function(){for(i in this.sceneNode){this.objects[this.sceneNode[i].id]=createObject(this,this.sceneNode[i]);if(typeof this.sceneNode[i].group!='undefined'){this.objects[this.sceneNode[i].group].add(this.objects[this.sceneNode[i].id]);}}
this.isLoadComplete=true;this.customCreate();this.isCreateFinished=true;},update:function(){if(this.isCreateFinished){this.customUpdate();}
else{this.customPreUpdate();}},customLoad:function(){},customCreate:function(){},customPreUpdate:function(){},customUpdate:function(){},shutdown:function(){for(obj in this.objects){game.world.remove(this.objects[obj]);}
this.objects={};for(res in this.sceneRes){removeRes(this,this.sceneRes[res]);}
this.sceneRes={};}};var objarr=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];var currow=null;var curcol=null;var killarr=[];var delay=0;var canswap=false;main.prototype.customLoad=function(){}
main.prototype.customCreate=function(){for(i=0;i<8;i++){for(j=0;j<8;j++){this.createbob(j,i,Math.floor(Math.random()*5+1));}}}
main.prototype.customUpdate=function(){if(delay++%32===0){if(this.dropAll()!==0){canswap=false;}else{this.checkAll();canswap=true;}}}
main.prototype.check=function(row,col,key,px,nx,py,ny){if(ny&&row>=1&&objarr[row-1][col]!==null&&objarr[row-1][col].bob===key){this.kill(row-1,col);this.check(row-1,col,key,0,0,0,1);}
if(py&&row<7&&objarr[row+1][col]!==null&&objarr[row+1][col].bob===key){this.kill(row+1,col);this.check(row+1,col,key,0,0,1,0);}
if(nx&&col>=1&&objarr[row][col-1]!==null&&objarr[row][col-1].bob===key){this.kill(row,col-1);this.check(row,col-1,key,0,1,0,0);}
if(px&&col<7&&objarr[row][col+1]!==null&&objarr[row][col+1].bob===key){this.kill(row,col+1);this.check(row,col+1,key,1,0,0,0);}}
main.prototype.dropAll=function(){var num=0;for(i=7;i>0;i--){for(j=7;j>=0;j--){if(objarr[i][j]===null){this.swap(i,j,i-1,j);num++;}}}
var rnd=Math.floor(Math.random()*6);for(i=0;i<8;i++){if(objarr[0][i]===null)
this.createbob(0,i,Math.floor(Math.random()*5+1));}
return num;}
main.prototype.createbob=function(row,col,key){var obj=this.objects.group0.create(32*col,32*row,'bob'+key);obj.bob=key;obj.row=row;obj.col=col;objarr[row][col]=obj;}
main.prototype.checkAll=function(){var numkill=0;for(var i=0;i<8;i++){for(var j=0;j<8;j++){if(objarr[i][j]!==null){var obj=objarr[i][j];killarr.push(obj);this.check(i,j,obj.bob,0,0,1,1);numkill+=this.killAll();killarr.push(obj);this.check(i,j,obj.bob,1,1,0,0);numkill+=this.killAll();}}}
return numkill;}
main.prototype.killAll=function(){if(killarr.length>=3){var numkill=killarr.length;for(var r=0;r<killarr.length;r++){objarr[killarr[r].row][killarr[r].col]=null;killarr[r].kill();}
killarr=[];return numkill;}
killarr=[];return 0;}
main.prototype.kill=function(row,col){killarr.push(objarr[row][col]);}
main.prototype.swap=function(y1,x1,y2,x2){var tempobj=objarr[y1][x1];objarr[y1][x1]=objarr[y2][x2];objarr[y2][x2]=tempobj;if(objarr[y1][x1]!==null){objarr[y1][x1].position.set(x1*32,y1*32);objarr[y1][x1].row=y1;objarr[y1][x1].col=x1;}
if(objarr[y2][x2]!==null){objarr[y2][x2].position.set(x2*32,y2*32);objarr[y2][x2].row=y2;objarr[y2][x2].col=x2;}}
main.prototype.game_onDown=function(){if(!canswap)return;y=Math.floor(game.input.mousePointer.y/32);x=Math.floor(game.input.mousePointer.x/32);if(currow!==null&&curcol!==null){this.swap(currow,curcol,y,x);if(this.checkAll()===0)
this.swap(currow,curcol,y,x);else
delay=1;currow=curcol=null;}else{currow=y;curcol=x;}
console.log(y,x);}
main.prototype.game_onUp=function(){}