import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full bg-background text-foreground selection:bg-primary selection:text-white relative overflow-hidden flex flex-col justify-start items-center pt-10 pb-8 h-full">

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">

        <div className="space-y-6">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
            Nuestra Misión
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Revolucionando la forma en que descubres <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Videojuegos Gratuitos</span>.
          </h1>

          <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
            <p>
              En <strong>Project Games</strong>, creemos que el acceso al entretenimiento digital no debería tener barreras económicas. Nacimos con un objetivo claro: crear el catálogo más completo y accesible de videojuegos *Free-to-Play* del mercado.
            </p>
            <p>
              Utilizamos tecnología de vanguardia para filtrar, categorizar y presentarte solo aquellas experiencias que merecen tu tiempo, eliminando el ruido y conectándote directamente con tu próxima aventura.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/games" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
              Explorar Catálogo
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-2xl opacity-20"></div>
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">Rendimiento Óptimo</h3>
                <p className="text-sm text-muted-foreground">Carga instantánea y filtros en tiempo real.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">Comunidad Global</h3>
                <p className="text-sm text-muted-foreground">Diseñado para jugadores de todo el mundo.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-xl text-card-foreground">100% Verificado</h3>
                <p className="text-sm text-muted-foreground">Solo listamos juegos seguros y funcionales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 w-full mt-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-foreground">Desarrollado con Tecnología Moderna</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-card rounded-xl border border-border hover:border-blue-500 transition-colors group">
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-blue-500">Next.js 14</h3>
              <p className="text-sm text-muted-foreground mt-2">App Router & Server Actions</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border hover:border-purple-500 transition-colors group">
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-purple-500">Laravel</h3>
              <p className="text-sm text-muted-foreground mt-2">API RESTful Robusta</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border hover:border-cyan-500 transition-colors group">
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-cyan-500">Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground mt-2">Diseño Responsive y Moderno</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border hover:border-yellow-500 transition-colors group">
              <h3 className="text-xl font-bold text-card-foreground group-hover:text-yellow-500">MySQL</h3>
              <p className="text-sm text-muted-foreground mt-2">Gestión de Datos Escalable</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}