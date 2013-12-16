#!/bin/bash
BIN=$(cd $(dirname $0);pwd)
ROOT=$(dirname $BIN);
sh $ROOT/bin/stop.sh
sh $ROOT/bin/start.sh
