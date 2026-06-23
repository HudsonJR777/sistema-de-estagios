"use client";

import { X, Link as LinkIcon, FileText } from "lucide-react";

interface ModalDetalhesVagasProps {
  isOpen: boolean;
  onClose: () => void;
  vaga?: {
    titulo: string;
    descricao: string;
    requisitos: string[];
    dataPublicacao: string;
    criador: string;
    linkVaga: string;
    linkPdf: string;
  };
}

export default function ModalDetalhesVagas({
  isOpen,
  onClose,
  vaga = {
    titulo: "Estágio em Social Média",
    descricao:
      "Estamos em busca de um(a) profissional criativo(a), organizado(a) e conectado(a) às tendências digitais para atuar como Social Media.",
    requisitos: [
      "Boa comunicação escrita e criatividade;",
      "Conhecimento das principais redes sociais;",
      "Organização e capacidade de planejamento;",
      "Noções de marketing digital e produção de conteúdo;",
      "Experiência na área será um diferencial.",
    ],
    dataPublicacao: "10/01/2026",
    criador: "Cinthya",
    linkVaga: "https://www.empresa.com.br/trabalhe-conosco",
    linkPdf: "https://drive.google.com/file/d/xxxxx/view",
  },
}: ModalDetalhesVagasProps) {
  if (!isOpen) return null;

  const getFirstName = (fullName: string): string => {
    if (!fullName) return "Usuário";

    const firstName = fullName.trim().split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-[24px] font-bold text-[#030229]">
            Vaga: {vaga.titulo}
          </h1>
          <button
            onClick={onClose}
            className="cursor-pointer text-[#FF6B6B] hover:bg-[#FFE5E5] p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <p className="text-[14px] text-[#4B507A] leading-6">
            {vaga.descricao}
          </p>
        </div>

        {/* Requisitos */}
        <div className="mb-6">
          <h2 className="text-[16px] font-semibold text-[#030229] mb-3">
            Requisitos:
          </h2>
          <ul className="space-y-2">
            {vaga.requisitos.map((requisito, index) => (
              <li
                key={index}
                className="text-[14px] text-[#4B507A] leading-6 flex items-start gap-3"
              >
                <span className="text-[#5B5DFF] mt-1">•</span>
                {requisito}
              </li>
            ))}
          </ul>
        </div>

        {/* Data de Publicação */}
        <div className="mb-6 pb-6 border-b border-[#E8EAF7]">
          <p className="text-[20px] leading-3 text-[#8D92B4]">
            Publicado em {vaga.dataPublicacao} por {vaga.criador}
          </p>
        </div>

        {/* Anexos/Links */}
        <div>
          <h3 className="text-[14px] font-semibold text-[#030229] mb-4">
            Anexos/Links
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={vaga.linkVaga}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B5DFF] to-[#7E1CFF] text-white font-semibold py-3 px-4 rounded-[12px] hover:brightness-110 transition duration-200 shadow-[0_10px_30px_rgba(91,93,255,0.25)]"
            >
              <LinkIcon className="w-5 h-5" />
              Acessar Página da Vaga
            </a>
            <a
              href={vaga.linkPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-[#5B5DFF] text-[#5B5DFF] font-semibold py-3 px-4 rounded-[12px] hover:bg-[#F0F1FF] transition duration-200"
            >
              <FileText className="w-5 h-5" />
              Visualizar Edital (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
