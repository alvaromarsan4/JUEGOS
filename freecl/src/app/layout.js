import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Importa tu nuevo componente
import "./globals.css";
 
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* IMPORTANTE:
        Usamos "flex flex-col min-h-screen" para que el cuerpo
        siempre ocupe el total de la pantalla.
      */}
      <body className="flex flex-col min-h-screen bg-slate-950">
       
        <Navbar />
 
        {/* "flex-grow" es el truco: estira este contenedor
          para que el footer siempre se vaya al fondo de la página.
        */}
        <main className="flex-grow">
          {children}
        </main>
 
        <Footer />
 
      </body>
    </html>
  );
}