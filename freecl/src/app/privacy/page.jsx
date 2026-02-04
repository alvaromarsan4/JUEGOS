import Link from "next/link";

export default function PrivacyPage() {
  return (
    // CAMBIOS:
    // 1. Quitada la restricción 'min-h-...'. Ahora es 'h-auto' (por defecto al no poner nada) para que mida lo que mide el contenido.
    // 2. Ajustado el padding: 'pt-10' arriba para separar del navbar, 'pb-8' abajo para no dejar mucho hueco con el footer.
    <div className="w-full bg-background text-foreground selection:bg-primary selection:text-white relative overflow-hidden flex flex-col justify-start items-center pt-10 pb-8">

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      {/* Contenedor Principal */}
      <div className="max-w-5xl mx-auto px-6 w-full relative z-10">

        {/* Encabezado */}
        <div className="text-center mb-8 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
            Legal
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold">
            Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Privacidad</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            La transparencia es fundamental en Project Games. Aquí explicamos claramente cómo tratamos la información en este proyecto académico.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Tarjeta 1 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover:border-blue-500/50 transition-colors group backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">1. Uso de Datos</h3>
            <p className="text-muted-foreground leading-relaxed">
              En Project Games, respetamos tu privacidad al máximo. <strong>No recopilamos datos personales</strong> sin tu consentimiento explícito. La información proviene de nuestra base de datos pública con fines educativos.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover:border-purple-500/50 transition-colors group backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">2. Almacenamiento Local</h3>
            <p className="text-muted-foreground leading-relaxed">
              No usamos cookies de rastreo. Utilizamos <code>LocalStorage</code> únicamente para guardar tus <strong>preferencias</strong> (filtros, modo oscuro) y mejorar tu experiencia.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover:border-green-500/50 transition-colors group backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">3. Código Abierto</h3>
            <p className="text-muted-foreground leading-relaxed">
              Este proyecto es open source. Todo el código frontend y backend está disponible para revisión, garantizando transparencia total.
            </p>
          </div>

          {/* Tarjeta 4 */}
          <div className="bg-card border border-border p-8 rounded-2xl hover:border-yellow-500/50 transition-colors group backdrop-blur-sm">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">4. Contacto</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ¿Dudas sobre el TFG? Puedes contactar al equipo o revisar el código fuente.
            </p>
            <Link
              href="https://github.com/alvaromarsan4/JUEGOS"
              target="_blank"
              className="text-primary hover:text-blue-400 font-semibold inline-flex items-center gap-2"
            >
              Ver Repositorio en GitHub <span>→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}