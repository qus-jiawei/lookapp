本程序是针对yarn的一个监控系统。

初次运行bin/setup.sh，会自动下载python的相关运行库。

复制src/conf/config_example.py到src/conf/config.py，并修改相关配置

程序默认使用sqlite数据库，使用其它数据库请修改src/db/database.py的getEnerge

运行以下命令启动web服务
bin/start.sh 

默认是59999端口




