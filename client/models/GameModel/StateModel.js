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
StateModel = function (game, state) {
	this.game	= game;

	this.name	= state;

	this.resources={};

  this.nodes={};

	this.setup();

	this.selected = null;

	this.count = 0;

	return this;
}

StateModel.prototype = {
	setup:function(){
		this.getAllNodes();
	},
	getAllNodes: function(){
		var self = this;
		var path = this.game.basePath;
		System.File.readFile('{0}/{1}.scn'.format(path,this.name),
		function(data){
			var nodes = JSON.parse(data);
			for(var key in nodes){
				self.addNode(nodes[key]);
			}
		});
	},
	createNode:function(type){
		var nodeID='{0}{1}'.format(type,this.count++);
		while(nodeID in this.nodes)
			nodeID='{0}{1}'.format(type,this.count++);
		var node = {
			"id":nodeID,
			"type":type
		};
		if(type==='custom'){
			node.clsname=cls.clsname;
			node.basecls=cls.basecls;
		}
		return node;
	},
	addNode:function(node){
		if(typeof node.id==='undefined')
			node.id = this.createNode(node.type).id;
		this.nodes[node.id]=new GameNode(this);
		this.nodes[node.id].initNode(node);
		return this.nodes[node.id];
	},
	removeNode:function(nodeID){
		delete this.nodes[nodeID];
	},
	saveNode:function(){
		var nodes={};
		for(var key in this.nodes){
			var node = this.nodes[key];
			nodes[node.id]={id:node.id,type:node.type};
			for(var key in node.property){
				nodes[node.id][key]=node.property[key];
			}
		}
		System.File.writeFile(this.game.basePath+'/{0}.scn'.format(this.name),
			JSON.stringify(nodes, null, '\t'),function(){
				console.log('success save state',this.name);
		});
	},
	selectNode:function(nodeID){
		this.selected=this.nodes[nodeID];
	},
	unselect:function(){
		this.selected=null;
	},
	addResource:function(res){
		this.resources[res.id]=res;
	},
	removeResource:function(res){
		delete this.resources[res.id];
	},
	save:function(){
		this.saveNode();
	},
	clear:function(){
		this.resources={};
	  this.nodes={};
		this.selected = null;
		this.count = 0;
	}
}

StateModel.prototype.constructor = StateModel;
