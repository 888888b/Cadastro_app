
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
from datetime import datetime
from waitress import serve

app = Flask(__name__)
CORS(app)

@app.route('/user', methods=['POST'])

def user():
    data = request.get_json()
    if 'email' not in data or 'created' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    email = data['email']
    date = data['created']

    format = "%a, %d %b %Y %H:%M:%S GMT"
    created = datetime.strptime(date, format)

    conectConfig = (
        "Driver={SQL Server};"
        "Server=WILSON\\SQLEXPRESS;"
        "Database=Users;"
    )

    conect = pyodbc.connect(conectConfig)
    cursor = conect.cursor()

    cursor.execute("SELECT COUNT(*) FROM accounts WHERE email =?", (email,))
    result = cursor.fetchone()
    if result[0] > 0:
        return jsonify({"error": "Email already exists"}), 400

    comand = f"""
        INSERT INTO accounts(email, created)
        VALUES(
            '{email}',
            '{created}'
        );
    """

    try:
        cursor.execute(comand)
        conect.commit()
        return jsonify({"Usuario": 'cadastrado'}), 200
    
    except Exception as e:
        conect.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/usersData', methods=['GET'])
def userDate():

    conectConfig = (
        "Driver={SQL Server};"
        "Server=WILSON\\SQLEXPRESS;"
        "Database=Users;"
    )

    conect = pyodbc.connect(conectConfig)

    cursor = conect.cursor()

    comand = 'SELECT * FROM accounts'


    try:
        cursor.execute(comand)
        rows = cursor.fetchall()
        results = []
        for row in rows:
            result = {}
            for idx, column in enumerate(cursor.description):
                result[column[0]] = row[idx]
            results.append(result)
            
        return jsonify({"Dados": results}), 200
    
    except Exception as e:
        conect.rollback()
        return jsonify({"error": str(e)}), 500

mode = 'production'

if __name__ == '__main__':
    if mode == 'dev':
        app.run(host='0.0.0.0', port=8080, debug=True)
    else:
        serve(app, host='0.0.0.0', port=50100, threads=1)
