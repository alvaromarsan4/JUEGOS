"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get("/api/user/reviews")
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Reseñas</h1>
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-bold text-lg">{review.game.title}</h2>
            <div className="text-yellow-500">{"★".repeat(review.rating)}</div>
            <p className="italic text-gray-700">"{review.comment}"</p>
            <span className="text-xs text-gray-400">Publicado el: {new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        ))}
        {reviews.length === 0 && <p>Aún no has escrito ninguna reseña.</p>}
      </div>
    </div>
  );
}