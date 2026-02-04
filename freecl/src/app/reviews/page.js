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
    <div className="max-w-4xl mx-auto p-6 bg-background min-h-screen text-foreground">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Mis Reseñas</h1>
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border border-border rounded shadow-sm bg-card text-card-foreground">
            <h2 className="font-bold text-lg text-primary">{review.game.title}</h2>
            <div className="text-yellow-500">{"★".repeat(review.rating)}</div>
            <p className="italic text-muted-foreground">"{review.comment}"</p>
            <span className="text-xs text-muted-foreground">Publicado el: {new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-muted-foreground">Aún no has escrito ninguna reseña.</p>}
      </div>
    </div>
  );
}