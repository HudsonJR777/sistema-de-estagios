"use client";

import { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";
import api from "@/src/services/api";

interface CadastrarProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVagaCadastrada: () => void;
}

interface ProfessorFormData {
  nome: string;
  siap: string;
  emailInstitucional: string;
  senha: string;
}

export default function CadastrarProfessorModal({
  isOpen,
  onClose,
  onVagaCadastrada,
}: CadastrarProfessorModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    siap: "",
    emailInstitucional: "",
    senha: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação básica
      if (
        !formData.nome ||
        !formData.siap ||
        !formData.emailInstitucional ||
        !formData.senha
      ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        setIsLoading(false);
        return;
      }

      const data: ProfessorFormData = {
        nome: formData.nome,
        siap: formData.siap,
        emailInstitucional: formData.emailInstitucional,
        senha: formData.senha,
      };

      const response = await api.post("/api/professores/cadastrar", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Professor cadastrado com sucesso:", response.data);
      onVagaCadastrada();

      // Limpar formulário
      setFormData({
        nome: "",
        siap: "",
        emailInstitucional: "",
        senha: "",
      });

      onClose();
    } catch (error: any) {
      console.error("Erro ao cadastrar professor:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro interno do servidor";

      alert(`Erro ao cadastrar professor: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvarRascunho = () => {
    console.log("Salvando como rascunho:", formData);
    // Implementar lógica de rascunho
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
      }}
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Cadastrar Professor:
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Avatar Section */}
          {/* <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors"
              >
                +
              </button>
            </div>
          </div> */}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Nome e CPF */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome:
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Siape:
                </label>
                <input
                  type="text"
                  name="siap"
                  value={formData.siap}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Login e Senha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="emailInstitucional"
                  value={formData.emailInstitucional}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha:
                </label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#605BFF] focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleSalvarRascunho}
              disabled={isLoading}
              className="flex-1 px-2 py-2 text-[#605BFF] bg-white border border-[#605BFF] rounded-md hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar como Rascunho
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer flex-1 px-2 py-2 bg-[#605BFF] text-white rounded-md hover:bg-[#5048E5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar Professor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
