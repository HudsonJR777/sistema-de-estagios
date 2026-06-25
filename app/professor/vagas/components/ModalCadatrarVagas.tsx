"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/src/services/api";

interface ModalCadastrarVagasProps {
  isOpen: boolean;
  onClose: () => void;
  onVagaCadastrada: () => void;
}

export default function ModalCadastrarVagas({
  isOpen,
  onClose,
  onVagaCadastrada,
}: ModalCadastrarVagasProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    linkVaga: "",
    linkPdf: "",
    dataPublicacao: "",
    dataEncerramento: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.titulo.trim()) {
      return "O campo 'Título da Vaga' é obrigatório.";
    }
    if (!formData.descricao.trim()) {
      return "O campo 'Descrição da Vaga' é obrigatório.";
    }
    if (!formData.linkVaga.trim()) {
      return "O campo 'Link da Vaga' é obrigatório.";
    }
    if (!formData.linkPdf.trim()) {
      return "O campo 'Link do PDF' é obrigatório.";
    }
    return "";
  };

  const cadastrarVaga = async () => {
    setErrorMessage("");
    setIsLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        urlVaga: formData.linkVaga,
        urlPdfDrive: formData.linkPdf,
      };

      const response = await api.post(`/api/vagas-estagio/criar`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Vaga cadastrada com sucesso:", response.data);

      onVagaCadastrada();

      // Limpa os campos do formulário para o próximo envio
      setFormData({
        titulo: "",
        descricao: "",
        linkVaga: "",
        linkPdf: "",
        dataPublicacao: "",
        dataEncerramento: "",
      });

      onClose();
    } catch (error: any) {
      console.error("Erro ao cadastrar vaga:", error);
      if (error?.response?.status === 403) {
        setErrorMessage(
          "Você não tem permissão para cadastrar vagas. Verifique seu token ou permissões.",
        );
      } else if (error?.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erro ao cadastrar vaga. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    cadastrarVaga();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-[24px] w-full max-w-[600px] p-8 shadow-lg max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[28px] font-bold text-[#030229]">
            Cadastrar Nova Vaga
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#FF6B6B] hover:bg-[#FFE5E5] p-2 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Título da Vaga */}
          <div className="flex flex-col gap-2">
            <label className="text-[20px] font-semibold text-[#030229]">
              Título da Vaga:
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Nome da vaga"
              className="px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] placeholder-[#A5ABD0] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE]"
            />
          </div>

          {/* Descrição da Vaga */}
          <div className="flex flex-col gap-2">
            <label className="text-[20px] font-semibold text-[#030229]">
              Descrição da Vaga
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição da vaga, responsabilidades, requisitos, etc."
              rows={4}
              className="px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] placeholder-[#A5ABD0] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE] resize-none"
            />
          </div>

          {/* Link da Vaga */}
          <div className="flex flex-col gap-2">
            <label className="text-[20px] font-semibold text-[#030229]">
              Link da Vaga:
            </label>
            <input
              type="url"
              name="linkVaga"
              value={formData.linkVaga}
              onChange={handleChange}
              placeholder="Link para candidatura ou página da vaga"
              className="px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] placeholder-[#A5ABD0] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE]"
            />
          </div>

          {/* Link do PDF */}
          <div className="flex flex-col gap-2">
            <label className="text-[20px] font-semibold text-[#030229]">
              Link do PDF:
            </label>
            <input
              type="url"
              name="linkPdf"
              value={formData.linkPdf}
              onChange={handleChange}
              placeholder="Link para descrição detalhada em PDF"
              className="px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] placeholder-[#A5ABD0] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE]"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[20px] font-semibold text-[#030229]">
                Data de Publicação
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dataPublicacao"
                  value={formData.dataPublicacao}
                  onChange={handleChange}
                  className="cursor-pointer w-full px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[20px] font-semibold text-[#030229]">
                Data de Encerramento
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dataEncerramento"
                  value={formData.dataEncerramento}
                  onChange={handleChange}
                  className="cursor-pointer w-full px-4 py-3 border border-[#E8EAF7] rounded-[12px] text-[18px] text-[#4B507A] focus:outline-none focus:border-[#5B5DFF] bg-[#F8F9FE]"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="cursor-pointer flex-1 bg-gradient-to-r from-[#5B5DFF] to-[#7E1CFF] text-white font-semibold py-3 px-6 rounded-[12px] hover:brightness-110 transition duration-200 shadow-[0_10px_30px_rgba(91,93,255,0.25)] disabled:opacity-60"
            >
              {isLoading ? "Publicando..." : "Publicar Vaga"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 border-2 border-[#5B5DFF] text-[#5B5DFF] font-semibold py-3 px-6 rounded-[12px] hover:bg-[#F0F1FF] transition duration-200"
            >
              Cancelar
            </button>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 mt-3">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
