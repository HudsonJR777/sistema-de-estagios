"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/src/services/api";
import ModalMotivoRejeicao from "./ModalMotivoRejeicao";

// Usando a mesma interface do ConfirmacoesCard
interface EstagioResponseDTO {
  id: string;
  statusEstagio: string;
  alunoNomeCompleto: string;
  matricula: string;
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
  relatorios: any[];
  aditivos: any[];
}

type tipoAcaoEstagio =
  | "novo"
  | "rescisao"
  | "conclusao"
  | "relatorios"
  | "aditivos";

interface AprovarEstagioModalProps {
  isOpen: boolean;
  onClose: () => void;
  estagioId: string;
  tipo: tipoAcaoEstagio;
}

export default function AprovarEstagioModal({
  isOpen,
  onClose,
  estagioId,
  tipo,
}: AprovarEstagioModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [estagio, setEstagio] = useState<EstagioResponseDTO | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMotivoModalOpen, setIsMotivoModalOpen] = useState(false);

  // Buscar dados do estágio quando o modal abrir
  useEffect(() => {
    const fetchEstagio = async () => {
      if (!isOpen || !estagioId) return;

      try {
        setLoadingData(true);
        setError(null);

        const response = await api.get(`/api/estagios/${estagioId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        setEstagio(response.data);
      } catch (error: any) {
        console.error("Erro ao carregar estágio:", error);
        setError(
          error.response?.data?.message || "Erro ao carregar dados do estágio",
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchEstagio();
  }, [isOpen, estagioId]);

  const rotas = {
    novo: {
      aprovar: `/api/estagios/${estagio?.id}/aprovar`,
      rejeitar: `/api/estagios/${estagio?.id}/rejeitar`,
    },
    rescisao: {
      aprovar: `/api/estagios/${estagio?.id}/aprovar-rescisao`,
      rejeitar: `/api/estagios/${estagio?.id}/rejeitar-rescisao`,
    },
    conclusao: {
      aprovar: `/api/estagios/${estagio?.id}/aprovar-conclusao`,
      rejeitar: `/api/estagios/${estagio?.id}/rejeitar-conclusao`,
    },
    relatorios: {
      aprovar: `/api/relatorios/${estagio?.id}/aprovar`,
      rejeitar: `/api/relatorios/${estagio?.id}/rejeitar`,
    },
    aditivos: {
      aprovar: `/api/aditivos/${estagio?.id}/aprovar-aditivo`,
      rejeitar: `/api/aditivos/${estagio?.id}/rejeitar`,
    },
  };

  const executarAprovacao = async () => {
    try {
      await api.patch(rotas[tipo].aprovar);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error(`Erro ao aprovar estágio:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const executarRejeicao = async (motivo: string) => {
    setIsLoading(true);
    try {
      await api.patch(rotas[tipo].rejeitar, {
        motivo,
      });
      setIsMotivoModalOpen(false);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprovar = () => {
    executarAprovacao();
  };

  const handleReprovar = () => {
    setIsMotivoModalOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
      }}
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Dados do Estágio
          </h2>
          <button
            onClick={onClose}
            className=" cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loadingData ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605BFF]"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium">Erro ao carregar dados</p>
              <p className="text-sm text-gray-500 mt-2">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          ) : !estagio ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Estágio não encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header com Campo e Informação */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-sm font-medium text-gray-500">Campo</div>
                <div className="text-sm font-medium text-gray-500">
                  Informação
                </div>
              </div>

              {/* Dados do estágio */}
              <div className="space-y-4">
                {/* Nome */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">Nome:</div>
                  <div className="text-sm text-gray-900">
                    {estagio.alunoNomeCompleto}
                  </div>
                </div>

                {/* Orientador */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Orientador:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.orientadorNomeCompleto}
                  </div>
                </div>

                {/* Concedente */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Concedente:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.concedente}
                  </div>
                </div>

                {/* Supervisor */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Supervisor:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.supervisor}
                  </div>
                </div>

                {/* Data de Início */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Data de Início:
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatDate(estagio.dataInicio)}
                  </div>
                </div>

                {/* Data de Término */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Data de Término:
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatDate(estagio.dataTermino)}
                  </div>
                </div>

                {/* Carga horária semanal */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Carga horária semanal:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.cargaHorariaSemanal}h
                  </div>
                </div>

                {/* Valor da bolsa */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Valor da bolsa:
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatCurrency(estagio.valorBolsa)}
                  </div>
                </div>

                {/* Auxílio transporte */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Auxílio transporte:
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatCurrency(estagio.valorAuxilioTransporte)}
                  </div>
                </div>

                {/* Seguro */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Seguro:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.seguro ? "Sim" : "Não"}
                  </div>
                </div>

                {/* TCE */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">TCE:</div>
                  <div className="text-sm text-gray-900">
                    {estagio.dataEntregaTCE
                      ? formatDate(estagio.dataEntregaTCE)
                      : "Pendente"}
                  </div>
                </div>

                {/* Plano De Atividades */}
                <div className="grid grid-cols-2 gap-8 py-2">
                  <div className="text-sm font-medium text-gray-700">
                    Plano De Atividades:
                  </div>
                  <div className="text-sm text-gray-900">
                    {estagio.dataEntregaPlanoDeAtividades
                      ? formatDate(estagio.dataEntregaPlanoDeAtividades)
                      : "Pendente"}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleReprovar}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 px-4 py-2 text-[#605BFF] bg-white border border-[#605BFF] rounded-md hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processando..." : "Reprovar"}
                </button>
                <button
                  type="button"
                  onClick={handleAprovar}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 px-4 py-2 bg-[#605BFF] text-white rounded-md hover:bg-[#4B43E0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processando..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalMotivoRejeicao
        isOpen={isMotivoModalOpen}
        onClose={() => setIsMotivoModalOpen(false)}
        onConfirm={executarRejeicao}
        isLoading={isLoading}
      />
    </div>
  );
}
