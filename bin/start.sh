#!/bin/bash
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
mkdir -p $ROOT/logs
cd $ROOT/src
nohup $ROOT/flask/bin/python yarn_monitor.py  >>  $ROOT/logs/web.log  &
