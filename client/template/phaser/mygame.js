var game;
window.onload = function() {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', '{projectpath}/global.res', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        var resources = JSON.parse(xobj.responseText);
        game = new Phaser.Game(800,600, Phaser.AUTO, '', {
          preload:function(){
            for(var res in resources){
              LoadRes(this.game,resources[res]);
            }
          },
          create:function(){
            game.state.start('{startState}');
          }
        });
      }
    };
    xobj.send(null);
};
