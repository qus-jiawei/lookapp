#!/bin/bash
ps aux|grep python|grep productrun|grep -v grep|awk '{print $2}'|xargs kill