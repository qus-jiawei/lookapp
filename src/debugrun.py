#!flask/bin/python 
from app import app
from conf import config

app.run(host="0.0.0.0",port = config.listen_port,debug = True)

