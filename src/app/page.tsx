"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegistering ? "/api/signup" : "/api/login";
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("sessionId", result.sessionId);
        sessionStorage.setItem("encryptedPairs", result.encryptedPairs);
        sessionStorage.setItem("keyPairs", result.keyPairs);
        
        router.push("/keyboard");
      } else {
        setError(result.message || "Erro ao autenticar");
      }
    } catch (error) {
      setLoading(false);
      setError("Erro de conexão com o servidor.");
      console.error("Erro ao enviar a requisição:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100">
      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-orange-500 text-center w-90">
        <h2 className="text-orange-600 font-bold text-lg">
          {isRegistering ? "Cadastro" : "Login"}
        </h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded text-center text-lg text-gray-700"
              required
            />
          </div>
          <div className="mt-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha (somente números)"
              value={password}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPassword(value);
              }}
              className="w-full p-2 border rounded text-center text-lg pr-10 text-gray-700"
              required
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Carregando..." : isRegistering ? "Registrar" : "Entrar"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-orange-600 hover:underline"
          >
            {isRegistering ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}
