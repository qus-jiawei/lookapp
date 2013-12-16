#!/bin/bash

#请将本脚本加入到crontab中，每10分钟启动一次
#*/10 * * * * sh xx/xx/xx/bin/collect.sh
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
mkdir -p $ROOT/logs
cd $ROOT/src
$ROOT/flask/bin/python collect.py  >>  $ROOT/logs/collect.log 