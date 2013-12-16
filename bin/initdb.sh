#!/bin/bash
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
cd $ROOT
mkdir -p $ROOT/logs
flask/bin/python initdb.py