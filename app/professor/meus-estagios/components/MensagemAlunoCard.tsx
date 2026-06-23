"use client";

import api from "@/src/services/api";
import { useState } from "react";

interface IMensagemAlunoCardProps {
  onClose: () => void;
  estagioId: string;
}

export default function MensagemAlunoCard({
  onClose,
  estagioId,
}: IMensagemAlunoCardProps) {
  const [mensagem, setMensagem] = useState({
    titulo: "",
    descricao: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setMensagem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnviarMensagem = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post(
        `/api/notificacoes/${estagioId}/enviar-mensagem`,
        {
          titulo: mensagem.titulo,
          descricao: mensagem.descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        },
      );

      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-[24px] bg-[#F5F5F7] p-12 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <h2 className="text-[42px] font-semibold text-[#15153D]">
          Mensagem Aluno
        </h2>

        <button
          onClick={onClose}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#F3E9EC] transition hover:bg-[#eedde1]"
        >
          <span className="text-3xl text-[#F0556B]">×</span>
        </button>
      </div>

      {/* Mensagem */}
      <div className="mb-8">
        <input
          type="text"
          name="titulo"
          onChange={handleChange}
          value={mensagem.titulo}
          className="border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mb-4 w-full rounded-2xl border bg-[#FAFAFB] p-6 text-2xl font-medium placeholder-[#A5ABD0] transition focus:outline-none focus:ring-2 focus:ring-[#5B5BF5] focus:ring-offset-2"
        />

        <textarea
          name="descricao"
          rows={4}
          value={mensagem.descricao}
          onChange={handleChange}
          placeholder="Deixe uma mensagem para o aluno"
          className="w-full rounded-2xl bg-[#FAFAFB] p-6 text-xl text-[#2D2D4D] placeholder-[#A5ABD0] transition focus:outline-none focus:ring-2 focus:ring-[#5B5BF5] focus:ring-offset-2"
        />
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-6">
        <button
          onClick={onClose}
          className="cursor-pointer rounded-2xl border border-[#DADAF3] bg-white px-10 py-4 text-2xl font-medium text-[#5B5BF5] transition hover:bg-gray-50"
        >
          Cancelar
        </button>

        <button
          onClick={handleEnviarMensagem}
          disabled={loading || !mensagem.descricao.trim()}
          className="cursor-pointer rounded-2xl bg-[#5B5BF5] px-10 py-4 text-2xl font-medium text-white transition hover:bg-[#4a4ae8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
}
