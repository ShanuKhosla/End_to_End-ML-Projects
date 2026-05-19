from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('../iris_model.pkl')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    features = [
        data['sepal_length'],
        data['sepal_width'],
        data['petal_length'],
        data['petal_width']
    ]

    prediction = model.predict([features])[0]
    probabilities = model.predict_proba([features])[0]
    confidence = round(float(np.max(probabilities)) * 100, 2)

    return jsonify({
        'species': prediction,
        'confidence': confidence
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
