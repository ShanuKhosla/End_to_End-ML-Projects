"use client";

import { useState } from "react";

const FIELDS = [
  {
    name: "MedInc",
    label: "Median Income ($10k)",
    placeholder: "3.5",
    min: 0,
    max: 15,
    step: 0.1,
    hint: "e.g. 3.5 = $35,000/year",
  },
  {
    name: "HouseAge",
    label: "House Age (years)",
    placeholder: "20",
    min: 1,
    max: 52,
    step: 1,
    hint: "Average age of houses in block",
  },
  {
    name: "AveRooms",
    label: "Average Rooms",
    placeholder: "5.0",
    min: 1,
    max: 20,
    step: 0.1,
    hint: "Average rooms per household",
  },
  {
    name: "AveBedrms",
    label: "Average Bedrooms",
    placeholder: "1.0",
    min: 0.5,
    max: 10,
    step: 0.1,
    hint: "Average bedrooms per household",
  },
  {
    name: "Population",
    label: "Block Population",
    placeholder: "800",
    min: 1,
    max: 10000,
    step: 1,
    hint: "Total people in block group",
  },
  {
    name: "AveOccup",
    label: "Average Occupancy",
    placeholder: "2.5",
    min: 1,
    max: 10,
    step: 0.1,
    hint: "Average people per household",
  },
  {
    name: "Latitude",
    label: "Latitude",
    placeholder: "34.0",
    min: 32,
    max: 42,
    step: 0.01,
    hint: "Southern CA ~34, Northern CA ~38",
  },
  {
    name: "Longitude",
    label: "Longitude",
    placeholder: "-118.0",
    min: -125,
    max: -114,
    step: 0.01,
    hint: "LA ~-118, SF ~-122",
  },
];

const PRESETS = [
  {
    label: "🌴 LA Suburb",
    values: {
      MedInc: 3.5,
      HouseAge: 20,
      AveRooms: 5.0,
      AveBedrms: 1.0,
      Population: 800,
      AveOccup: 2.5,
      Latitude: 34.0,
      Longitude: -118.0,
    },
  },
  {
    label: "🌉 SF Bay Area",
    values: {
      MedInc: 8.5,
      HouseAge: 35,
      AveRooms: 6.0,
      AveBedrms: 1.2,
      Population: 600,
      AveOccup: 2.8,
      Latitude: 37.8,
      Longitude: -122.4,
    },
  },
  {
    label: "🏕️ Rural CA",
    values: {
      MedInc: 1.5,
      HouseAge: 30,
      AveRooms: 4.0,
      AveBedrms: 1.1,
      Population: 1200,
      AveOccup: 3.2,
      Latitude: 40.0,
      Longitude: -122.0,
    },
  },
];

type FormState = { [key: string]: string };

export default function Home() {
  const [form, setForm] = useState<FormState>(
    Object.fromEntries(FIELDS.map((f) => [f.name, ""])),
  );
  const [result, setResult] = useState<{
    predicted_price: number;
    predicted_price_usd: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePreset = (values: { [key: string]: number }) => {
    setForm(
      Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, String(v)]),
      ),
    );
    setResult(null);
    setError("");
  };

  const isFormComplete = FIELDS.every((f) => form[f.name] !== "");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const body = Object.fromEntries(
        FIELDS.map((f) => [f.name, parseFloat(form[f.name])]),
      );
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to Flask API. Is it running on port 5000?");
    }
    setLoading(false);
  };

  const getConfidenceColor = (price: number) => {
    if (price < 1.5) return "text-green-400";
    if (price < 3.0) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 pt-4">
          <h1 className="text-3xl font-bold tracking-tight">
            🏡 California House Price Predictor
          </h1>
          <p className="text-gray-400 text-sm">
            Built with Linear Regression from scratch — no sklearn
          </p>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Quick presets
          </p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p.values)}
                className="text-sm px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm text-gray-300 font-medium">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
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
        <button
          onClick={handleSubmit}
          disabled={loading || !isFormComplete}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition text-white"
        >
          {loading ? "Predicting..." : "Predict House Price"}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Predicted Median House Price
            </p>
            <p
              className={`text-4xl font-bold ${getConfidenceColor(result.predicted_price)}`}
            >
              {result.predicted_price_usd}
            </p>
            <p className="text-sm text-gray-500">
              Raw model output: {result.predicted_price} × $100,000
            </p>
            <div className="bg-gray-800 rounded-xl p-3 text-xs text-gray-400 text-left space-y-1">
              <p>⚡ Powered by your from-scratch numpy linear regression</p>
              <p>📊 Model R² = 0.569 — explains ~57% of price variance</p>
              <p>📏 Average error: ~$64,000</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
