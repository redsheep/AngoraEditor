function createObject(state, node) {
	var object = null;
	switch (node.type) {
	case 'tilesprite':
	case 'sprite':
	case 'animate':
		if(node.type=='tilesprite'){
			object = state.add.tileSprite(parseInt(node.x), parseInt(node.y), parseInt(node.width), parseInt(node.height), node.image);
			if(typeof node.frame!='undefined')
				object.frame=node.frame;
		}else if(node.type=='sprite'){
			object = state.add.sprite(parseInt(node.x), parseInt(node.y), node.image);
			object.width=parseInt(node.width);
			object.height=parseInt(node.height);
			if(typeof node.frame!='undefined')
				object.frame=node.frame;
		}else if(node.type=='animate'){
			object = state.add.sprite(parseInt(node.x), parseInt(node.y), node.image);
			for (key in node.animations) {
				object.animations.add(key, node.animations[key].sequence, 10, true);
			}
		}
		//object.width = parseInt(node.width);
		//object.height = parseInt(node.height);
		if(typeof node.anchorX!='undefined'&&typeof node.anchorY!='undefined')
			object.anchor.set(parseFloat(node.anchorX),parseFloat(node.anchorY));
		if(String(node.physics)=='true'){
			if(state.physicType=="ARCADE"){
				state.game.physics.arcade.enable(object);
				object.body.immovable=!parseBoolean(node.dynamic);
				object.body.allowGravity=parseBoolean(node.dynamic);
				object.body.mass=parseInt(node.mass);
				object.body.allowRotation=!parseBoolean(node.fixedRotation);
			}else if(state.physicType=="P2JS"){
				state.game.physics.p2.enable(object);
				object.body.dynamic=parseBoolean(node.dynamic);
				object.body.mass=parseInt(node.mass);
				object.body.fixedRotation=parseBoolean(node.fixedRotation);
			}
			//object.body.collideWorldBounds = true;
		}
		break;
	case 'image':
		object = state.add.image(parseInt(node.x), parseInt(node.y), node.image);
		object.width=parseInt(node.width);
		object.height=parseInt(node.height);
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
		break;
	case 'bitmaptext':
		object = state.add.bitmapText(parseInt(node.x), parseInt(node.y), node.font, node.text);
		object.fontSize = node.fontSize;
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
	case 'tilemap':
		object = state.add.tilemap(node.tilemap);
		for(var i in node.tileset){
			object.addTilesetImage(node.tileset[i]);
		}
		break;
	default:
		break;
	}
	if (typeof node.rotation !== 'undefined'){
		object.angle=parseInt(node.rotation);
		if(object.body!=null)
			object.body.angle=parseInt(node.rotation);
	}
	if (typeof node.visible !== 'undefined')
		object.visible = parseBoolean(node.visible);
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
	case 'tilemap':
		for(img in res.tileset)
			game.load.image(img,res.tileset[img]);
		return game.load.tilemap(res.id, res.data, null, Phaser.Tilemap.TILED_JSON);
	default:
		return false;
	}
}
function removeRes(game, res) {
	switch (res.type) {	
	case 'image':
	case 'atlas':
	case 'spritesheet':
		return game.cache.removeImage(res.id);
	case 'bitmapFont':
		return game.cache.removeBitmapFont(res.id);
	case 'audio':
		return game.cache.removeSound(res.id);
	case 'text':
		return game.cache.removeText(res.id);
	case 'tilemap':
		return game.cache.removeTilemap(res.id);
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
