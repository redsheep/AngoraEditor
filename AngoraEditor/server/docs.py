import json
import sqlite3

def search(cls,args):
    #print 'search for',cls,args
    clsargs=''
    if(cls!='ALL'):
        clsargs='class="Phaser.%s" COLLATE NOCASE and '%cls
    sqlcmd='''select * from method where {0}
                (name like '%{1}%' or help like '% {1} %') '''.format(clsargs,args)
    print sqlcmd
    cx = sqlite3.connect("docs.db")
    cur = cx.execute(sqlcmd)
    rows=cur.fetchall()
    cx.close()
    result=[]
    for row in rows:
        #row[4]=row[4].replace('\n','<br/>');
        result.append({'name':row[0],'visible':row[1],'class':row[2],'parameters':row[3],'help':row[4],'return':row[5]})
    #for row in result:
    #    print row['name'],','.join([r.split(':')[0] for r in row['parameters'].split('@')]),row['help']
    return json.dumps(result)

def getparameters(parameters):
    args=[]
    for m in parameters:
        args.append("%s:%s:%s:%s"%(m['name'],'|'.join(m['type']),m['help'],m['optional']))
    return '@'.join(args)
def addtodocs(filename):
    json_file = open(filename)
    json_str = json_file.read()
    json_data = json.loads(json_str)
    cls = json_data['class']['name']
    cx = sqlite3.connect("docs.db")
    for m in json_data['methods']:
        for t in json_data['methods'][m]:
            returns=t['returns']
            if(not(returns is None)):
                returns='|'.join(returns)
            data = (t['name'],m,cls,getparameters(t['parameters']),t['help'],returns)
            cx.execute("insert into Method values (?,?,?,?,?,?)", data)
    for m in json_data['properties']:
        for t in json_data['properties'][m]:
            data = (t['name'],m,''.join(t['type']),cls,t['readOnly'],t['inlineHelp'])
            cx.execute("insert into Property values (?,?,?,?,?,?)", data)
    cx.commit()
    cx.close()
    json_file.close()

def importdocs():
    import glob
    files = glob.glob("output/Phaser.*.json")
    for f in files:
        print f;
        addtodocs(f);
#importdocs()
#search('Sprite','play')

