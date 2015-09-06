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
AngoraEditor.PhaserTemplate = function (Data) {
  this.Data=Data;
  this.templatePath="/template/phaser";
}

AngoraEditor.PhaserTemplate.prototype = {
  createTemplate:function(project,finished){
    var self=this;
    self.copyLibarary(project);
    self.createStartUpApp(project,function(){
      self.createDefaultAssets(project,finished);
    });
  },
  createStartUpApp:function(project,finished){
    var self=this;
    var path=project.path;
    var HTMLContent='\
    <!doctype html>\n\
    <html>\n\
        <head>\n\
            <meta charset="UTF-8" />\n\
            <title>{0}</title>\n\
            <script src="phaser.min.js"></script>\n\
            <script type="text/javascript" src="createscene.js"> </script>\n\
            <script type="text/javascript" src="mygame.js"> </script>\n\
        </head>\n\
        <body>\n\
        </body>\n\
    </html>\n'.format(project.name);
    self.readTemplateFile('/mygame.js',function(JSContetnt){
      JSContetnt=JSContetnt.replace(/{preojctpath}/g, path);
      self.Data.system.File.writeFile(path+'/mygame.html',HTMLContent,function(){
        self.Data.system.File.writeFile(path+'/mygame.js',JSContetnt,function(){
          self.Data.system.File.writeFile(path+'/scenes.json','{}',finished);
        });
      });
    });
  },
  createDefaultAssets:function(project,finished){
    var self=this;
    self.Data.system.File.createDirectory(project.path+'/data',function(){
      self.Data.system.File.writeFile(project.path+'/global.res','{}',finished);
    });
  },
  copyLibarary:function(project,finished){
    var path=project.path;
    this.Data.system.File.copyFile(path,this.templatePath+'/phaser.min.js','phaser.min.js');
    this.Data.system.File.copyFile(path,this.templatePath+'/createscene.js','createscene.js');
  },
  readTemplateFile:function(filename,finished){
    this.Data.system.File.readFile(this.templatePath+filename,finished);
  },
  createScene:function(path,scene,finished){
    var self=this;
    self.readTemplateFile('/scene.js',function(sceneJS){
      sceneJS = sceneJS.replace(/{sceneName}/g, scene);
      self.readTemplateFile('/scene.script.js',function(sceneScript){
        sceneScript = sceneScript.replace(/{sceneName}/g, scene);
        self.Data.system.File.writeFile(path+'/{0}.js'.format(scene),sceneJS,function(){
          self.Data.system.File.writeFile(path+'/{0}.script.js'.format(scene),sceneScript,finished);
        });
      });
    });
  },
  createCustomClass:function(cls,finished){
    var self=this;
    var path=this.Data.project.path;
    self.readTemplateFile('customclass.js',function(JSContetnt){
      self.Data.system.File.writeFile(path+'/customclass.js',JSContetnt,finished);
    });
  }
}
AngoraEditor.PhaserTemplate.prototype.constructor = AngoraEditor.PhaserTemplate;
