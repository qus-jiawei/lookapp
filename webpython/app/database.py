#!/usr/bin/env python
# coding=utf8

import config
import sqlite3

class database:
    def __init__(self,path=config.sqlitepath):
        self.conn = sqlite3.connect(config.sqlitepath) 
        cursor = self.conn.cursor()
        #初始化
        cursor.execute('''CREATE TABLE IF NOT EXISTS result (name text, time int)''');
        
    def getCursor(self):
        return self.conn.cursor();
    
    def commit(self):
        self.conn.commit();
        
    def close(self):
        self.conn.close();

if __name__ == '__main__':
    db = database();
    

