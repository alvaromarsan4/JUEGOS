import "./globals.css";
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Project Games",
  description: "Descubre videojuegos gratuitos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        // AQUI ESTÁ EL CAMBIO: añadí "flex flex-col" al final.
        // Esto activa la flexibilidad vertical y permite que el flex-grow del main funcione.
        // Esto activa la flexibilidad vertical y permite que el flex-grow del main funcione.
        className={`min-h-screen w-full bg-background text-foreground ${inter.className} flex flex-col`}
      >
        <AuthProvider>

          {/* NAVBAR: SIEMPRE FULL WIDTH */}
          <Navbar />

          {/* CONTENIDO PRINCIPAL */}
          {/* Al tener el padre "flex-col", este flex-grow ahora sí empujará el footer abajo */}
          <main className="flex-grow w-full flex flex-col">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow w-full flex flex-col">
              {children}
            </div>
          </main>

          {/* FOOTER: FULL WIDTH */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}