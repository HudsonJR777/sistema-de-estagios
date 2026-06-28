import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Ellipsis,
  ListCollapse,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import OrientadosDados from "./OrientadosDados";

interface Relatorio {
  id: string;
  titulo: string;
  dataEntregaPrevista: string;
  dataEntregaEfetiva: string | null;
  statusTexto: string;
  statusCor: string;
}

interface EstagioData {
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

interface OrientadosCardProps {
  estagios: EstagioData[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "REPROVADO":
    case "CANCELADO":
      return "text-red-600 bg-red-50 border border-red-200";
    case "ATIVO":
    case "EM_ANALISE":
      return "text-green-600 bg-green-50 border border-green-200";
    case "CONCLUIDO":
    case "FINALIZADO":
      return "text-blue-600 bg-blue-50 border border-blue-200";
    case "PENDENTE":
      return "text-yellow-600 bg-yellow-50 border border-yellow-200";
    default:
      return "text-gray-600 bg-gray-50 border border-gray-200";
  }
};

const formatStatus = (status: string) => {
  switch (status.toUpperCase()) {
    case "EM_ANALISE":
      return "Em Análise";
    case "CONCLUIDO":
      return "Concluído";
    case "ATIVO":
      return "Ativo";
    case "REPROVADO":
      return "Reprovado";
    case "CANCELADO":
      return "Cancelado";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function OrientadosCard({
  estagios,
  loading,
  error,
  onRefresh,
}: OrientadosCardProps) {
  const [showModal, setShowModal] = useState<{ [key: string]: boolean }>({});
  const [showModalDetails, setShowModalDetails] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedEstagio, setSelectedEstagio] = useState<EstagioData | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const toggleModal = (id: string) => {
    console.log("Toggle modal for ID:", id); // Debug
    console.log("Current showModal state before toggle:", showModal); // Debug
    setShowModal((prev) => {
      const newState = {
        ...prev,
        [id]: !prev[id],
      };
      console.log("New showModal state after toggle:", newState); // Debug
      return newState;
    });
  };

  const closeModal = (id: string) => {
    setShowModal((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const openDetailsModal = (estagio: EstagioData) => {
    setSelectedEstagio(estagio);
    // Fecha o dropdown modal
    closeModal(estagio.id);
    // Abre o modal de detalhes
    setShowModalDetails((prev) => ({
      ...prev,
      [estagio.id]: true,
    }));
  };

  const closeDetailsModal = (id: string) => {
    setShowModalDetails((prev) => ({
      ...prev,
      [id]: false,
    }));
    setSelectedEstagio(null);
  };

  const handleDeleteClick = async (estagio: EstagioData) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o estágio de ${estagio.alunoNomeCompleto}?`,
      )
    ) {
      try {
        setDeleteLoading(estagio.id);
        // TODO: Implementar rota de delete quando estiver disponível
        // await api.delete(`/api/estagios/${estagio.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        //   },
        // });

        console.log(
          `Deletar estágio ${estagio.id} - ${estagio.alunoNomeCompleto}`,
        );
        alert("Funcionalidade de exclusão será implementada em breve");

        closeModal(estagio.id);
        // onRefresh(); // Recarregar dados após deletar
      } catch (error) {
        console.error("Erro ao deletar estágio:", error);
        alert("Erro ao deletar estágio. Tente novamente.");
      } finally {
        setDeleteLoading(null);
      }
    } else {
      closeModal(estagio.id);
    }
  };

  // Função para determinar a posição do modal baseado no índice da linha
  const getModalPosition = (index: number) => {
    // Para as primeiras duas linhas, abrir para baixo
    if (index <= 1) {
      return "absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50";
    }
    // Para as últimas linhas, abrir para cima
    return "absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50";
  };

  console.log("ShowModal state:", showModal); // Debug
  console.log("Estagios data:", estagios); // Debug

  // Estados de loading e error
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#605BFF]"></div>
          <span className="ml-4 text-gray-500">Carregando orientandos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex flex-col justify-center items-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#605BFF] text-white rounded-md hover:bg-[#504EDD] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-y-auto h-[800px]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Orientandos ({estagios.length})
          </h2>
          <button
            onClick={onRefresh}
            className="cursor-pointer text-[16px] px-3 py-1 bg-[#605BFF] text-white rounded-md hover:bg-[#504EDD] transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {estagios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Nenhum orientando encontrado</p>
        </div>
      ) : (
        <Table className="">
          <TableHeader className="">
            <TableRow className="border-b">
              <TableHead className="font-medium text-gray-700">
                Matrícula
              </TableHead>
              <TableHead className="font-medium text-gray-700">Nome</TableHead>
              <TableHead className="font-medium text-gray-700">
                Professor Orientador
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                Início
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                Término
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-center">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estagios.map((estagio, index) => (
              <TableRow key={estagio.id} className="border-b hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {estagio.matricula}
                </TableCell>
                <TableCell className="text-gray-900">
                  {estagio.alunoNomeCompleto}
                </TableCell>
                <TableCell className="text-gray-700">
                  {estagio.orientadorNomeCompleto}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">
                      {formatDate(estagio.dataInicio)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">
                      {formatDate(estagio.dataTermino)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      estagio.statusEstagio,
                    )}`}
                  >
                    {formatStatus(estagio.statusEstagio)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 items-end justify-center">
                    <button
                      onClick={() => openDetailsModal(estagio)}
                      className="cursor-pointer flex items-center gap-2  px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ListCollapse className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(estagio)}
                      className="cursor-pointer flex items-center gap-2  px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      disabled={deleteLoading === estagio.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
                {/* <TableCell className="relative">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleModal(estagio.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative z-10"
                      disabled={deleteLoading === estagio.id}
                    >
                      {deleteLoading === estagio.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      ) : (
                        <Ellipsis className="w-5 h-5" />
                      )}
                    </button>

                    {showModal[estagio.id] && (
                      <>
                        {console.log(
                          "Rendering modal for estagio:",
                          estagio.id
                        )}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => closeModal(estagio.id)}
                        />

                        <div className={getModalPosition(index)}>
                          <div className="py-2">
                           
                           
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal de Detalhes Completo */}
      {Object.entries(showModalDetails).map(
        ([estagioId, isOpen]) =>
          isOpen &&
          selectedEstagio && (
            <div
              style={{
                background: "rgba(0,0,0,0.6)",
              }}
              key={`details-${estagioId}`}
              className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-blend-hard-light bg-opacity-10"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative">
                <button
                  onClick={() => closeDetailsModal(estagioId)}
                  className="absolute top-0.5 right-1 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
                <OrientadosDados estagio={selectedEstagio} />
              </div>
            </div>
          ),
      )}
    </div>
  );
}
