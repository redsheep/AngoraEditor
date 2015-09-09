/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor constructor
 *
 * Instantiate a new <code>AngoraEditor</code> object.
 * @class AngoraEditor
 * @classdesc
 * @constructor
 */
GameNode = function (state) {

	this.state 		=	state;

	this.id				=	null;

	this.type			=	null;

	this.ref			= null;

  this.property	=	{};

	this.events		= {};

	this.interactive = true;

	this.category = {
		gameObject:['sprite','image','tilesprite',
		'animate','text','bitmaptext','button','particle'],
		text:['text','bitmaptext'],
		assets:['sprite','image','tilesprite',
		'animate','button','particle'],
		physics:['sprite','animate'],
		camera:['camera'],
		audio:['audio'],
		particle:['particle'],
		invisible:['audio'],
	};
	this.DefaultValue = {
		x:0,y:0,height:32,width:32,image:'default',text:'text',
		scaleX:1,scaleY:1,maxParticles:100,lifespan:1000,frequency:50
	}

	return this;
}

GameNode.prototype = {

	addAttr:function(key,value){

	},
	addEvent:function(event,callback){
		this.events[event]=callback;
	},
	setAttr:function(key,value){
		if(typeof value === 'undefined')
			value=this.DefaultValue[key];
		this.property[key]=value;
		if(this.ref !== null)
			this.setRefAttr(key,value);
	},
	removeAttr:function(key){
		delete this.property[key];
	},
	setRefAttr:function(key,value){
		switch (key) {
			case 'image':
				this.ref.loadTexture(value);
				break;
			default:
				this.ref[key]=value;
		}
	},
	/**
	* init the node attribute
	* @method initNode
	* @param {Object} node
	*/
	initNode : function(node){
		this.id=node.id;
		this.type=node.type;
		var type=node.type;
		if(type==='custom')
			type=node.basecls.toLowerCase();
		if(ObjectInArray(type,this.category.gameObject)){
			this.setAttr('x',node.x);
			this.setAttr('y',node.y);
			this.setAttr('width',node.width);
			this.setAttr('height',node.height);
			this.setAttr('scaleX',node.scaleX);
			this.setAttr('scaleY',node.scaleY);
			this.setAttr('anchorX',node.anchorX);
			this.setAttr('anchorY',node.anchorY);
			this.setAttr('rotation',node.rotaion);
		}
		if(ObjectInArray(type,this.category.assets)){
			this.setAttr('image',node.image);
		}
		if(ObjectInArray(type,this.category.text)){
			this.setAttr('text',node.text);
			this.setAttr('font',node.font);
			this.setAttr('fontSize',node.fontSize);
		}
		if(ObjectInArray(type,this.category.physics)){
			this.setAttr('physics',node.physics);
			this.setAttr('dynamic',node.dynamic);
			this.setAttr('body',node.body);
			this.setAttr('mass',node.mass);
			this.setAttr('fixedRotation',node.fixedRotation);
		}
		if(type === 'camera'){
			this.setAttr('follow',node.follow);
		}
		if(type === 'audio'){
			this.setAttr('audio',node.audio);
			this.setAttr('tracks',node.tracks);
			this.interactive=false;
		}
		if(type === 'tilemap'){
			this.setAttr('tileW',node.tileW);
			this.setAttr('tileH',node.tileH);
			this.setAttr('tilesetW',node.tilesetW);
			this.setAttr('tilesetH',node.tilesetH);
			this.setAttr('tilemap',node.tilemap);
		}
		if(type === 'particle'){
			this.setAttr('alpha',node.alpha);
			this.setAttr('rotation',node.rotaion);
			this.setAttr('maxParticles',node.maxParticles);
			this.setAttr('frequency',node.frequency);
			this.setAttr('lifespan',node.lifespan);
			this.setAttr('gravity',node.gravity);
			this.setAttr('minspeedX',node.minspeedX);
			this.setAttr('maxspeedX',node.maxspeedX);
			this.setAttr('minspeedY',node.minspeedY);
			this.setAttr('maxspeedY',node.maxspeedY);
		}
		if(node.events !=null) this.events=node.events;
	}
}

GameNode.prototype.constructor = GameNode;
