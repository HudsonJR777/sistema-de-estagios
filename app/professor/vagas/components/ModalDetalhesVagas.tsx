"use client";

import { getRoleDisplayName } from "@/src/hooks/roleDisplayName";
import api from "@/src/services/api";
import { X, Link as LinkIcon, FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ModalDetalhesVagasProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

interface ApiResponseVaga {
  id: string;
  titulo: string;
  descricao: string;
  urlVaga: string;
  urlPdfDrive: string;
  dataDePublicacao: string;
}

export default function ModalDetalhesVagas({
  isOpen,
  onClose,
  id,
}: ModalDetalhesVagasProps) {
  const [vaga, setVaga] = useState<ApiResponseVaga | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuário");
  const [userRole, setUserRole] = useState<string>("Usuário");

  const getFirstName = (fullName: string): string => {
    if (!fullName) return "Usuário";

    const firstName = fullName.trim().split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  const formatarData = (data: string) => {
    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
  };

  const fetchDetalhesVaga = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await api.get<ApiResponseVaga>(
        `/api/vagas-estagio/${id}/listar-vaga`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      setVaga(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da vaga:", error);
      setError("Erro ao buscar detalhes da vaga.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser) {
      const firstName = getFirstName(storedUser);
      setUserName(firstName);
    }

    if (storedRole) {
      const roleDisplayName = getRoleDisplayName(storedRole);
      setUserRole(roleDisplayName);
    }

    if (isOpen) {
      fetchDetalhesVaga();
    }
  }, [isOpen, fetchDetalhesVaga]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] p-6 shadow-lg max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-end justify-between mb-6 absolute top-4 right-4 ">
          {/* <h1 className="text-[30px] font-bold text-[#5B5DFF]">
            Detalhes da Vaga
          </h1> */}

          <button
            onClick={onClose}
            className="cursor-pointer text-[#FF6B6B] hover:bg-[#FFE5E5] p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="py-8 text-center">
            <p className="text-[#4B507A]">Carregando vaga...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-[#FF6B6B]">{error}</p>
          </div>
        )}

        {!loading && !error && vaga && (
          <>
            <div className="my-6">
              <h2 className="text-[22px] font-bold text-[#030229]">
                <span className="text-[24px] font-bold text-[#5B5DFF]">
                  Vaga:{" "}
                </span>{" "}
                {vaga.titulo}
              </h2>
            </div>

            <div className="mb-6">
              <h3 className="text-[24px] font-bold text-[#5B5DFF] mb-2">
                Descrição
              </h3>

              <p className="text-[18px] text-[#4B507A] leading-7 whitespace-pre-line">
                {vaga.descricao}
              </p>
            </div>

            <div className="mb-6 pb-6 border-b border-[#E8EAF7]">
              <p className="text-[14px] text-[#8D92B4]">
                Publicado em {formatarData(vaga.dataDePublicacao)} por{" "}
                {userName} ({userRole})
              </p>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-[#030229] mb-4">
                Anexos / Links
              </h3>

              <div className="flex flex-col gap-3">
                {vaga.urlVaga && (
                  <a
                    href={vaga.urlVaga}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B5DFF] to-[#7E1CFF] text-white font-semibold py-3 px-4 rounded-[12px] hover:brightness-110 transition duration-200 shadow-[0_10px_30px_rgba(91,93,255,0.25)]"
                  >
                    <LinkIcon className="w-5 h-5" />
                    Acessar Página da Vaga
                  </a>
                )}

                {vaga.urlPdfDrive && (
                  <a
                    href={vaga.urlPdfDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border-2 border-[#5B5DFF] text-[#5B5DFF] font-semibold py-3 px-4 rounded-[12px] hover:bg-[#F0F1FF] transition duration-200"
                  >
                    <FileText className="w-5 h-5" />
                    Visualizar PDF
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
