import os

import pymysql  # type: ignore

# Test class for connecting to mysql database

mysql_user = os.getenv("MYSQL_USER", "")
mysql_password = os.getenv("MYSQL_PASSWORD", "")
mysql_host = os.getenv("MYSQL_HOST", "")

# Connect to the database
connection = pymysql.connect(
    host=mysql_host,
    user=mysql_user,
    password=mysql_password,
    database="main",
    port=3306,
    cursorclass=pymysql.cursors.DictCursor,
)

cursor = connection.cursor()
# Create a new record
# sql = "CREATE TABLE `users` (email varchar(255), password varchar(255));"
# cursor.execute(sql)
sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
cursor.execute(sql, ("webmaster@python.org", "very-secret"))

# connection is not autocommit by default. So you must commit to save
# your changes.
connection.commit()
