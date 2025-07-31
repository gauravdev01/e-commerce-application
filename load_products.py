import sqlite3
import pandas as pd
df= pd.read_csv("products.csv")
conn= sqlite3.connect("ecommerce.db")
cursor= conn.cursor()
df.to_sql('products', conn, if_exists='replace', index=False)
cursor= conn.cursor()
for row in cursor.execute("SELECT * FROM products LIMIT 5"):
    print(row)
cursor.execute("SELECT DISTINCT category FROM products")
for row in cursor.fetchall():
    print(row)
cursor.execute("SELECT COUNT(*) FROM products")
print("Total products: ", cursor.fetchone()[0])
conn.commit()
conn.close()