var main_res={}
var main_scn={"sprite0":{"id":"sprite0","type":"sprite","visible":"true","x":"160","y":449.09999999999997,"width":50,"height":89,"image":"arrow","frame":0,"scaleX":1,"scaleY":1,"anchorX":"0.5","anchorY":"0.8","rotation":0,"physics":false,"dynamic":true,"body":"default","mass":10,"fixedRotation":true},"group1":{"id":"group1","type":"physicsgroup","visible":"true","x":0,"y":0},"sprite3":{"id":"sprite3","type":"sprite","visible":"true","x":159,"y":445,"width":32,"height":32,"image":"bob1","frame":0,"scaleX":1,"scaleY":1,"anchorX":"0.5","anchorY":"0.5","rotation":0,"physics":"true","dynamic":"true","body":"default","mass":10,"fixedRotation":true}}
var main_config={"backgroundColor":"#000000","world":{"x":0,"y":0,"width":"320","height":"480","collideWorldBounds":false},"camera":{"x":0,"y":0,"width":"480","height":"600"},"physics":{"enable":"true","type":"ARCADE","gravityX":0,"gravityY":0},"input":{"onDown":"game_onDown","onHold":"","onTap":"","onUp":""}}
var main=function(game){this.game=game;this.sceneName="main";this.sceneRes=main_res;this.sceneNode=main_scn;this.worldConfig=main_config;this.isLoadComplete=false;this.isCreateFinished=false;this.objects={};this.physicType="ARCADE";};main.prototype={preload:function(){this.customLoad();},create:function(){var worldConfig=this.worldConfig;this.stage.backgroundColor=worldConfig.backgroundColor;this.world.setBounds(parseInt(worldConfig.world.x),parseInt(worldConfig.world.y),parseInt(worldConfig.world.width),parseInt(worldConfig.world.height));if(parseBoolean(worldConfig.physics.enable)){this.physicType=worldConfig.physics.type;if(this.worldConfig.physics.type=="ARCADE"){this.game.physics.startSystem(Phaser.Physics.ARCADE);this.game.physics.arcade.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.arcade.gravity.y=parseInt(worldConfig.physics.gravityY);}else if(worldConfig.physics.type=="P2JS"){this.game.physics.startSystem(Phaser.Physics.P2JS);this.game.physics.p2.gravity.x=parseInt(worldConfig.physics.gravityX);this.game.physics.p2.gravity.y=parseInt(worldConfig.physics.gravityY);}}
for(ev in worldConfig.input){if(worldConfig.input[ev]!="")
this.game.input[ev].add(this[worldConfig.input[ev]],this);}
this.load.onLoadComplete.addOnce(this.loadComplete,this);for(i in this.sceneRes){LoadRes(this,this.sceneRes[i]);}
this.load.start();},loadComplete:function(){for(i in this.sceneNode){this.objects[this.sceneNode[i].id]=createObject(this,this.sceneNode[i]);if(typeof this.sceneNode[i].group!='undefined'){this.objects[this.sceneNode[i].group].add(this.objects[this.sceneNode[i].id]);}}
this.isLoadComplete=true;this.customCreate();this.isCreateFinished=true;},update:function(){if(this.isCreateFinished){this.customUpdate();}
else{this.customPreUpdate();}},customLoad:function(){},customCreate:function(){},customPreUpdate:function(){},customUpdate:function(){},shutdown:function(){for(obj in this.objects){game.world.remove(this.objects[obj]);}
this.objects={};for(res in this.sceneRes){removeRes(this,this.sceneRes[res]);}
this.sceneRes={};}};var arr=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];var objarr=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];var prerow,precol;var killarr=[];main.prototype.customLoad=function(){}
main.prototype.customCreate=function(){for(i=0;i<4;i++){for(j=0;j<9;j++){arr[i][j]=Math.floor(Math.random()*5)+1;var obj=this.objects.group1.create(32*j+(i%2)*0,32*i,'bob'+arr[i][j]);obj.body.immovable=true;obj.row=i;obj.col=j;obj.bob=arr[i][j];objarr[i][j]=obj;}}
this.objects.sprite3.bob=1;}
main.prototype.customUpdate=function(){var mpos={x:game.input.mousePointer.x,y:game.input.mousePointer.y};var direct={x:mpos.x-160,y:mpos.y-445};this.objects.sprite0.rotation=-Math.atan(direct.x/direct.y);currow=Math.floor(this.objects.sprite3.y/32);curcol=Math.floor(this.objects.sprite3.x/32);if(this.checkaround(currow,curcol)){var key=this.objects.sprite3.bob;this.stop(curcol,currow,key);this.check(curcol,currow,key);if(killarr.length>=3){this.killAll();this.checkAll();}else
this.resetAll();}}
main.prototype.killAll=function(){console.log(killarr);for(var i in killarr){arr[killarr[i].row][killarr[i].col]=0;objarr[killarr[i].row][killarr[i].col]=0;killarr[i].kill();}}
main.prototype.checkAll=function(){for(i=0;i<9;i++){for(j=0;j<9;j++){if(this.checkaround(i,j)===false){arr[i][j]=0;objarr[i][j]=0;}}}}
main.prototype.resetAll=function(){for(i=0;i<9;i++){for(j=0;j<9;j++){if(typeof objarr[i][j]==='object')
arr[objarr[i][j].row][objarr[i][j].col]=objarr[i][j].bob;}}}
main.prototype.check=function(col,row,key){if(arr[row-1][col]==key){this.kill(col,row-1);this.check(col,row-1,key);}
if(arr[row+1][col]==key){this.kill(col,row+1);this.check(col,row+1,key);}
if(arr[row][col-1]==key){this.kill(col-1,row);this.check(col-1,row,key);}
if(arr[row][col+1]==key){this.kill(col+1,row);this.check(col+1,row,key);}}
main.prototype.kill=function(x,y){if(typeof objarr[y][x]==='object'){killarr.push(objarr[y][x]);}
arr[y][x]=0;}
main.prototype.checkaround=function(row,col){if(row<1||row>=8||col<1||col>=8)return false;return arr[row-1][col]+arr[row+1][col]+arr[row][col-1]+arr[row][col+1]>0;}
main.prototype.stop=function(x,y,key){arr[y][x]=key;var obj=this.objects.group1.create(32*x+(y%2)*0,32*y,this.objects.sprite3.key);obj.body.immovable=true;obj.row=y;obj.col=x;obj.bob=key;objarr[y][x]=obj;this.objects.sprite3.reset(160,445);var newkey=Math.floor(Math.random()*5)+1;this.objects.sprite3.bob=newkey;this.objects.sprite3.loadTexture('bob'+newkey);this.kill(x,y,key);}
main.prototype.game_onDown=function(){killarr=[];var mpos={x:game.input.mousePointer.x,y:game.input.mousePointer.y};var direct={x:mpos.x-160,y:mpos.y-445};this.objects.sprite3.body.velocity.x=direct.x;this.objects.sprite3.body.velocity.y=direct.y;}