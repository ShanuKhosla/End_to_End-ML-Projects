from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json
from sklearn.datasets import fetch_openml

app = Flask(__name__)
CORS(app)

# Load saved artifacts
model = joblib.load('../housing_model.pkl')
scaler = joblib.load('../housing_scaler.pkl')

with open('../feature_cols.json') as f:
    feature_cols = json.load(f)

with open('../cat_info.json') as f:
    cat_info = json.load(f)

# Load dataset once to get medians/modes for defaults
print("Loading dataset for defaults...")
ames = fetch_openml(name='house_prices', as_frame=True)
df_ref = ames.frame.drop(columns=['Id'], errors='ignore')

# Compute defaults
num_defaults = df_ref.select_dtypes(include=[np.number]).median().to_dict()
cat_defaults = {col: df_ref[col].mode()[0] for col in df_ref.select_dtypes(include=['object', 'category']).columns}

print("Ready!")

def build_input(user_data):
    # Start with reference dataframe defaults (one row)
    row = {}
    
    # Fill numeric defaults
    for col, val in num_defaults.items():
        row[col] = val
    
    # Fill categorical defaults    
    for col, val in cat_defaults.items():
        row[col] = val
    
    # Override with user provided values
    for key, val in user_data.items():
        row[key] = val

    # Remove target if present
    row.pop('SalePrice', None)

    # Convert to dataframe
    input_df = pd.DataFrame([row])

    # One hot encode — match training columns exactly
    cat_cols_present = [c for c in cat_info.keys() if c in input_df.columns]
    input_df = pd.get_dummies(input_df, columns=cat_cols_present, drop_first=True)

    # Add missing columns with 0
    for col in feature_cols:
        if col not in input_df.columns:
            input_df[col] = 0

    # Reorder to match training
    input_df = input_df[feature_cols]

    return input_df.values

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    features = build_input(data)
    features_scaled = scaler.transform(features)

    log_pred = model.predict(features_scaled)[0]
    price = np.expm1(log_pred)

    return jsonify({
        'predicted_price': f"${price:,.0f}",
        'predicted_price_raw': round(float(price), 2)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)