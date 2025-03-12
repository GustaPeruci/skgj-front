"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface KeyPair {
  key1: string;
  key2: string;
}

export default function SecurityKeyboard() {
  const [keyPairs, setKeyPairs] = useState<KeyPair[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const keyPairsFromStorage = JSON.parse(sessionStorage.getItem("keyPairs") || "[]");

      if (!keyPairsFromStorage || keyPairsFromStorage.length === 0) {
        toast.error("Pares de chaves não encontrados.");
        return;
      }

      const formattedKeyPairs: KeyPair[] = keyPairsFromStorage.map((pair: [string, string]) => ({
        key1: pair[0],
        key2: pair[1],
      }));

      setKeyPairs(formattedKeyPairs);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pares de chaves.");
      router.push("/");
    }
  }, []);

  function handleKeyPress(value: string) {
    if (inputValue.length < 6) {
      setInputValue((prev) => prev + value);
    }
  }

  async function handleSubmit() {
    const sessionId = sessionStorage.getItem("sessionId");
    const encryptedPairs = sessionStorage.getItem("encryptedPairs");
    const username = sessionStorage.getItem("username");

    if (!inputValue) {
      toast.warn("Preencha a senha antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputValue, sessionId, encryptedPairs, username })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setInputValue("");
        setTimeout(() => router.push("/"), 500);        
      } else {
        toast.error(result.message || "Erro na validação.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao validar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100 relative">
      {/* ToastContainer para exibir os toasts */}
      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-lg font-bold">Validando...</div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-orange-500 text-center w-90 relative z-10">
        <h2 className="text-orange-600 font-bold text-lg">Teclado Virtual Seguro</h2>
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            value={inputValue}
            className="w-full p-2 border rounded text-center text-lg text-gray-700 pr-10"
            readOnly
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
        <div className="grid grid-cols-5 gap-2 mt-4">
          {keyPairs.map(({ key1, key2 }, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-blue-700"
              onClick={() => handleKeyPress(Math.random() > 0.5 ? key1 : key2)}
              disabled={loading}
            >
              {key1} ou {key2}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-500"
            onClick={() => setInputValue("")}
            disabled={loading}
          >
            LIMPAR
          </button>
          <button
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-orange-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
