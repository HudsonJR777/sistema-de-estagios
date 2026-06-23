"use client";

import {
  Ellipsis,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  CheckLine,
  Ban,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/src/services/api";
import StageReportTracker from "./stagereportTracker";
import ConcluirEstagioModal from "./ConcluirEstagioModal";
import RescendirEstagioModal from "./RescendirEstagioModal";

interface InternshipData {
  id: string;
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
  relatorios: any[];
  aditivos: any[];
}

interface EstagioUpdateDTO {
  id: string;
  orientadorId: string;
  concedente: string;
  supervisor: string;
  formacaoSupervisor: string;
  dataInicio: string;
  dataTermino: string;
  cargaHoraria: number;
  valorBolsa: number;
  auxilioTransporte: boolean;
  valorAuxilioTransporte: number;
  seguro: boolean;
  dataEntregaTCE: string;
  dataEntregaPlanoAtividade: string;
}

export default function InternshipData() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<InternshipData>>({});
  const [showModalConcluir, setShowModalConcluir] = useState(false);
  const [showModalRescindir, setShowModalRescindir] = useState(false);

  // Carregar dados da API ao inicializar
  useEffect(() => {
    const fetchInternshipData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/alunos/meus-estagios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (response.data && response.data.length > 0) {
          const internshipData = response.data[0]; // Pegar posição 0 como especificado
          setData(internshipData);
          setEditedData(internshipData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        setError("Erro ao carregar dados do estágio");
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipData();
  }, []);

  const handleEditClick = () => {
    if (data) {
      setIsEditing(true);
      setEditedData({ ...data });
      setShowModal(false);
    }
  };

  const handleSave = async () => {
    if (!data || !editedData) return;

    try {
      setLoading(true);

      // Criar DTO no formato esperado pela API Java
      const updateDTO: EstagioUpdateDTO = {
        id: data.id,
        orientadorId: "", //implementar a lógica para obter o ID do orientador
        concedente: editedData.concedente || data.concedente,
        supervisor: editedData.supervisor || data.supervisor,
        formacaoSupervisor:
          editedData.formacaoSupervisor || data.formacaoSupervisor || "",
        dataInicio: editedData.dataInicio || data.dataInicio,
        dataTermino: editedData.dataTermino || data.dataTermino,
        cargaHoraria:
          editedData.cargaHorariaSemanal || data.cargaHorariaSemanal,
        valorBolsa: editedData.valorBolsa || data.valorBolsa,
        auxilioTransporte:
          editedData.auxilioTransporte !== undefined
            ? editedData.auxilioTransporte
            : data.auxilioTransporte,
        valorAuxilioTransporte:
          editedData.valorAuxilioTransporte || data.valorAuxilioTransporte,
        seguro:
          editedData.seguro !== undefined ? editedData.seguro : data.seguro,
        dataEntregaTCE: editedData.dataEntregaTCE || data.dataEntregaTCE,
        dataEntregaPlanoAtividade:
          editedData.dataEntregaPlanoDeAtividades ||
          data.dataEntregaPlanoDeAtividades,
      };

      const response = await api.patch(
        `/api/estagios/${data.id}/atualizar`,
        updateDTO,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        },
      );

      // Atualizar os dados principais com os dados editados
      const updatedData = { ...data, ...editedData };
      setData(updatedData);
      setIsEditing(false);

      console.log("Dados atualizados com sucesso:", response.data);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      alert("Erro ao atualizar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (data) {
      setEditedData({ ...data });
    }
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    console.log("Apagar clicado");
    setShowModal(false);
    //adicionar a lógica para apagar
  };

  const handleInputChange = (
    field: keyof InternshipData,
    value: string | number | boolean,
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fields = [
    {
      key: "alunoNomeCompleto" as keyof InternshipData,
      label: "Aluno:",
      type: "text",
      readonly: true,
    },
    {
      key: "orientadorNomeCompleto" as keyof InternshipData,
      label: "Orientador:",
      type: "text",
      readonly: true,
    },
    {
      key: "concedente" as keyof InternshipData,
      label: "Concedente:",
      type: "text",
      readonly: false,
    },
    {
      key: "supervisor" as keyof InternshipData,
      label: "Supervisor:",
      type: "text",
      readonly: false,
    },
    {
      key: "formacaoSupervisor" as keyof InternshipData,
      label: "Formação do Supervisor:",
      type: "text",
      readonly: false,
    },
    {
      key: "dataInicio" as keyof InternshipData,
      label: "Data de Início:",
      type: "date",
      readonly: false,
    },
    {
      key: "dataTermino" as keyof InternshipData,
      label: "Data de Término:",
      type: "date",
      readonly: false,
    },
    {
      key: "cargaHorariaSemanal" as keyof InternshipData,
      label: "Carga Horária Semanal:",
      type: "number",
      readonly: false,
    },
    {
      key: "valorBolsa" as keyof InternshipData,
      label: "Valor da Bolsa:",
      type: "number",
      readonly: false,
    },
    {
      key: "auxilioTransporte" as keyof InternshipData,
      label: "Auxílio Transporte:",
      type: "boolean",
      readonly: false,
    },
    {
      key: "valorAuxilioTransporte" as keyof InternshipData,
      label: "Valor Auxílio Transporte:",
      type: "number",
      readonly: false,
    },
    {
      key: "seguro" as keyof InternshipData,
      label: "Seguro:",
      type: "boolean",
      readonly: false,
    },
    {
      key: "dataEntregaTCE" as keyof InternshipData,
      label: "Data Entrega TCE:",
      type: "date",
      readonly: false,
    },
    {
      key: "dataEntregaPlanoDeAtividades" as keyof InternshipData,
      label: "Data Entrega Plano:",
      type: "date",
      readonly: false,
    },
    {
      key: "statusEstagio" as keyof InternshipData,
      label: "Status:",
      type: "text",
      readonly: true,
    },
  ];

  return (
    <div className="flex items-start justify-between xl1:gap-40">
      <section className="w-[460px] xl1:w-[500px] bg-white rounded-[12px] shadow-md relative">
        <div className="flex justify-between items-center py-5 px-6">
          <h1 className="text-black text-[24px] leading-5">
            Dados dos Estágios
          </h1>

          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          ) : isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowModal(!showModal)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Ellipsis className="w-5 h-5" />
              </button>

              {showModal && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowModal(false)}
                  />

                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      <button
                        onClick={handleEditClick}
                        className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4 cursor-pointer" />
                        Editar
                      </button>
                      <button
                        onClick={() => setShowModalConcluir(true)}
                        className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <CheckLine className="w-4 h-4" />
                        Concluir
                      </button>
                      {showModalConcluir && (
                        <ConcluirEstagioModal
                          isOpen={showModalConcluir}
                          onClose={() => setShowModalConcluir(false)}
                          onSuccess={() => {}}
                          estagioId={data.id}
                        />
                      )}
                      <button
                        onClick={() => setShowModalRescindir(true)}
                        className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        Rescindir
                      </button>
                      {showModalRescindir && (
                        <RescendirEstagioModal
                          isOpen={showModalRescindir}
                          onClose={() => setShowModalRescindir(false)}
                          onSuccess={() => {}}
                          estagioId={data.id}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="py-5 px-6">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="cursor-pointer mt-2 px-4 py-2 bg-[#605BFF] text-white rounded-md hover:bg-[#5048E5] transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605BFF] mx-auto mb-4" />
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : !data ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum estágio encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] text-gray-500">
                    Campo
                  </TableHead>
                  <TableHead className="text-gray-500">Informação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => {
                  const currentValue = data[field.key];
                  const editedValue = editedData[field.key];
                  const displayValue = isEditing
                    ? editedValue !== undefined
                      ? editedValue
                      : currentValue
                    : currentValue;

                  return (
                    <TableRow key={field.key}>
                      <TableCell className="font-medium">
                        {field.label}
                      </TableCell>
                      <TableCell>
                        {isEditing && !field.readonly ? (
                          field.type === "boolean" ? (
                            <select
                              value={displayValue ? "true" : "false"}
                              onChange={(e) =>
                                handleInputChange(
                                  field.key,
                                  e.target.value === "true",
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent"
                            >
                              <option value="true">Sim</option>
                              <option value="false">Não</option>
                            </select>
                          ) : (
                            <input
                              type={
                                field.type === "date"
                                  ? "date"
                                  : field.type === "number"
                                    ? "number"
                                    : "text"
                              }
                              value={
                                field.type === "number"
                                  ? typeof displayValue === "number"
                                    ? displayValue
                                    : ""
                                  : typeof displayValue === "string"
                                    ? displayValue
                                    : ""
                              }
                              onChange={(e) => {
                                const value =
                                  field.type === "number"
                                    ? e.target.value
                                      ? parseFloat(e.target.value)
                                      : 0
                                    : e.target.value;
                                handleInputChange(field.key, value);
                              }}
                              step={
                                field.type === "number" ? "0.01" : undefined
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent"
                            />
                          )
                        ) : (
                          <span>
                            {field.type === "boolean"
                              ? displayValue
                                ? "Sim"
                                : "Não"
                              : field.type === "number"
                                ? typeof displayValue === "number"
                                  ? displayValue.toLocaleString("pt-BR", {
                                      minimumFractionDigits:
                                        field.key.includes("valor") ||
                                        field.key.includes("Valor")
                                          ? 2
                                          : 0,
                                      maximumFractionDigits:
                                        field.key.includes("valor") ||
                                        field.key.includes("Valor")
                                          ? 2
                                          : 0,
                                    })
                                  : "N/A"
                                : field.type === "date"
                                  ? displayValue
                                    ? new Date(
                                        displayValue + "T00:00:00",
                                      ).toLocaleDateString("pt-BR")
                                    : "N/A"
                                  : displayValue || "N/A"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
      <StageReportTracker
        relatorios={data?.relatorios || []}
        loading={loading}
      />
    </div>
  );
}
