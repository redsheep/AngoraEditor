var game;
function parseBoolean(str){
	return String(str)=='true';
}
window.onload = function() {
	game = new Phaser.Game(320, 480, Phaser.AUTO, '');
	game.state.add('preload',preload);
	game.state.add('gameplay',gameplay);
	game.state.add('gameover',gameover);
	game.state.add('main',main);
	game.state.start('preload');
};