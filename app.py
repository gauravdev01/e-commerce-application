from flask import Flask, jsonify,request
import sqlite3

app= Flask(__name__)
DATABASE= 'ecommerce.db'

def get_db_connection():
    conn= sqlite3.connect(DATABASE)
    conn.row_factory= sqlite3.Row
    return conn
@app.route('/api/products', methods = ['GET'])
def get_products():
    page= int(request.args.get('page', 1))
    limit= int(request.args.get('limit', 10))
    offset= (page - 1) * limit

    conn= get_db_connection()
    cursor= conn.execute('SELECT * FROM products LIMIT ? OFFSET ?', (limit, offset))
    products= [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(products), 200

@app.route('/api/products/<int:product_id>', methods = ['GET'])
def get_product(product_id):
    conn= get_db_connection()
    cursor= conn.execute('SELECT * FROM products WHERE id= ?', (product_id, ))
    row= cursor.fetchone()
    conn.close()

    if row:
        return jsonify(dict(row)), 200
    else:
        return jsonify({'error': 'Product not found'}), 404

if __name__ =='__main__':
    app.run(debug=True)