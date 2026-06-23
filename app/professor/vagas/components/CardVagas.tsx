"use client";

import { useEffect, useState } from "react";
import api from "@/src/services/api";

interface ApiCardVagas {
  id: string;
  titulo: string;
  descricao: string;
  dataPublicacao: string;
}

interface ApiResponseVaga {
  id: string;
  titulo: string;
  descricao: string;
  urlVaga: string;
  urlPdfDrive: string;
  dataDePublicacao: string;
}

export default function CardVagas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vagas, setVagas] = useState<ApiCardVagas[]>([]);

  const formatarData = (data: string) => {
    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
  };

  const fetchVagas = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await api.get<ApiResponseVaga[]>(
        "/api/vagas-estagio/listar-vagas",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const vagasTransformadas: ApiCardVagas[] = response.data.map((vaga) => ({
        id: vaga.id,
        titulo: vaga.titulo,
        descricao: vaga.descricao,
        dataPublicacao: vaga.dataDePublicacao,
      }));

      setVagas(vagasTransformadas);
    } catch (err: any) {
      console.error("Erro ao buscar vagas:", err);

      setError(err?.response?.data?.message || "Erro ao buscar vagas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#5B5DFF]" />
          <span className="text-gray-600">Carregando vagas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="bg-white rounded-xl border border-[#E8EAF7] shadow-sm p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">
              Erro ao carregar dados
            </p>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              onClick={fetchVagas}
              className="cursor-pointer mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (vagas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">Nenhuma vaga encontrada.</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="lg:grid lg:grid-cols-4">
        {vagas.map((vaga) => (
          <div
            key={vaga.id}
            className="
              bg-white
              border
              border-[#E8EAF7]
              rounded-[20px]
              p-6
              min-h-[320px]
              flex
              flex-col
              shadow-sm
              hover:shadow-lg
              transition-all
              duration-300
              lg:w-[380px]
            "
          >
            <h2
              className="
                text-[20px]
                font-bold
                leading-tight
                text-[#0D0D2B]
              "
            >
              {vaga.titulo}
            </h2>

            <p
              className="
                mt-4
                text-[15px]
                leading-6
                text-[#6B7280]
                line-clamp-4
              "
            >
              {vaga.descricao}
            </p>

            <div className="mt-auto">
              <p
                className="
                  mt-8
                  mb-5
                  text-[14px]
                  text-[#9CA3AF]
                "
              >
                Publicado em {formatarData(vaga.dataPublicacao)}
              </p>

              <button
                type="button"
                className="
                  w-full
                  h-11
                  rounded-full
                  bg-gradient-to-r
                  from-[#5B5DFF]
                  to-[#7E1CFF]
                  text-white
                  text-sm
                  font-medium
                  hover:brightness-110
                  transition
                  cursor-pointer
                "
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
