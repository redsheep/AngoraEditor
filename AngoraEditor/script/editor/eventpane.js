/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 * AngoraEditor.EventPaneManager constructor
 *
 * Instantiate <code>AngoraEditor.EventPaneManager</code> object.
 * @class AngoraEditor.EventPaneManager
 * @classdesc
 * @constructor
 */
AngoraEditor.EventPaneManager = function (editor) {
	/**
	 * @property {AngoraEditor} - reference of editor
	 */
	this.editor = editor;
	/**
	 * @property {Array} - events of selected node
	 */	
	this.events=[];
	
	this.setup();
}
AngoraEditor.EventPaneManager.prototype = {
	/**
	* setup the property grid from DOM
	* @method setup
	* @param 
	*/	
	setup: function(){
		var editor=this.editor;
		this.pane=$('#events').propertygrid({
			data : this.events,
			showGroup : true,
			scrollbarSize : 0,
			onDblClickRow:function(index, field){
				var name = field['name'];
				var value = field['value'];
				if(value!=''){
					return;
				}else{
					if(editor.node.selected != null && typeof editor.node.selected !='undefined'){
						functionName='{0}_{1}'.format(editor.node.selected.id,name);
						editor.ui.codeEditor.replaceRange("\n{0}.prototype.{1} = function(){\n}\n".format(editor.scene.curScene,functionName), {line: Infinity});
						editor.ui.eventPane.update(index,functionName);
						editor.attr.addEvent(editor.node.selected,name,functionName);
					}else{
						functionName='{0}_{1}'.format('game',name);
						editor.ui.codeEditor.replaceRange("\n{0}.prototype.{1} = function(){\n}\n".format(editor.scene.curScene,functionName), {line: Infinity});
						editor.ui.eventPane.update(index,functionName);
						editor.scene.addEvent(name,functionName);
					}
				}
			}
		});
	},
	/**
	* setup the property grid of selected node
	* @method loadData
	* @param {Object} node
	*/	
	loadData: function(node){
		this.events=[];
		var events={};
		if(node == null)
			return ;
		if(typeof node.type !='undefined'){
			if(node.type=='image'||node.type=='sprite'
				||node.type=='button'||node.type=='animation'){
				events={
					onInputUp:'',
					onInputDown:'',
					onInputOver:'',
					onInputOut:'',
					onEnterBounds:'',
					onOutOfBounds:'',
					onDestroy:'',
					onKilled:'',
					onAddedToGroup:'',
					onRemovedFromGroup:''
				}
			}
			if(node.type == 'animation'){
				events['onAnimationStart:']='';
				events['onAnimationLoop']='';
				events['onAnimationComplete']='';
			}
			if(node.type == 'timer'){
				events['callback']='';
			}
		}
		var nodeEvents=node['events'];
		if(typeof nodeEvents==='undefined')
			nodeEvents=node['input'];
		if(typeof nodeEvents!='undefined'){
			for(e in nodeEvents){
				events[e]=nodeEvents[e];
			}
		}
		for(e in events){
			this.add(e,events[e]);
		}
		this.pane.propertygrid('loadData',this.events);
	},
	/**
	* add a event to the event property grid
	* @method add 
	* @param {string} event - event name
	* @param {string} callback - callback name
	* @param {string} grp - group name
	*/
	add: function(event,callback,grp){
		var group=grp;
		if(typeof group ==='undefined')
			group='default';
		var type='none';
		switch(event){
		case 'onInputUp':
		case 'onInputDown':
		case 'onInputOver':
		case 'onInputOut':
			group='mouse'
			break;
		case 'onOutOfBounds':
		case 'onEnterBounds':
			group='worldBounds';
			break;
		case 'onAnimationComplete':
		case 'onAnimationLoop':
		case 'onAnimationStart':
			group='animation';
			break;
		default:group=group;break;
		}
		this.events.push({name:event,value:callback,group:group,editor:type});
	},
	/**
	* update the selected row of event property grid
	* @method update
	* @param {number} index - selected row
	* @param {string} value - callback name
	*/
	update: function(index, value){
		this.pane.propertygrid('updateRow',{
			index: index,
			row: { value : value }
		});
	},
	/**
	* remove the value of selected row from event property grid
	* @method remove
	* @param {number} index - selected row
	*/	
	remove: function(index){
		this.pane.propertygrid('updateRow',{
			index: index,
			row:{ value : '' }
		});
	},
	/**
	* empty the event property grid
	* @method reset
	* @param 
	*/
	reset: function(){
		this.events=[];
		this.pane.propertygrid('loadData', []);
	}
}

AngoraEditor.EventPaneManager.prototype.constructor = AngoraEditor.EventPaneManager;