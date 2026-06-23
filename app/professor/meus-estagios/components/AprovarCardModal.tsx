"use client";

interface Relatorio {
  id: string;
  estagioId?: string;
  titulo: string;
  dataEntregaPrevista: string;
  dataEntregaEfetiva: string | null;
  statusTexto: string;
  statusCor: string;
}

interface EstagioData {
  estagioId: string;
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

interface AprovarCardModalProps {
  estagio: EstagioData;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function AprovarCardModal({
  estagio,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: AprovarCardModalProps) {
  if (!isOpen) return null;

  const fields = [
    {
      label: "Nome:",
      value: estagio.alunoNomeCompleto,
    },
    {
      label: "Orientador:",
      value: estagio.orientadorNomeCompleto,
    },
    {
      label: "Concedente:",
      value: estagio.concedente,
    },
    {
      label: "Supervisor:",
      value: estagio.supervisor,
    },
    {
      label: "Data de Início:",
      value: formatDate(estagio.dataInicio),
    },
    {
      label: "Data de Término:",
      value: formatDate(estagio.dataTermino),
    },
    {
      label: "Carga horária semanal:",
      value: `${estagio.cargaHorariaSemanal}h`,
    },
    {
      label: "Valor da bolsa:",
      value: formatCurrency(estagio.valorBolsa),
    },
    {
      label: "Auxílio transporte:",
      value: formatCurrency(estagio.valorAuxilioTransporte),
    },
    {
      label: "Seguro:",
      value: estagio.seguro ? "Sim" : "Não",
    },
    {
      label: "TCE:",
      value: estagio.dataEntregaTCE ? "Enviado" : "Pendente",
    },
    {
      label: "Plano De Atividades:",
      value: estagio.dataEntregaPlanoDeAtividades ? "Enviado" : "Pendente",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Dados do Estágio
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600 min-w-0 flex-shrink-0 mr-4">
                  {field.label}
                </span>
                <span className="text-sm text-gray-900 text-right flex-1 break-words">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reprovar
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
