#!/bin/bash

cd /home/hadoop/yarn_monitor/lookapp/webpython
nohup flask/bin/python productrun.py  >>  /home/hadoop/yarn_monitor/logs/web.log  &