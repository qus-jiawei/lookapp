#!/bin/bash
echo "killing" `ps aux|grep python|grep yarn_monitor|grep -v grep|awk '{print $2}'`
ps aux|grep python|grep yarn_monitor|grep -v grep|awk '{print $2}'|xargs kill
