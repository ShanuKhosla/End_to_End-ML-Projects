"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPECIES_INFO = {
  setosa: {
    emoji: "🌸",
    color: "pink",
    description: "Small flowers with narrow petals. Easiest to identify.",
  },
  versicolor: {
    emoji: "💜",
    color: "purple",
    description: "Medium sized flowers. Often confused with virginica.",
  },
  virginica: {
    emoji: "🌿",
    color: "green",
    description: "Largest flowers with wide petals.",
  },
};

export default function Home() {
  const [form, setForm] = useState({
    sepal_length: "",
    sepal_width: "",
    petal_length: "",
    petal_width: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePreset = (values) => {
    setForm(values);
    setResult(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sepal_length: parseFloat(form.sepal_length),
          sepal_width: parseFloat(form.sepal_width),
          petal_length: parseFloat(form.petal_length),
          petal_width: parseFloat(form.petal_width),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to Flask API. Is it running on port 5000?");
    }
    setLoading(false);
  };

  const presets = [
    {
      label: "Setosa sample",
      values: {
        sepal_length: "5.1",
        sepal_width: "3.5",
        petal_length: "1.4",
        petal_width: "0.2",
      },
    },
    {
      label: "Versicolor sample",
      values: {
        sepal_length: "6.1",
        sepal_width: "2.8",
        petal_length: "4.0",
        petal_width: "1.3",
      },
    },
    {
      label: "Virginica sample",
      values: {
        sepal_length: "6.3",
        sepal_width: "3.3",
        petal_length: "6.0",
        petal_width: "2.5",
      },
    },
  ];

  const species = result?.species?.toLowerCase();
  const info = SPECIES_INFO[species];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="w-full max-w-md space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.h1
            className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
          >
            🌺 Iris Classifier
          </motion.h1>
          <motion.p
            className="text-gray-300 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover flower species with AI precision
          </motion.p>
        </motion.div>

        {/* Preset buttons */}
        <motion.div
          className="flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {presets.map((p, i) => (
            <motion.button
              key={p.label}
              onClick={() => handlePreset(p.values)}
              className="text-xs px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-200 border border-gray-600 font-medium shadow-lg font-semibold"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.1,
                type: "spring",
              }}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {p.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Input form */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-6 space-y-4 border border-gray-700 shadow-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            {
              label: "Sepal Length (cm)",
              name: "sepal_length",
              placeholder: "e.g. 5.1",
            },
            {
              label: "Sepal Width (cm)",
              name: "sepal_width",
              placeholder: "e.g. 3.5",
            },
            {
              label: "Petal Length (cm)",
              name: "petal_length",
              placeholder: "e.g. 1.4",
            },
            {
              label: "Petal Width (cm)",
              name: "petal_width",
              placeholder: "e.g. 0.2",
            },
          ].map((field, i) => (
            <motion.div
              key={field.name}
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
            >
              <motion.label
                className="text-sm text-gray-300 font-medium block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {field.label}
              </motion.label>
              <motion.input
                type="number"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                step="0.1"
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition shadow-md text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileFocus={{
                  boxShadow:
                    "0 0 25px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.1)",
                  borderColor: "rgb(168, 85, 247)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={
            loading ||
            !form.sepal_length ||
            !form.sepal_width ||
            !form.petal_length ||
            !form.petal_width
          }
          className="w-full py-3 rounded-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition text-white text-lg shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: loading ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚙️
                </motion.span>
                Predicting...
              </span>
            ) : (
              "Predict Species"
            )}
          </motion.span>
        </motion.button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-gradient-to-r from-red-950 to-red-900 border-2 border-red-700 text-red-200 rounded-2xl p-4 text-sm shadow-lg font-medium"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <motion.span
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                ❌ {error}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && info && (
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-2 border-purple-600 rounded-3xl p-6 space-y-4 text-center shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              {/* Glow effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className="text-7xl mb-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                >
                  {info.emoji}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-1">
                    ✨ Predicted Species
                  </p>
                  <motion.p
                    className="text-4xl font-black capitalize bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                  >
                    {result.species}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl px-6 py-3 inline-block mt-4 border border-purple-500 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span className="text-sm text-gray-300">Confidence: </span>
                  <motion.span
                    className="text-lg font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                  >
                    {result.confidence}%
                  </motion.span>
                </motion.div>

                <motion.p
                  className="text-sm text-gray-300 mt-4 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {info.description}
                </motion.p>
              </div>

              {/* Floating particles effect */}
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
