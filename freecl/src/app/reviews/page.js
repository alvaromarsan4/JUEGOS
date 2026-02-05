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
    <div className="max-w-4xl mx-auto p-6 h-full flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-8 text-primary self-start">Mis Reseñas</h1>
      <div className="grid gap-6 w-full">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 bg-card border border-border rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="font-bold text-xl text-card-foreground mb-2">{review.game.title}</h2>
            <div className="text-yellow-500 mb-3 text-sm">{"★".repeat(review.rating)}</div>
            <p className="italic text-muted-foreground mb-4 leading-relaxed">"{review.comment}"</p>
            <div className="text-xs text-muted-foreground border-t border-border pt-3 flex justify-between items-center">
              <span>Publicado el: {new Date(review.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border w-full">
            <p className="text-muted-foreground text-lg">Aún no has escrito ninguna reseña.</p>
          </div>
        )}
      </div>
    </div>
  );
}