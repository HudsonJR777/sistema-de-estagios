import { useState } from "react";
import { X } from "lucide-react";

interface ModalMotivoRejeicaoProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

export default function ModalMotivoRejeicao({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: ModalMotivoRejeicaoProps) {
  const [motivo, setMotivo] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!motivo.trim()) {
      alert("Informe o motivo da reprovação.");
      return;
    }

    onConfirm(motivo);
    setMotivo("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Motivo da Reprovação</h2>

          <button className="cursor-pointer  " onClick={onClose}>
            <X className="w-8 h-8 hover:text-red-700" />
          </button>
        </div>

        <label className="block text-xl font-medium text-gray-700 mb-2">
          Informe o motivo que será enviado ao aluno:
        </label>

        <textarea
          rows={6}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 resize-none focus:ring-2 focus:ring-[#605BFF] outline-none"
          placeholder="Digite o motivo da reprovação..."
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer text-[18px]"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white text-[18px] px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Enviando..." : "Confirmar Reprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}
