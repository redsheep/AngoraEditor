/**
 * @author RedSheep <redsheep@foxmail.com>
 * @copyright
 * @license
 */
/**
 *
 *
 *
 * @class
 * @classdesc
 * @constructor
 */
AngoraEditor.HistoryManager = function () {
  this.records=[];
  this.MAX_RECORDS=100;
  this.path;
}
AngoraEditor.HistoryManager.prototype = {
  setProject:function(project){
    this.records=[];
    this.path=project.path+'/history.log';
  },
  createLogFile:function(project){
    var path = project.path+'/history.log';
    System.File.writeFile(path,'');
  },
  addRecord:function(record){
    if(this.records.length>=this.MAX_RECORDS){
      this.records.shift();
      this.lastRecord=max(this.lastRecord-1,0);
    }
    this.records.push(record);
    this.writeToLog(record);
  },
  writeToLog:function(record){
    //for(var i=this.lastRecord;i<this.records.length;i++){
      var record_str=this.getRecordString(record);
      System.File.appendToFile(this.path,record_str);
    //}
    //this.lastRecord=records.length;
  },
  getRecordString(record){
    switch (record.type) {
      case 'add':

        break;
      default:
        break;
    }
    return '{0}:{1} {2}\n'.format(record.type,record.operate,record.target);
  },
  clear:function(){
    this.records=[];
  }
}
AngoraEditor.HistoryManager.prototype.constructor = AngoraEditor.HistoryManager;
