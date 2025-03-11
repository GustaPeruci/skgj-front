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
  const router = useRouter();

  // Gerar a sequência de pares únicos aleatórios ao inicializar
  useEffect(() => {
    try {
      const keyPairsFromStorage = JSON.parse(sessionStorage.getItem("keyPairs") || "[]");

      if (!keyPairsFromStorage || keyPairsFromStorage.length === 0) {
        toast.error("Pares de chaves não encontrados.");
        return;
      }

      // Transformar o formato de array de arrays para um array de objetos { key1, key2 }
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

  // Função de manipulação de pressionamento de tecla
  function handleKeyPress(value: string) {
    setInputValue((prev) => prev + value);
  }

  // Função de envio dos dados
  async function handleSubmit() {
    const sessionId = sessionStorage.getItem("sessionId");
    const encryptedPairs = sessionStorage.getItem("encryptedPairs");
    const username = sessionStorage.getItem("username");

    if (!inputValue) {
      toast.warn("Preencha a senha antes de enviar.");
      return;
    }

    console.log({ inputValue, sessionId, encryptedPairs, username });

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
        setTimeout(() => router.push("/"), 3000);        
      } else {
        toast.error(result.message || "Erro na validação.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao validar a senha.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100">
      {/* ToastContainer para exibir os toasts */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-orange-500 text-center w-90">
        <h2 className="text-orange-600 font-bold text-lg">Teclado Virtual Seguro</h2>
        <input
          type="password"
          value={inputValue}
          className="w-full mt-2 p-2 border rounded text-center text-lg text-gray-700"
          readOnly
        />
        <div className="grid grid-cols-5 gap-2 mt-4">
          {keyPairs.map(({ key1, key2 }, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-blue-700"
              onClick={() => handleKeyPress(Math.random() > 0.5 ? key1 : key2)} // Seleciona aleatoriamente entre key1 e key2
            >
              {key1} ou {key2}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-500"
            onClick={() => setInputValue("")}
          >
            LIMPAR
          </button>
          <button
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-orange-600"
            onClick={handleSubmit}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
