"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/src/services/api";
import AprovarEstagioModal from "./AprovarEstagioModal";

// Interfaces baseadas nos DTOs Java
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
  relatorios: RelatorioResponseDTO[];
  aditivos: AditivoResponseDTO[];
}

interface AditivoResponseDTO {
  id: string;
  novaDataTermino: string;
  status: string;
  descricao: string;
}

interface RelatorioResponseDTO {
  id: string;
  titulo: string;
  dataEntregaPrevista: string;
  dataEntregaEfetiva: string | null;
  statusTexto: string;
  statusCor: string;
}

interface DashboardPendenciasDTO {
  estagiosPendentes: EstagioResponseDTO[];
  aditivosPendentes: AditivoResponseDTO[];
  relatoriosPendentes: RelatorioResponseDTO[];
  conclusoesPendentes: EstagioResponseDTO[];
  rescisoesPendentes: EstagioResponseDTO[];
}

interface Estagio {
  id: string;
  nome: string;
  dataInicio: string;
  concedente: string;
  professor: string;
  status: string;
}

export default function ConfirmacoesCard() {
  // Estados de paginação
  const [currentPageNovos, setCurrentPageNovos] = useState(1);
  const [currentPageAndamento, setCurrentPageAndamento] = useState(1);
  const [currentPageConcluir, setCurrentPageConcluir] = useState(1);
  const [currentPageRescisoes, setCurrentPageRescisoes] = useState(1);
  const [currentPageRelatorios, setCurrentPageRelatorios] = useState(1);
  const [currentPageAditivos, setCurrentPageAditivos] = useState(1);
  const itemsPerPage = 3;

  type TipoAcaoEstagio = "novo" | "rescisao" | "conclusao";

  const [selectedeEstagio, setSelectedEstagio] = useState<{
    id: string;
    tipo: TipoAcaoEstagio;
  } | null>(null);

  // Estados para dados da API
  const [dashboardData, setDashboardData] = useState<DashboardPendenciasDTO>({
    estagiosPendentes: [],
    aditivosPendentes: [],
    relatoriosPendentes: [],
    conclusoesPendentes: [],
    rescisoesPendentes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da API
  useEffect(() => {
    const fetchPendencias = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/professores/pendencias", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        setDashboardData(response.data);
      } catch (error) {
        console.error("Erro ao carregar pendências:", error);
        setError("Erro ao carregar pendências");

        // Dados de teste para desenvolvimento
        setDashboardData({
          estagiosPendentes: [
            {
              id: "1",
              statusEstagio: "AGUARDANDO_CONFIRMACAO",
              alunoNomeCompleto: "Luiz Otavio Sales",
              matricula: "12345678",
              orientadorNomeCompleto: "Eduardo Pelli",
              concedente: "Casa Bom Jesus",
              supervisor: "João Silva",
              formacaoSupervisor: "Engenheiro",
              dataInicio: "2021-12-03",
              dataTermino: "2022-12-03",
              cargaHorariaSemanal: 30,
              valorBolsa: 800,
              auxilioTransporte: true,
              valorAuxilioTransporte: 200,
              seguro: true,
              dataEntregaTCE: "2021-12-15",
              dataEntregaPlanoDeAtividades: "2022-01-15",
              relatorios: [],
              aditivos: [],
            },
            {
              id: "2",
              statusEstagio: "AGUARDANDO_CONFIRMACAO",
              alunoNomeCompleto: "Luiz Guilherme Couto",
              matricula: "87654321",
              orientadorNomeCompleto: "Eduardo Pelli",
              concedente: "Hospital Santa Casa",
              supervisor: "Maria Santos",
              formacaoSupervisor: "Médica",
              dataInicio: "2021-12-03",
              dataTermino: "2022-12-03",
              cargaHorariaSemanal: 20,
              valorBolsa: 600,
              auxilioTransporte: false,
              valorAuxilioTransporte: 0,
              seguro: true,
              dataEntregaTCE: "2021-12-15",
              dataEntregaPlanoDeAtividades: "2022-01-15",
              relatorios: [],
              aditivos: [],
            },
          ],
          aditivosPendentes: [
            {
              id: "3",
              novaDataTermino: "2023-06-30",
              status: "PENDENTE_APROVACAO",
              descricao: "Extensão do prazo por 6 meses",
            },
          ],
          relatoriosPendentes: [
            {
              id: "4",
              titulo: "Relatório Semestral",
              dataEntregaPrevista: "2024-01-15",
              dataEntregaEfetiva: null,
              statusTexto: "Pendente",
              statusCor: "yellow",
            },
          ],
          conclusoesPendentes: [
            {
              id: "5",
              statusEstagio: "PENDENTE_CONCLUSAO",
              alunoNomeCompleto: "Patrick Souza Teles",
              matricula: "11223344",
              orientadorNomeCompleto: "Eduardo Pelli",
              concedente: "Casa Bom Jesus",
              supervisor: "Ana Costa",
              formacaoSupervisor: "Administradora",
              dataInicio: "2021-12-03",
              dataTermino: "2022-12-03",
              cargaHorariaSemanal: 25,
              valorBolsa: 700,
              auxilioTransporte: true,
              valorAuxilioTransporte: 150,
              seguro: true,
              dataEntregaTCE: "2021-12-15",
              dataEntregaPlanoDeAtividades: "2022-01-15",
              relatorios: [],
              aditivos: [],
            },
          ],
          rescisoesPendentes: [
            {
              id: "6",
              statusEstagio: "PENDENTE_RESCISAO",
              alunoNomeCompleto: "Hudson Bahia",
              matricula: "55667788",
              orientadorNomeCompleto: "Eduardo Pelli",
              concedente: "Oficina de Redes LTDA",
              supervisor: "Carlos Lima",
              formacaoSupervisor: "Técnico em TI",
              dataInicio: "2021-12-03",
              dataTermino: "2022-12-03",
              cargaHorariaSemanal: 30,
              valorBolsa: 900,
              auxilioTransporte: true,
              valorAuxilioTransporte: 180,
              seguro: true,
              dataEntregaTCE: "2021-12-15",
              dataEntregaPlanoDeAtividades: "2022-01-15",
              relatorios: [],
              aditivos: [],
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendencias();
  }, []);

  // Funções para converter dados da API para formato da tabela
  const convertEstagioToTableData = (estagio: EstagioResponseDTO): Estagio => ({
    id: estagio.id,
    nome: estagio.alunoNomeCompleto,
    dataInicio: new Date(estagio.dataInicio).toLocaleDateString("pt-BR"),
    concedente: estagio.concedente,
    professor: estagio.orientadorNomeCompleto,
    status: getStatusText(estagio.statusEstagio),
  });

  const convertAditivoToTableData = (aditivo: AditivoResponseDTO): Estagio => ({
    id: aditivo.id,
    nome: "Aditivo", // Nome será substituído pelo aluno relacionado se disponível
    dataInicio: new Date(aditivo.novaDataTermino).toLocaleDateString("pt-BR"),
    concedente: aditivo.descricao,
    professor: "Eduardo Pelli", // Temporário até ter dados relacionados
    status: aditivo.status,
  });

  const convertRelatorioToTableData = (
    relatorio: RelatorioResponseDTO,
  ): Estagio => ({
    id: relatorio.id,
    nome: relatorio.titulo,
    dataInicio: new Date(relatorio.dataEntregaPrevista).toLocaleDateString(
      "pt-BR",
    ),
    concedente: "Relatório",
    professor: "Eduardo Pelli", // Temporário até ter dados relacionados
    status: relatorio.statusTexto,
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "AGUARDANDO_CONFIRMACAO":
        return "Aguardando Confirmação";
      case "PENDENTE_CONCLUSAO":
        return "Conclusão Pendente";
      case "PENDENTE_RESCISAO":
        return "Rescisão Pendente";
      case "PENDENTE_APROVACAO":
        return "Aditivo pendente de aprovação";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Aguardando") || status.includes("AGUARDANDO"))
      return "text-orange-600 bg-orange-50";
    if (
      status.includes("Aditivo") ||
      status.includes("Rescisão") ||
      status.includes("Relatório") ||
      status.includes("PENDENTE_APROVACAO") ||
      status.includes("PENDENTE_RESCISAO")
    ) {
      return "text-blue-600 bg-blue-50";
    }
    if (status.includes("Conclusão") || status.includes("PENDENTE_CONCLUSAO"))
      return "text-green-600 bg-green-50";
    if (status.includes("Pendente")) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const renderTable = (
    data: Estagio[],
    title: string,
    currentPage: number,
    setCurrentPage: (page: number) => void,
    tipo?: TipoAcaoEstagio,
  ) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Nome:
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Data Início
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Concedente:
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Professor:
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((estagio) => (
                <tr key={estagio.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      {estagio.nome}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">
                        {estagio.dataInicio}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {estagio.concedente}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {estagio.professor}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        estagio.status,
                      )}`}
                    >
                      {estagio.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          if (!tipo) return;
                          setSelectedEstagio({
                            id: estagio.id,
                            tipo,
                          });
                        }}
                        className=" cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* <button
                        className="cursor-pointer p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Aprovar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Rejeitar"
                      >
                        <X className="w-4 h-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação - só mostra se houver mais de 3 itens */}
        {data.length > 3 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 ${
                      currentPage === page
                        ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5"
              >
                <span>Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-500">Carregando pendências...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <>
            {dashboardData.estagiosPendentes.length > 0 &&
              renderTable(
                dashboardData.estagiosPendentes.map(convertEstagioToTableData),
                "Novos Estágios:",
                currentPageNovos,
                setCurrentPageNovos,
                "novo",
              )}

            {dashboardData.aditivosPendentes.length > 0 &&
              renderTable(
                dashboardData.aditivosPendentes.map(convertAditivoToTableData),
                "Aditivos Pendentes:",
                currentPageAditivos,
                setCurrentPageAditivos,
              )}

            {dashboardData.relatoriosPendentes.length > 0 &&
              renderTable(
                dashboardData.relatoriosPendentes.map(
                  convertRelatorioToTableData,
                ),
                "Relatórios Pendentes:",
                currentPageRelatorios,
                setCurrentPageRelatorios,
              )}

            {dashboardData.rescisoesPendentes.length > 0 &&
              renderTable(
                dashboardData.rescisoesPendentes.map(convertEstagioToTableData),
                "Rescisões Pendentes:",
                currentPageRescisoes,
                setCurrentPageRescisoes,
                "rescisao",
              )}

            {dashboardData.conclusoesPendentes.length > 0 &&
              renderTable(
                dashboardData.conclusoesPendentes.map(
                  convertEstagioToTableData,
                ),
                "Estágios a Concluir:",
                currentPageConcluir,
                setCurrentPageConcluir,
                "conclusao",
              )}

            {/* Mensagem quando não há pendências */}
            {dashboardData.estagiosPendentes.length === 0 &&
              dashboardData.aditivosPendentes.length === 0 &&
              dashboardData.relatoriosPendentes.length === 0 &&
              dashboardData.rescisoesPendentes.length === 0 &&
              dashboardData.conclusoesPendentes.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    Não há pendências no momento
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      {/* Modal único para todos os estágios */}
      {selectedeEstagio && (
        <AprovarEstagioModal
          isOpen={!!selectedeEstagio}
          onClose={() => setSelectedEstagio(null)}
          estagioId={selectedeEstagio.id}
          tipo={selectedeEstagio.tipo}
        />
      )}
    </div>
  );
}
