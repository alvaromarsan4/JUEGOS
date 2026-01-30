"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);

	return (
		<nav className="w-full bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Link href="/" className="font-bold text-lg">
					Project Games
				</Link>

				<Link href="/games" className="text-sm opacity-80 hover:opacity-100">
					Listado
				</Link>
			</div>

			<div className="flex items-center gap-4">
				{user ? (
					<>
						<span className="text-sm opacity-90">{user.name}</span>
						<button
							onClick={() => logout()}
							className="text-sm opacity-80 hover:opacity-100 bg-red-600 px-3 py-1 rounded"
						>
							Cerrar sesión
						</button>
					</>
				) : (
					<>
						<Link href="/login" className="text-sm opacity-80 hover:opacity-100">
							🔑 Iniciar sesión
						</Link>

						<Link href="/register" className="text-sm opacity-80 hover:opacity-100">
							➕ Registrarse
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}
