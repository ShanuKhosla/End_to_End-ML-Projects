from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json

app = Flask(__name__)
CORS(app)

model = joblib.load('../titanic_model.pkl')
scaler = joblib.load('../titanic_scaler.pkl')

with open('../feature_cols.json') as f:
    feature_cols = json.load(f)

def build_features(data):
    # Sex encoding
    sex = 1 if data['sex'] == 'female' else 0
    
    # Title encoding
    title = data['title']
    title_miss = 1 if title == 'Miss' else 0
    title_mr   = 1 if title == 'Mr' else 0
    title_mrs  = 1 if title == 'Mrs' else 0
    title_rare = 1 if title == 'Rare' else 0
    
    # Embarked encoding
    embarked = data['embarked']
    embarked_q = 1 if embarked == 'Q' else 0
    embarked_s = 1 if embarked == 'S' else 0
    
    # Family features
    family_size = data['sibsp'] + data['parch'] + 1
    is_alone = 1 if family_size == 1 else 0
    
    # Fare log transform
    fare_log = np.log1p(data['fare'])
    
    features = {
        'Pclass':     data['pclass'],
        'Sex':        sex,
        'Age':        data['age'],
        'FamilySize': family_size,
        'IsAlone':    is_alone,
        'Fare_log':   fare_log,
        'Title_Miss': title_miss,
        'Title_Mr':   title_mr,
        'Title_Mrs':  title_mrs,
        'Title_Rare': title_rare,
        'Embarked_Q': embarked_q,
        'Embarked_S': embarked_s,
    }
    
    # Return in exact column order
    return [features[col] for col in feature_cols]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    features = build_features(data)
    features_scaled = scaler.transform([features])
    
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][1]
    
    return jsonify({
        'survived': int(prediction),
        'survival_probability': round(float(probability) * 100, 1),
        'verdict': 'Survived 🎉' if prediction == 1 else 'Did not survive 💀'
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)