
/*function LoadNode(game,node){
return createObject(game,node);
//return objects[node.name];
//   if(node.parent in objects){
// 	objects[node.parent].add(objects[node.name]);
//   }
//   else{
// 	objects[node.parent]=game.add.group();
//   }
}*/
function createObject(state, node) {
	var object = null;
	switch (node.type) {
	case 'tilesprite':
		object = state.add.tileSprite(parseInt(node.x), parseInt(node.y), parseInt(node.width), parseInt(node.height), node.image);
		object.visible = Boolean(node.visible);
		if(typeof node.frame!='undefined')
			object.frame=node.frame;
		break;
	case 'image':
	case 'sprite':
		object = state.add.sprite(parseInt(node.x), parseInt(node.y), node.image);
		//object.width = parseInt(node.width);
		//object.height = parseInt(node.height);
		if(typeof node.frame!='undefined')
			object.frame=node.frame;
		object.visible = Boolean(node.visible);
		state.game.physics.arcade.enable(object);
		object.body.collideWorldBounds = true;
		object.body.enable = node.physics;
		//game.physics.arcade.enable(object);
		//object.body.allowGravity = false;
		break;
	case 'animate':
		object = state.add.sprite(parseInt(node.x), parseInt(node.y), node.image);
		//object.width = parseInt(node.width);
		//object.height = parseInt(node.height);
		object.visible = Boolean(node.visible);
		state.game.physics.arcade.enable(object);
		object.body.collideWorldBounds = true;
		object.body.enable = node.physics;
		for (key in node.animations) {
			object.animations.add(key, node.animations[key].sequence, 10, true);
		}
		//game.physics.arcade.enable(object);
		//object.body.allowGravity = false;
		break;
	case 'group':
		object = state.add.group();
		//parseInt(node.x), parseInt(node.y), node.image);
		break;
	case 'text':
		//var style = { font: "{0}px {1}".format(node.fontSize,fontFamily), fill: node.fontColor, align: node.textAlign };
		object = state.add.text(parseInt(node.x), parseInt(node.y), node.text);
		object.font = node.fontFamily;
		object.fill = node.fontColor;
		object.fontSize = node.fontSize;
		object.visible = Boolean(node.visible);
		break;
	case 'bitmaptext':
		object = state.add.bitmapText(parseInt(node.x), parseInt(node.y), node.font, node.text);
		object.fontSize = node.fontSize;
		object.visible = Boolean(node.visible);
		break;
	case 'audio':
		object = state.add.audio(node.audio);
		for( key in node.tracks){
			var st=node.tracks[key]
			object.addMarker(key,st.start,st.duration,st.volume,st.loop);
		}
		break;
	case 'button':
		object = state.add.button(parseInt(node.x), parseInt(node.y), node.image);
		object.width = parseInt(node.width);
		object.height = parseInt(node.height);
		object.visible = Boolean(node.visible);
		if(typeof node.frame!='undefined')
			object.frame=node.frame;
		break;
	case 'particle':
		object = state.add.emitter(parseInt(node.x), parseInt(node.y),parseInt(node.maxParticles));
		break;
	case 'timer':
		object = state.time.create(false);
		object.loop(parseInt(node.delay), node.events.callback, state);
		return object;
	default:
		break;
	}
	if (typeof node.events !== 'undefined') {
		for (e in node.events) {
			object.inputEnabled = true;
			object.events[e].add(state[node.events[e]], state);
		}
	}
	return object;
}
function LoadRes(game, res) {
	switch (res.type) {
	case 'image':
		return game.load.image(res.id, res.path);
	case 'audio':
		return game.load.audio(res.id, res.path);
	case 'spritesheet':
		return game.load.spritesheet(res.id, res.path, parseInt(res.width/res.Xframe), parseInt(res.height/res.Yframe));
	case 'bitmapFont':
		return game.load.bitmapFont(res.id, res.bitmap, res.data);
	case 'atlas':
		return game.load.atlas(res.id, res.path, res.data);
	case 'text':
		return game.load.text(res.id,res.path);
	default:
		return false;
	}
}
function LoadScript(filename) {
	var head = document.getElementsByTagName('head')[0];
	script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	head.appendChild(script)
}
