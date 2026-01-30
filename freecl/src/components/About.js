export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-blue-500 mb-6">Sobre Project Games</h2>
      
      <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <p className="text-lg text-slate-300 leading-relaxed mb-6">
          Project Games nació con una misión sencilla: crear la biblioteca de videojuegos 
          más accesible y rápida de la web. Utilizamos las últimas tecnologías como 
          <span className="text-white font-semibold"> Next.js</span> y 
          <span className="text-white font-semibold"> Tailwind CSS</span> para 
          ofrecerte una experiencia fluida.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="font-bold text-white text-xl mb-2">Rápido</h3>
            <p className="text-sm text-slate-400">Carga instantánea de tus juegos favoritos.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="font-bold text-white text-xl mb-2">Moderno</h3>
            <p className="text-sm text-slate-400">Diseñado con las mejores prácticas de UI/UX.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="font-bold text-white text-xl mb-2">Open Source</h3>
            <p className="text-sm text-slate-400">Código transparente y colaborativo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}