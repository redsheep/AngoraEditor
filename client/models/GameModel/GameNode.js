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
		this.property[key]=value;
		System.History.addRecord({type:'attr',operate:'add',target:this.id,key:key});
	},
	addEvent:function(event,callback){
		this.events[event]=callback;
		System.History.addRecord({type:'event',operate:'add',target:this.id,key:event});
	},
	setAttr:function(key,value,record){
		var oldvalue=this.property[key];
		if(typeof value === 'undefined')
			value=this.DefaultValue[key];
		this.property[key]=value;
		if(this.ref !== null)
			this.setRefAttr(key,value);
		if(record)System.History.addRecord({type:'attr',operate:'modify',
												target:this.id,key:key,from:oldvalue,to:value});
	},
	removeAttr:function(key){
		delete this.property[key];
		System.History.addRecord({type:'attr',operate:'remove',target:this.id,key:key});
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
			this.setAttr('x',node.x,false);
			this.setAttr('y',node.y,false);
			this.setAttr('width',node.width,false);
			this.setAttr('height',node.height,false);
			this.setAttr('scaleX',node.scaleX,false);
			this.setAttr('scaleY',node.scaleY,false);
			this.setAttr('anchorX',node.anchorX,false);
			this.setAttr('anchorY',node.anchorY,false);
			this.setAttr('rotation',node.rotaion,false);
		}
		if(ObjectInArray(type,this.category.assets)){
			this.setAttr('image',node.image,false);
		}
		if(ObjectInArray(type,this.category.text)){
			this.setAttr('text',node.text,false);
			this.setAttr('font',node.font,false);
			this.setAttr('fontSize',node.fontSize,false);
		}
		if(ObjectInArray(type,this.category.physics)){
			this.setAttr('physics',node.physics,false);
			this.setAttr('dynamic',node.dynamic,false);
			this.setAttr('body',node.body,false);
			this.setAttr('mass',node.mass,false);
			this.setAttr('fixedRotation',node.fixedRotation,false);
		}
		if(type === 'camera'){
			this.setAttr('follow',node.follow,false);
		}
		if(type === 'audio'){
			this.setAttr('audio',node.audio,false);
			this.setAttr('tracks',node.tracks,false);
			this.interactive=false;
		}
		if(type === 'tilemap'){
			this.setAttr('tileW',node.tileW,false);
			this.setAttr('tileH',node.tileH,false);
			this.setAttr('tilesetW',node.tilesetW,false);
			this.setAttr('tilesetH',node.tilesetH,false);
			this.setAttr('tilemap',node.tilemap,false);
		}
		if(type === 'particle'){
			this.setAttr('alpha',node.alpha,false);
			this.setAttr('rotation',node.rotaion,false);
			this.setAttr('maxParticles',node.maxParticles,false);
			this.setAttr('frequency',node.frequency,false);
			this.setAttr('lifespan',node.lifespan,false);
			this.setAttr('gravity',node.gravity,false);
			this.setAttr('minspeedX',node.minspeedX,false);
			this.setAttr('maxspeedX',node.maxspeedX,false);
			this.setAttr('minspeedY',node.minspeedY,false);
			this.setAttr('maxspeedY',node.maxspeedY,false);
		}
		if(node.events !=null) this.events=node.events;
	}
}

GameNode.prototype.constructor = GameNode;
