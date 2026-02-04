export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-primary mb-6">Sobre Project Games</h2>

      <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Project Games nació con una misión sencilla: crear la biblioteca de videojuegos
          más accesible y rápida de la web. Utilizamos las últimas tecnologías como
          <span className="text-foreground font-semibold"> Next.js</span> y
          <span className="text-foreground font-semibold"> Tailwind CSS</span> para
          ofrecerte una experiencia fluida.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="font-bold text-card-foreground text-xl mb-2">Rápido</h3>
            <p className="text-sm text-muted-foreground">Carga instantánea de tus juegos favoritos.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="font-bold text-card-foreground text-xl mb-2">Moderno</h3>
            <p className="text-sm text-muted-foreground">Diseñado con las mejores prácticas de UI/UX.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="font-bold text-card-foreground text-xl mb-2">Open Source</h3>
            <p className="text-sm text-muted-foreground">Código transparente y colaborativo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}