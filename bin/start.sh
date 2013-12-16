#!/bin/bash
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
cd $ROOT
mkdir -p $ROOT/logs
nohup flask/bin/python yarn_monitor.py  >>  $ROOT/logs/web.log  &