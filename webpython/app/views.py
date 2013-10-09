#!/usr/bin/env python
# coding=utf8
import json

from flask import render_template
from flask import request
from flask import Markup
from app import app
from db import database
from db import applicationRecord
from lib import util
from lib import config
from lib import log
# import data
import data
import time

log.initLogger('views.log')


@app.route('/index') 
@app.route('/lookapp') 
def index():
    now = time.localtime();
    today = '%04d%02d%02d' % (now[0], now[1] ,now[2]) 
    date = request.args.get("date",today)
    start = request.args.get("start",0,int)
    end = request.args.get("end",start,int)
    type = request.args.get("type","app",str)
    top = request.args.get("top", 10 ,int)

    #if end >= start +2 : 
    #    end = start +1
    if 0 <= start and start <= end and end <= 24 :
        try:
            (xaxis,series,appseries) = data.node_container_data(type,date,start,end,top)
        except Exception,data:
            return "ERROR with exception while getting data "
        return gethtml(xaxis,series,appseries,type,today,start,end,top)
    else :
        return "ERROR with start=" + str(start) +" end="+ str(end)
    
def gethtml(xaxis,series,appseries,type,date,start,end,top):
    if start == 0 :
        pre_start = 0;
    else :
        pre_start = start - 1;

    if start == 23 :
        next_start = 23;
    else :
        next_start = start + 1;

    return render_template("look.html",
            debug = Markup("debug info here"),
            date = date,
            start = start,
            pre_start = pre_start,
            next_start = next_start,
            end = end,
            top = top,
            type = type,
            xaxis = Markup(json.dumps(xaxis)),
            series = Markup(json.dumps(series)),
            series2 = Markup(json.dumps(appseries)),
            )
    
@app.route('/') 
@app.route('/yarn') 
def yarn():
    return render_template("yarn.html")

@app.route('/db/appList')
def dbapplist():
    offset = getRequestInt("offset",0)
    limit = getRequestInt("limit",50)
    where = getRequestParam("where","1")
    orderby = getRequestParam("orderby","appid desc")
    cursor = database.getCursor()
    selectKeyArray=["appid","user","name","queue","startedTime","finishedTime","state","finalStatus",
               "attemptNumber","mapsTotal","mapsCompleted","localMap","reducesTotal","reducesCompleted",
               "fileRead","fileWrite","hdfsRead","hdfsWrite"]
    selectKey = ",".join(selectKeyArray)
    sql = ("select "+selectKey+" from app where %s order by %s LIMIT %d OFFSET %d " % (where,orderby,limit,offset))
    print sql
#     return sql
    cursor.execute(sql)
    queryResult = cursor.fetchall()
    retult={"applist":queryResult,"rmhost":config.rmhost,"rmport":config.rmport}
    return json.dumps(retult)

@app.route('/db/appSum')
def dbappsum():
    where = getRequestParam("where","1")
    cursor = database.getCursor()
    sumKey=["mapsTotal","mapsCompleted","successfulMapAttempts","killedMapAttempts","failedMapAttempts",
            "localMap","rackMap",
            "reducesTotal","reducesCompleted","successfulReduceAttempts","killedReduceAttempts",
            "failedReduceAttempts",
            "fileRead","fileWrite","hdfsRead","hdfsWrite"]
    select = "count(appid) as appidCount"
    for key in sumKey:
        select = select +" , sum("+key+") as "+key+"Sum "
    sql = (("select "+select+" from app where %s order by appid ") % (where))
    cursor.execute(sql)
    sumRecord = cursor.fetchone()
    col_name_list = [tuple[0] for tuple in cursor.description]
    resultRecord = {}
    for i in range(len(col_name_list)):
        resultRecord[col_name_list[i]] = sumRecord[i]
    retult={"resultRecord":resultRecord}
    return json.dumps(retult)

@app.route('/db/appRunning')
def dbapprunning():
    url = ("http://%s:%s/ws/v1/cluster/apps?state=RUNNING" %(config.rmhost,config.rmport))
    runningApp = util.getHttpJson(url)
    queues = {}
    for app in runningApp["apps"]["app"]:
        queue = app["queue"]
        appid = app['id']
        if not queues.has_key(queue):
            queues[queue] = {}
        queues[queue][appid]=app
    retult={"queues":queues,"rmhost":config.rmhost,"rmport":config.rmport}
    return json.dumps(retult)

@app.route('/db/appProxy')
def dbappproxy():
    appid = getRequestParam("appid","")
    url = ("http://%s:%s/proxy/%s/ws/v1/mapreduce/jobs/" %(config.rmhost,config.rmport,appid))
    jobInfo = util.getHttpJson(url)
    keyList = ["mapsTotal","mapsPending","mapsRunning","failedMapAttempts","killedMapAttempts","successfulMapAttempts",
               "reducesTotal","reducesPending","reducesRunning","failedReduceAttempts","killedReduceAttempts","successfulReduceAttempts"]
    if jobInfo:
        result = {}
        temp = jobInfo["jobs"]["job"][0]
        result["amTime"] = temp["elapsedTime"]
        for key in keyList:
            result[key] = temp[key]
        return json.dumps(result)
    else:
        result = {}
        result["amTime"] ="x"
        for key in keyList:
            result[key] = "x"
        return json.dumps(result)
    
def getRequestParam(key,default):
    temp = request.args.get(key)
    if temp == None or len(temp)==0:
        return default
    else:
        return temp.replace("o|o","%")
    
def getRequestInt(key,default):
    return int(getRequestParam(key,default))


