"use client";

import { useState, useEffect } from "react";
import api from "@/src/services/api";

import Image from "next/image";
import { OrientadosCard } from "./components/OrientadosCard";

interface Relatorio {
  id: string;
  titulo: string;
  dataEntregaPrevista: string;
  dataEntregaEfetiva: string | null;
  statusTexto: string;
  statusCor: string;
}

export interface EstagioData {
  id: string;
  matricula: string;
  statusEstagio: string;
  alunoNomeCompleto: string;
  orientadorNomeCompleto: string;
  concedente: string;
  supervisor: string;
  formacaoSupervisor: string | null;
  dataInicio: string;
  dataTermino: string;
  cargaHorariaSemanal: number;
  valorBolsa: number;
  auxilioTransporte: boolean;
  valorAuxilioTransporte: number;
  seguro: boolean;
  dataEntregaTCE: string;
  dataEntregaPlanoDeAtividades: string;
  relatorios: Relatorio[];
  aditivos: any[];
}

export default function ProfessorInicioPage() {
  const user = true;
  const [estagios, setEstagios] = useState<EstagioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da API
  useEffect(() => {
    const fetchEstagios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/professores", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setEstagios(response.data);
        } else {
          setEstagios([]);
        }
      } catch (error) {
        console.error("Erro ao carregar estágios:", error);
        setError("Erro ao carregar estágios dos orientandos");
      } finally {
        setLoading(false);
      }
    };

    fetchEstagios();
  }, []);

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

  const [userName, setUserName] = useState<string>("Usuário");

  // Função para obter o primeiro nome do usuário e capitalizar
  const getFirstName = (fullName: string): string => {
    if (!fullName) return "Usuário";

    const firstName = fullName.trim().split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const firstName = getFirstName(storedUser);
      setUserName(firstName);
    }
  }, []);

  return (
    <section className="">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-black text-[32px] font-bold leading-8 mb-2">
            Bem Vindo <span className="text-[#605BFF]">{userName}</span>
          </h1>
        </div>
        <Image
          src="/assets/bannercoordenador.jpeg"
          alt="Hebreus 13:8 -O mesmo ontem, hoje e para todo o sempre."
          width={1200}
          height={300}
          quality={100}
          priority
          className="w-full h-auto rounded-lg object-cover"
        />
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
        <OrientadosCard
          estagios={estagios}
          loading={loading}
          error={error}
          onRefresh={() => window.location.reload()}
        />
      </div>
    </section>
  );
}
