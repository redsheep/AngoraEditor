main.prototype.customUpdate=function(){

}
main.prototype.customCreate=function(){
  this.objects.animate4.animations.play('fly');
}
main.prototype.sprite1_onInputDown = function(){
  game.state.start('gameplay');
}
