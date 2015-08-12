var game;
function parseBoolean(str){
	return String(str)=='true';
}
window.onload = function() {

	game = new Phaser.Game({w}, {h}, Phaser.AUTO, '');
	game.state.start('preload');
};