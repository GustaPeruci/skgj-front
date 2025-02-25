"use client";

import { useState, useEffect } from "react";

interface KeyPair {
  key1: string;
  key2: string;
}

export default function SecurityKeyboard() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [keyPairs, setKeyPairs] = useState<KeyPair[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    async function fetchSession() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`);
      const data = await response.json();
      setSessionId(data.sessionId);
      setKeyPairs(data.keyPairs.map((pair: string[]) => ({ key1: pair[0], key2: pair[1] })));
    }
    fetchSession();
  }, []);

  function handleKeyPress(value: string) {
    setInputValue((prev) => prev + value);
  }

  async function handleSubmit() {
    const response = await fetch("http://localhost:3001/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, inputValue })
    });
    const result = await response.json();
    alert(result.message);
    setInputValue("");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100">
      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-orange-500 text-center w-80">
        <h2 className="text-orange-600 font-bold text-lg">Teclado Virtual</h2>
        <p className="mt-2 text-gray-700 font-bold">Atenção: <span className="font-normal">digite a sua senha eletrônica no teclado abaixo:</span></p>
        <input 
          type="password" 
          value={inputValue} 
          className="w-full mt-2 p-2 border rounded text-center text-lg" 
          readOnly 
        />
        <div className="grid grid-cols-5 gap-2 mt-4">
          {keyPairs.map(({ key1, key2 }, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-blue-700"
              onClick={() => handleKeyPress(Math.random() > 0.5 ? key1 : key2)}
            >
              {key1} ou {key2}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-500" onClick={() => setInputValue("")}>LIMPAR</button>
          <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-orange-600" onClick={handleSubmit}>OK</button>
        </div>
      </div>
    </div>
  );
}