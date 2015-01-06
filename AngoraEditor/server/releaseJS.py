from jsmin import jsmin
import json
import shutil
import os

def getreleaseJS(scene):
    with open('../template/scene_release.js', 'r') as releasejs:
        content = releasejs.read()
        content = content.replace('{sceneName}',scene)
        return content

def mergefile(filepath,scene): 
    filenames = [scene+'.res',scene+'.scn',scene+'.config']
    with open(filepath+'release/'+scene+'.js', 'w') as outfile:
        for fname in filenames:
            obj=fname.replace('.','_')
            with open(filepath+fname) as infile:
                outfile.write('var '+obj+'=')
                outfile.write(infile.read())
                outfile.write('\n');
        outfile.write(getreleaseJS(scene))
        outfile.write('\n')
        with open(filepath+scene+'.script.js', 'r') as infile:
            outfile.write(infile.read())
            outfile.write('\n');

def compress(jsfile):
    with open(jsfile,'r') as infile:
        minified = jsmin(infile.read())
    with open(jsfile,'w') as outfile:
        outfile.write(minified)

def releaseProject(filepath):
    if not os.path.exists(filepath+'release') :
        os.mkdir(filepath+'release')
    with open(filepath+'scenes.json','r') as infile:
        scenes = json.load(infile)
        for scene in scenes:
            mergefile(filepath,scene)
            compress(filepath+'release/'+scene+'.js')
        shutil.copy2(filepath+'mygame.js',filepath+'release/mygame.js')
        compress(filepath+'release/mygame.js')
        shutil.copy2(filepath+'createscene.js',filepath+'release/createscene.js')
        compress(filepath+'release/createscene.js')
        shutil.copy2(filepath+'phaser.min.js',filepath+'release/phaser.min.js')
        shutil.copy2(filepath+'mygame.html',filepath+'release/mygame.html')

