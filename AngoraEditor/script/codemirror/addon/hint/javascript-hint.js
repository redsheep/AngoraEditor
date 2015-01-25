(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                       type: token.string == "." ? "property" : null};
    }
    // If it is a property, find out what it is a property of.
    while (tprop.type == "property") {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string != ".") return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (!context) var context = [];
      context.push(tprop);
    }
    return {list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)};
  }

  function javascriptHint(editor, options) {
    return scriptHint(editor, javascriptKeywords,
                      function (e, cur) {return e.getTokenAt(cur);},
                      options);
  };
  CodeMirror.registerHelper("hint", "javascript", javascriptHint);

  function getCoffeeScriptToken(editor, cur) {
  // This getToken, it is for coffeescript, imitates the behavior of
  // getTokenAt method in javascript.js, that is, returning "property"
  // type and treat "." as indepenent token.
    var token = editor.getTokenAt(cur);
    if (cur.ch == token.start + 1 && token.string.charAt(0) == '.') {
      token.end = token.start;
      token.string = '.';
      token.type = "property";
    }
    else if (/^\.[\w$_]*$/.test(token.string)) {
      token.type = "property";
      token.start++;
      token.string = token.string.replace(/\./, '');
    }
    return token;
  }

  function coffeescriptHint(editor, options) {
    return scriptHint(editor, coffeescriptKeywords, getCoffeeScriptToken, options);
  }
  CodeMirror.registerHelper("hint", "coffeescript", coffeescriptHint);

  var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
                     "toUpperCase toLowerCase split concat match replace search").split(" ");
  var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
                    "lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
  var funcProps = "prototype apply call bind".split(" ");
  var javascriptKeywords = ("break case catch continue debugger default delete do else false finally for function " +
                  "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
  var coffeescriptKeywords = ("and break catch class continue delete do else extends false finally for " +
                  "if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes").split(" ");
  var displayobjectProps = "alpha blendMode cacheAsBitmap filterArea filters hitArea mask pivot position renderable rotation scale visible x y width height generateTexture getBounds getLocalBounds setStageReference toGlobal toLocal ".split(" ");
  var spriteProps = "alive anchor angle animations autoCull body buttonMode cameraOffset checkWorldBounds children cropRect debug deltaX deltaZ destroyPhase events exists fixedToCamera frame frameName health inCamera input inputEnabled inWorld key lifespan name outOfBoundsKill parent scaleMax scaleMin shader smoothed texture tint transformCallback transformCallbackContext type width addChild addChildAt bringToTop crop damage destroy getChildAt getChildIndex loadTexture overlap removeChild removeChildAt removeChildren removeStageReference reset resetFrame revive setChildIndex setFrame setScaleMinMax setTexture swapChildren update updateCache updateCrop".split(" "); 
  var groupProps = "cameraOffset children classType cursor enableBody enableBodyDebug exists fixedToCamera ignoreDestroy physicsBodyType add addAll addAt addChild addChildAt addMultiple bringToTop callAll callAllExists checkAll checkProperty countDead countLiving create createMultiple customSort destroy divideAll filter forEach forEachAlive forEachDead forEachExists getAt getBottom getBounds getChildAt getChildIndex getFirstAlive getFirstDead getFirstExists getIndex getLocalBounds getRandom getTop hasProperty iterate moveDown moveUp multiplyAll next previous remove removeAll removeBetween removeChild removeChildAt removeChildren removeStageReference replace resetCursor reverse sendToBack set setAll setAllChildren setChildIndex setProperty sort subAll swap swapChildren xy".split(" ");
  var particleProps="alive alphaData anchor angle angularDrag area autoAlpha autoScale bounce buttonMode emitX emitY frequency gravity height hitAreaignoreDestroy lifespan maxParticleAlpha maxParticles maxParticleScale maxParticleSpeed maxRotation minParticleAlpha minParticleScale minParticleSpeed minRotation name on particleAnchor particleBringToTop particleClass particleDrag particleSendToBack scaleData width worldVisible at emitParticle explode flow kill makeParticles revive setAlpha setRotation setScale setSize setXSpeed setYSpeedstart".split(" ");
  var ARCADEbodyProps = "acceleration allowGravity allowRotation angularAcceleration angularDrag angularVelocity blocked bounce center checkCollision collideWorldBounds customSeparateX customSeparateY deltaMax drag embedded enable facing game gravity halfHeight halfWidth height immovable mass maxAngular maxVelocity moves offset overlapX overlapY position rotation skipQuadTree sprite tilePadding touching type velocity width x y checkWorldBounds deltaAbsX deltaAbsY deltaX deltaY deltaZ destroy hitTest onFloor onWall render renderBodyInfo reset setSize updateBounds".split(" ");
  var P2JSbodyProps = "allowSleep angle angularDamping angularForce angularVelocity collidesWith collideWorldBounds damping data debug debugBody dynamic fixedRotation force gravity inertia kinematic mass motionState offset onBeginContact onEndContact removeNextStep rotation sleepSpeedLimit sprite static type velocity world x y addCapsule addCircle addFixture addLine addParticle addPhaserPolygon addPlane addPolygon addRectangle addShape addToWorld adjustCenterOfMass applyDamping applyForce clearCollision clearShapes collides createBodyCallback createGroupCallback destroy getCollisionMask loadPolygon moveBackward moveDown moveForward moveLeft moveRight moveUp removeFromWorld removeShape reset reverse rotateLeft rotateRight setCircle setCollisionGroup setMaterial setRectangle setRectangleFromSprite setZeroDamping setZeroForce setZeroRotation setZeroVelocity shapeChanged thrust toLocalFrame toWorldFrame updateCollisionMask".split(" ");
  var audioProps = "allowMultiple autoplay context currentMarker currentTime duration durationMS externalNode gainNode isPlaying key loop markers masterGainNode mute name override paused pausedPosition pausedTime position startTime stopTime totalDuration usingAudioTag volume addMarker destroy fadeIn fadeOut fadeTo pause play removeMarker restart resume stop".split(" ");
  var cameraProps = "atLimit bounds deadzone height id position roundPx scale target view visible width world x y checkWorldBounds focusOn focusOnXY follow reset setBoundsToWorld setPosition setSize unfollow update".split(" ");
  var tilemapProps = "collideIndexes collision currentLayer debugMap format game height heightInPixels images key layer layers objects orientation properties tileHeight tiles tilesets tileWidth version width widthInPixels addTilesetImage copy create createBlankLayer createFromObjects createFromTiles createLayer destroy dump fill forEach getImageIndex getLayerIndex getObjectIndex getTile getTileAbove getTileBelow getTileLeft getTileRight getTilesetIndex getTileWorldXY hasTile paste putTile putTileWorldXY random removeAllLayers removeTile removeTileWorldXY replace searchTileIndex setCollision setCollisionBetween setCollisionByExclusion setLayer setPreventRecalculate setTileIndexCallback setTileLocationCallback setTileSize shuffle swap".split(" ");
  var textProps = "align colors destroyPhase events fill fixedToCamera font fontSize fontWeight input inputEnabled lineSpacing shader shadowBlur shadowColor shadowOffsetX shadowOffsetY stroke strokeThickness text texture tint wordWrap wordWrapWidth addColor clearColors setShadow setStyle setText setTexture".split(" ");
  var tilespriteProps = "tilePosition tileScale tileScaleOffset autoScroll generateTilingTexture stopScroll".split(" ");
  var curstateProps = "objects game".split(" ");
  var gameProps = "add antialias cache camera canvas config context debug device forceSingleUpdate fpsProblemNotifier input load lockRender make math net onBlur onFocus onPause onResume parent particles paused physics physicsConfig preserveDrawingBuffer rnd scale sound stage state time transparent tweens world destroy disableStep enableStep gamePaused gameResumed step".split(" ");
  var statemanageProps="current add start checkState clearCurrentState destroy pause pauseUpdate preRender preUpdate remove restart resume".split(" ");
  //var objectsProps = "x y height width".split(" ");
  
  function getCompletions(token, context, keywords, options) {
    var found = [], start = token.string;
    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str)) found.push(str);
    }
    function gatherCompletions(obj) {
		switch(obj){
		case 'this':
			forEach(curstateProps, maybeAdd);break;
		case 'game':
			forEach(gameProps, maybeAdd);break;
		case 'game-state':
			forEach(statemanageProps, maybeAdd);break;
		case 'image':
		case 'sprite':
		case 'animate':
			forEach(displayobjectProps, maybeAdd);
			forEach(spriteProps, maybeAdd);
			break;
		case 'tilesprite':
			forEach(displayobjectProps, maybeAdd);
			forEach(spriteProps, maybeAdd);
			forEach(tilespriteProps, maybeAdd);
			break;
		case 'particle':
			forEach(particleProps, maybeAdd);
			forEach(groupProps, maybeAdd);
			break;
		case 'audio':
			forEach(audioProps, maybeAdd);break;
		case 'camera':
			forEach(cameraProps, maybeAdd);break;
		case 'tilemap':
			forEach(tilemapProps, maybeAdd);break;
		case 'text':
			forEach(textProps, maybeAdd);
			forEach(displayobjectProps, maybeAdd);
			break;
		case 'group':
			forEach(groupProps, maybeAdd);break;
		case 'ARCADE-body':
			forEach(ARCADEbodyProps, maybeAdd);break;
		case 'P2JS-body':
			forEach(P2JSbodyProps, maybeAdd);break;
		default:break;
		}
      //for (var name in obj) maybeAdd(name);
    }
	if(context.length==1){
		gatherCompletions(context[0].string);
	}else if(context.length==2){
		//gatherCompletions(context[1].string);
		if(context[1].string=='this'&&context[0].string=='objects')
			for(n in window['edt'].node.nodes)
				found.push(n);
		else
			gatherCompletions(context[1].string+'-'+context[0].string);
	}else if(context.length==3){
		gatherCompletions(window['edt'].node.nodes[context[0].string].type);
		//forEach(keywords, maybeAdd);
	}else if(context.length==4){
		if(context[0].string=='body'){
			gatherCompletions(window['edt'].game.physics+'-'+context[0].string);
		}else{
			gatherCompletions(context[0].string);
		}
	}
    return found;
  }
});
