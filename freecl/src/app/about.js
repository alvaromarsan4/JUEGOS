"use client";
import React, { useState, useEffect } from "react";
import "./globals.css";

export default function About() {
  // Estado para guardar los datos que vienen de Laravel
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Petición al backend (ajusta la URL según tu puerto de Laravel)
    fetch("http://localhost:8000/api/about")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error cargando datos:", error));
  }, []);

  if (loading) return <div className="text-white text-center p-10">Cargando...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <main className="flex-grow max-w-4xl mx-auto p-8 text-center animate-fade-in">
        {/* Título dinámico */}
        <h2 className="text-4xl font-bold text-blue-500 mb-6">{data.title}</h2>
      </main>

      <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">
        {/* Descripción dinámica */}
        <p className="text-lg text-slate-300 leading-relaxed mb-6">
          {data.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Mapeamos las características (features) desde el array del backend */}
          {data.features.map((feature, index) => (
            <div key={index} className="p-4 bg-slate-800 rounded-lg">
              <h3 className="font-bold text-white text-xl mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}