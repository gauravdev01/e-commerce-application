import sqlite3
import pandas as pd
df= pd.read_csv("products.csv")
conn= sqlite3.connect("ecommerce.db")
cursor= conn.cursor()
df.to_sql('products', conn, if_exists='replace', index=False)
cursor= conn.cursor()
for row in cursor.execute("SELECT * FROM products LIMIT 5"):
    print(row)
conn.commit()
conn.close()