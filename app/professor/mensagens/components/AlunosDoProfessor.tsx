"use client";

import { useState, useEffect } from "react";
import { Calendar, MoreHorizontal, Trash2, Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/src/services/api";
import MensagemAlunoCard from "../../meus-estagios/components/MensagemAlunoCard";
import { EstagiosCoordenador } from "@/src/components/role-based/coordenador/EstagiosCoordenador";

interface ApiEstagioData {
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
  relatorios: Array<{
    id: string;
    titulo: string;
    dataEntregaPrevista: string;
    dataEntregaEfetiva: string | null;
    statusTexto: string;
    statusCor: string;
  }>;
  aditivos: Array<{
    id: string;
    novaDataTermino: string;
    status: string;
    descricao: string;
  }>;
}

interface AlunoEstagioData {
  id: string;
  matricula: string;
  nome: string;
  professorOrientador: string;
  dataInicio: string;
  dataTermino: string;
  status:
    | "Ativo"
    | "Concluído"
    | "Rescindido"
    | "Quase vencendo"
    | "Relatório Atrasado";
}

export default function AlunosDoProfessor() {
  const [alunos, setAlunos] = useState<AlunoEstagioData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para mapear status da API para status de exibição
  const mapStatusEstagio = (
    statusEstagio: string,
  ): AlunoEstagioData["status"] => {
    switch (statusEstagio) {
      case "ATIVO":
        return "Ativo";
      case "CONCLUIDO":
        return "Concluído";
      case "RESCINDIDO":
      case "ANALISE_RESCINDIDO":
        return "Rescindido";
      case "VENCENDO":
        return "Quase vencendo";
      case "RELATORIO_ATRASADO":
        return "Relatório Atrasado";
      default:
        return "Ativo";
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Função para transformar dados da API no formato do componente
  const transformApiData = (apiData: ApiEstagioData[]): AlunoEstagioData[] => {
    return apiData.map((estagio) => ({
      id: estagio.id,
      matricula: estagio.matricula,
      nome: estagio.alunoNomeCompleto,
      professorOrientador: estagio.orientadorNomeCompleto,
      dataInicio: formatDate(estagio.dataInicio),
      dataTermino: formatDate(estagio.dataTermino),
      status: mapStatusEstagio(estagio.statusEstagio),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Concluído":
        return "bg-blue-100 text-blue-800";
      case "Rescindido":
        return "bg-red-100 text-red-800";
      case "Quase vencendo":
        return "bg-orange-100 text-orange-800";
      case "Relatório Atrasado":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItem((prev) => (prev === id ? null : id));
  };

  const [showModalMensagem, setShowModalMensagem] = useState(false);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/professores/meus-estagios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        const transformedData = transformApiData(response.data);
        setAlunos(transformedData);
      } catch (error: any) {
        console.error("Erro ao carregar alunos:", error);
        setError(
          error.response?.data?.message ||
            "Erro ao carregar dados dos estágios",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Carregando estágios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header Actions */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          {selectedItem && (
            <>
              <span className="text-sm text-gray-600">1 aluno selecionado</span>
              <button className="cursor-pointer flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                <FileText className="w-4 h-4" />
                Detalhes
              </button>
              <button
                onClick={() => setShowModalMensagem(true)}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                Aprovar
              </button>
              {showModalMensagem && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <MensagemAlunoCard
                    estagioId={
                      alunos.find((aluno) => aluno.id === selectedItem)?.id ||
                      ""
                    }
                    onClose={() => setShowModalMensagem(false)}
                  />
                </div>
              )}
            </>
          )}

          <div className="ml-auto">
            <button className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors">
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12 px-4">Seleção</TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Matrícula ▼
            </TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Nome ▼
            </TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Professor Orientador ▼
            </TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Início ▼
            </TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Término ▼
            </TableHead>
            <TableHead className="font-medium text-gray-700 px-4">
              Status ▼
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id} className="hover:bg-gray-50">
              <TableCell className="px-4">
                <input
                  type="radio"
                  name="selectedAluno"
                  checked={selectedItem === aluno.id}
                  onChange={() => handleSelectItem(aluno.id)}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </TableCell>
              <TableCell className="px-4 font-medium text-gray-900">
                {aluno.matricula}
              </TableCell>
              <TableCell className="px-4 text-gray-700">{aluno.nome}</TableCell>
              <TableCell className="px-4 text-gray-700">
                {aluno.professorOrientador}
              </TableCell>
              <TableCell className="px-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span>{aluno.dataInicio}</span>
                </div>
              </TableCell>
              <TableCell className="px-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span>{aluno.dataTermino}</span>
                </div>
              </TableCell>
              <TableCell className="px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    aluno.status,
                  )}`}
                >
                  {aluno.status}
                </span>
              </TableCell>
              <TableCell className="px-4">
                <button className="cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {alunos.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum estágio encontrado</p>
          <p className="text-sm text-gray-400 mt-1">
            Você ainda não possui alunos orientandos com estágios ativos
          </p>
        </div>
      )}
    </div>
  );
}
