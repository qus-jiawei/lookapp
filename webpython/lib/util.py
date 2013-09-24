#!python
# coding=utf8

import logging
import urllib2
from lib import config

logger = logging.getLogger("main")
    
def jobidToAppid(jobid):
        return "application" + jobid[3:]
    
def appidToJobid(appid):
    return "job" + appid[11:]

def getHttp(url):
    try:
        req = urllib2.Request(url)
        response = urllib2.urlopen(req , timeout = 10)
        html = response.read()
        return html
    except:
        # print "get exception while getting "+url;
        logger.exception("get http error:"+url)
    return None

#转化为10为的长度,且转化为开头的整10分钟
def getIntervalTime(time):
    if time > 1000000000000L:
        time /= 1000
    return (int(time)/config.collect_interval)*config.collect_interval
    
#转化为10为的长度,且转化为开头的整10分钟
def getSecondTime(time):
    if time > 1000000000000L:
        time /= 1000
    return time

if __name__ == "__main__":
    appid = jobidToAppid("job_1378260371176_276610")   
    jobid = appidToJobid(appid)   
    print appid
    print jobid