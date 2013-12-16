本程序是针对yarn的一个监控系统。

初次运行bin/setup.sh，会自动下载python的相关运行库。

复制src/conf/config_example.py到src/conf/config.py，并修改相关配置

程序默认使用sqlite数据库，使用其它数据库请修改src/db/database.py的getEnerge
运行以下命令初始化数据库
sh bin/initdb.sh

运行以下命令启动web服务
sh bin/start.sh 

默认是59999端口




如果遇到以下错误，请设置环境变量export GIT_SSL_NO_VERIFY=1

    error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed while accessing https://github.com/qus-jiawei/yarn_monitor/info/refs?service=git-upload-pack
