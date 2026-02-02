import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 
import "./globals.css";
import { Inter } from "next/font/google";

// 1. Importamos el Provider
import { AuthProvider } from "@/context/AuthContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mi App de Juegos",
  description: "Juegos y Favoritos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Añadí inter.className para que la fuente se aplique correctamente */}
      <body className={`flex flex-col min-h-screen bg-slate-950 ${inter.className}`}>
        
        {/* 2. EL AUTHPROVIDER DEBE ENVOLVER TODO EL CONTENIDO VISIBLE */}
        <AuthProvider>
          
          {/* Al estar dentro del Provider, el Navbar podrá saber si hay un usuario logueado */}
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}