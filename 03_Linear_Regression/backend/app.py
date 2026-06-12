from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model weights and scaler
model_data = joblib.load('../housing_model.pkl')
scaler = joblib.load('../housing_scaler.pkl')

w = model_data['w']
b = model_data['b']


def predict_price(features):
    # Scale the input using the saved scaler
    features_scaled = scaler.transform([features])
    # Forward pass — same equation as your numpy model
    prediction = features_scaled @ w + b
    return float(prediction[0])


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    features = [
        data['MedInc'],
        data['HouseAge'],
        data['AveRooms'],
        data['AveBedrms'],
        data['Population'],
        data['AveOccup'],
        data['Latitude'],
        data['Longitude']
    ]

    price = predict_price(features)
    # Clip at 0 — linear regression can predict negative prices
    price = max(0, price)

    return jsonify({
        'predicted_price': round(price, 4),
        'predicted_price_usd': f"${price * 100_000:,.0f}"
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
