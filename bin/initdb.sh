#!/bin/bash
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
mkdir -p $ROOT/logs
cd $ROOT/src
$ROOT/flask/bin/python initdb.py