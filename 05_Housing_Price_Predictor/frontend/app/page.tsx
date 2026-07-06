'use client';

import { useState } from 'react';

const PRESETS = [
  { label: '🏰 Luxury Home', data: { OverallQual: 9, GrLivArea: 2800, GarageCars: 3, TotalBsmtSF: 1500, YearBuilt: 2005, FullBath: 3 } },
  { label: '🏠 Average Home', data: { OverallQual: 6, GrLivArea: 1500, GarageCars: 2, TotalBsmtSF: 800, YearBuilt: 1990, FullBath: 2 } },
  { label: '🏚️ Starter Home', data: { OverallQual: 4, GrLivArea: 900, GarageCars: 1, TotalBsmtSF: 400, YearBuilt: 1970, FullBath: 1 } },
];

const FIELDS = [
  { name: 'OverallQual', label: 'Overall Quality', min: 1, max: 10, step: 1, hint: '1 = Very Poor → 10 = Excellent' },
  { name: 'GrLivArea', label: 'Living Area (sqft)', min: 300, max: 5000, step: 50, hint: 'Above ground living area' },
  { name: 'GarageCars', label: 'Garage Capacity', min: 0, max: 4, step: 1, hint: 'Number of cars garage fits' },
  { name: 'TotalBsmtSF', label: 'Basement Area (sqft)', min: 0, max: 3000, step: 50, hint: 'Total basement square footage' },
  { name: 'YearBuilt', label: 'Year Built', min: 1870, max: 2010, step: 1, hint: 'Original construction year' },
  { name: 'FullBath', label: 'Full Bathrooms', min: 0, max: 4, step: 1, hint: 'Full bathrooms above grade' },
];

type FormState = { [key: string]: string };
type Result = { predicted_price: string; predicted_price_raw: number };

export default function Home() {
  const [form, setForm] = useState<FormState>(
    Object.fromEntries(FIELDS.map(f => [f.name, '']))
  );
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
  };

  const handlePreset = (data: { [key: string]: number }) => {
    setForm(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])));
    setResult(null);
    setError('');
  };

  const isComplete = FIELDS.every(f => form[f.name] !== '');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const body = Object.fromEntries(
        FIELDS.map(f => [f.name, parseFloat(form[f.name])])
      );
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Could not connect to Flask API. Is it running on port 5000?');
    }
    setLoading(false);
  };

  const getPriceColor = (price: number) => {
    if (price > 250000) return 'text-purple-400';
    if (price > 150000) return 'text-blue-400';
    return 'text-green-400';
  };

  const getQualityLabel = (val: string) => {
    const n = parseInt(val);
    if (!n) return '';
    if (n <= 3) return '😟 Poor';
    if (n <= 5) return '😐 Below Average';
    if (n <= 7) return '🙂 Good';
    if (n <= 9) return '😃 Excellent';
    return '🏆 Perfect';
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-1 pt-4">
          <div className="text-4xl">🏡</div>
          <h1 className="text-3xl font-bold tracking-tight">Ames Housing Price Predictor</h1>
          <p className="text-gray-400 text-sm">Lasso Regression · R² 0.884 · Trained on 1,460 homes</p>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Quick presets</p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => handlePreset(p.data)}
                className="text-sm px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map(field => (
              <div key={field.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-300 font-medium">{field.label}</label>
                  {field.name === 'OverallQual' && form.OverallQual && (
                    <span className="text-xs">{getQualityLabel(form.OverallQual)}</span>
                  )}
                </div>
                <input
                  type="number"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={String(field.min)}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                />
                <p className="text-xs text-gray-600">{field.hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading || !isComplete}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition">
          {loading ? 'Predicting...' : 'Predict House Price'}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm">{error}</div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Estimated Sale Price</p>
            <p className={`text-4xl font-bold ${getPriceColor(result.predicted_price_raw)}`}>
              {result.predicted_price}
            </p>
            <div className="bg-gray-800 rounded-xl p-3 text-xs text-gray-400 text-left space-y-1">
              <p>⚡ Lasso Regression with α=0.01 regularisation</p>
              <p>📊 Model explains 88.4% of price variance (R²=0.884)</p>
              <p>📏 Average error: ~$28,700 · 178 of 245 features used</p>
              <p>🔧 Remaining features filled with dataset medians</p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}