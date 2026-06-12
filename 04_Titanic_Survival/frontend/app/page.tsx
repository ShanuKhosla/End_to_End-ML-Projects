"use client";

import { useState } from "react";

const PRESETS = [
  {
    label: "👩‍💼 1st Class Lady",
    data: {
      pclass: 1,
      sex: "female",
      age: 28,
      sibsp: 0,
      parch: 0,
      fare: 100,
      title: "Mrs",
      embarked: "S",
    },
  },
  {
    label: "👨‍🔧 3rd Class Worker",
    data: {
      pclass: 3,
      sex: "male",
      age: 25,
      sibsp: 0,
      parch: 0,
      fare: 8,
      title: "Mr",
      embarked: "S",
    },
  },
  {
    label: "👦 Young Boy",
    data: {
      pclass: 2,
      sex: "male",
      age: 8,
      sibsp: 1,
      parch: 2,
      fare: 25,
      title: "Master",
      embarked: "C",
    },
  },
];

type FormState = {
  pclass: string;
  sex: string;
  age: string;
  sibsp: string;
  parch: string;
  fare: string;
  title: string;
  embarked: string;
};

type Result = {
  survived: number;
  survival_probability: number;
  verdict: string;
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    pclass: "",
    sex: "",
    age: "",
    sibsp: "",
    parch: "",
    fare: "",
    title: "",
    embarked: "",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
  };

  const handlePreset = (data: Omit<FormState, never>) => {
    setForm(
      Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)]),
      ) as FormState,
    );
    setResult(null);
    setError("");
  };

  const isComplete = Object.values(form).every((v) => v !== "");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pclass: parseInt(form.pclass),
          sex: form.sex,
          age: parseFloat(form.age),
          sibsp: parseInt(form.sibsp),
          parch: parseInt(form.parch),
          fare: parseFloat(form.fare),
          title: form.title,
          embarked: form.embarked,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to Flask API. Is it running on port 5000?");
    }
    setLoading(false);
  };

  const probColor = result
    ? result.survival_probability >= 60
      ? "text-green-400"
      : result.survival_probability >= 35
        ? "text-yellow-400"
        : "text-red-400"
    : "";

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 pt-4">
          <div className="text-4xl">🚢</div>
          <h1 className="text-3xl font-bold tracking-tight">
            Titanic Survival Predictor
          </h1>
          <p className="text-gray-400 text-sm">
            Would you have survived? Logistic Regression · 83.8% accuracy
          </p>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Try a preset
          </p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p.data as any)}
                className="text-sm px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Passenger Class</label>
              <select
                name="pclass"
                value={form.pclass}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
              >
                <option value="">Select...</option>
                <option value="1">1st Class</option>
                <option value="2">2nd Class</option>
                <option value="3">3rd Class</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Sex</label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Title</label>
              <select
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
              >
                <option value="">Select...</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Master">Master</option>
                <option value="Rare">Rare (Dr, Rev, etc.)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">
                Port of Embarkation
              </label>
              <select
                name="embarked"
                value={form.embarked}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
              >
                <option value="">Select...</option>
                <option value="S">Southampton (S)</option>
                <option value="C">Cherbourg (C)</option>
                <option value="Q">Queenstown (Q)</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "age", label: "Age", placeholder: "28", step: "1" },
              {
                name: "sibsp",
                label: "Siblings/Spouse",
                placeholder: "0",
                step: "1",
              },
              {
                name: "parch",
                label: "Parents/Children",
                placeholder: "0",
                step: "1",
              },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-sm text-gray-400">{f.label}</label>
                <input
                  type="number"
                  name={f.name}
                  value={form[f.name as keyof FormState]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  step={f.step}
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            ))}
          </div>

          {/* Fare */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Fare (£)</label>
            <input
              type="number"
              name="fare"
              value={form.fare}
              onChange={handleChange}
              placeholder="e.g. 32"
              step="0.5"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
            <p className="text-xs text-gray-600">
              3rd class ~£8 · 2nd class ~£13 · 1st class ~£30-100+
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isComplete}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition text-white"
        >
          {loading ? "Predicting..." : "Would I Survive?"}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center space-y-4">
            <div className="text-5xl">{result.survived ? "🎉" : "💀"}</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                Verdict
              </p>
              <p className="text-2xl font-bold mt-1">
                {result.survived ? "Survived" : "Did Not Survive"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Survival Probability</p>
              <p className={`text-4xl font-bold ${probColor}`}>
                {result.survival_probability}%
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${result.survived ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${result.survival_probability}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Model accuracy: 83.8% · AUC: 0.871
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
