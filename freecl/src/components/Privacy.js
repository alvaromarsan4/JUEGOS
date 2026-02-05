export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-8 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 border-b border-slate-700 pb-4">Política de Privacidad</h2>
      
      <div className="space-y-6 text-slate-300">
        <section>
          <h3 className="text-xl font-semibold text-white mb-2">1. Uso de Datos</h3>
          <p>
            En Project Games, respetamos tu privacidad. No recopilamos datos personales 
            sin tu consentimiento explícito. La información visualizada proviene de nuestra 
            API pública y se utiliza únicamente con fines demostrativos.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-2">2. Cookies</h3>
          <p>
            Utilizamos almacenamiento local (LocalStorage) únicamente para guardar tus 
            preferencias de visualización, como el modo oscuro o filtros de búsqueda, 
            para mejorar tu experiencia al regresar.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-2">3. Contacto</h3>
          <p>
            Si tienes dudas sobre cómo manejamos la información, puedes contactar al 
            equipo de desarrollo a través del repositorio oficial en GitHub.
          </p>
        </section>
      </div>
    </div>
  );
}