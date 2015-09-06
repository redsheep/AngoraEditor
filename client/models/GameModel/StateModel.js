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
StateModel = function (Data, state, create) {

	this.Data = Data;

	this.name= state;

	this.resources={};

  this.nodes={};

	this.setup(create);

	this.selected = null;

	this.count = 0;
	return this;
}

StateModel.prototype = {
	setup: function(create){
		var self = this;
		var path = this.Data.project.path;
		this.Data.system.File.readFile('{0}/{1}.scn'.format(path,this.name),function(data){
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
	clear:function(){
		this.resources={};
	  this.nodes={};
		this.selected = null;
		this.count = 0;
	}
}

StateModel.prototype.constructor = StateModel;
