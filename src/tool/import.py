import pymysql
import json
from mo2json import importPackageByName
# 打开数据库连接
db = pymysql.connect(host='localhost',
                     user='root',
                     password='123456',
                     database='webmodelica')
name = 'Modelica.Electrical.Analog.Basic'
ans = importPackageByName(name)
print("[IMPORT] HAS GET!")
#使用 cursor() 方法创建一个游标对象 cursor
cursor = db.cursor()
# ans = [{"a":2},{"b":3}]
#SQL 插入语句
sql = "INSERT INTO PACKAGE(NAME,annotation,tree_info,model_info) VALUES ('%s','%s','%s','%s');"%(name,name+' TEST',json.dumps(ans[0]),json.dumps(ans[1]))
print(sql)
try:
   # 执行sql语句
   cursor.execute(sql)
   # 提交到数据库执行
   db.commit()
   print("[IMPORT] OK!")
except:
   # 如果发生错误则回滚
   db.rollback()
print("[IMPORT] FINISH!")
# 关闭数据库连接
db.close()
