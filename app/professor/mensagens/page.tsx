"use client";

import { useState } from "react";
import AlunosDoProfessor from "./components/AlunosDoProfessor";

export default function ProfessorMeusEstagiosPage() {
  const user = true;

  const [currentView, setCurrentView] = useState<"Estagios" | "Confirmacoes">(
    "Estagios",
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-black text-[32px] font-bold leading-8 mb-2">
            Painel de Informações
          </h1>
        </div>
        <div>
          {/* <button
            onClick={() => setCurrentView("Estagios")}
            className={`py-5 px-3 ${
              currentView === "Estagios"
                ? "bg-[#605BFF] text-white rounded-tl-sm rounded-bl-sm"
                : "bg-white text-black rounded-tr-sm rounded-br-sm"
            } cursor-pointer hover:opacity-90 transition-opacity`}
          >
            Estágios
          </button> */}
          <button
            onClick={() => setCurrentView("Confirmacoes")}
            className={`py-5 px-3 ${
              currentView === "Confirmacoes"
                ? "bg-[#605BFF] text-white rounded-tr-sm rounded-br-sm"
                : "bg-[#605BFF] text-white rounded-tl-sm rounded-bl-sm"
            } cursor-pointer hover:opacity-90 transition-opacity`}
          >
            Confirmações
          </button>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Meus Estágios</h3>
          <p className="text-gray-600">Visualize seus estágios ativos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Mensagens</h3>
          <p className="text-gray-600">Novas mensagens e comunicados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Notificações</h3>
          <p className="text-gray-600">Atualizações importantes</p>
        </div>
      </section> */}

      <div className="py-[100px]">
        <AlunosDoProfessor />
      </div>
    </section>
  );
}
