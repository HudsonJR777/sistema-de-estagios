"use client";

import { useState, useEffect } from "react";
import { User, Mail, FileText, Plus, Search, Eye, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/src/services/api";
import CadastrarProfessorModal from "./CadastrarProfessorPage";

interface ProfessorPageProps {
  refreshSignal?: number;
}

interface ProfessorData {
  id: string;
  nome: string;
  emailInstitucional: string;
  siap: string;
  totalEsagiosativos: number;
}

export default function ProfessorPage() {
  const [professores, setProfessores] = useState<ProfessorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModalCadastrar, setShowModalCadastrar] = useState(false);
  const [vagasSignal, setVagasSignal] = useState(0);

  const [refreshSignal, setRefreshSignal] = useState<ProfessorPageProps[]>([]);

  const handleVagaCadastrada = () => {
    setVagasSignal((prev) => prev + 1);
    setRefreshSignal((prev) => [...prev, { refreshSignal: vagasSignal }]);
  };

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/professores/listar");

        // Dados de exemplo baseados na imagem
        setProfessores(response.data);
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
        setError("Erro ao carregar professores");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessores();
  }, [refreshSignal]);

  const filteredProfessores = professores.filter(
    (professor) =>
      professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.emailInstitucional
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-500">Carregando professores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Professores</h1>
          <p className="text-gray-600">
            Gerencie os professores cadastrados no sistema
          </p>
        </div>
        <button
          onClick={() => setShowModalCadastrar(true)}
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#605BFF] hover:bg-[#5048E5] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Professor
        </button>
        {showModalCadastrar && (
          <CadastrarProfessorModal
            isOpen={showModalCadastrar}
            onClose={() => setShowModalCadastrar(false)}
            onVagaCadastrada={handleVagaCadastrada}
          />
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar professor por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-gray-700 px-6 py-3">
                Nome
              </TableHead>
              <TableHead className="font-medium text-gray-700 px-6 py-3">
                Email
              </TableHead>
              <TableHead className="font-medium text-gray-700 px-6 py-3">
                SIAPE
              </TableHead>
              <TableHead className="font-medium text-gray-700 px-6 py-3">
                Estágios
              </TableHead>
              <TableHead className="font-medium text-gray-700 px-6 py-3 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessores.map((professor) => (
              <TableRow key={professor.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {professor.nome}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {professor.emailInstitucional}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-gray-700">{professor.siap}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-[#605BFF] text-[20px]">
                      {professor.totalEsagiosativos}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  text-black ">
                      estágios ativos
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-center flex items-center">
                  <button className="p-2 hover:bg-blue-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-red-200 rounded-lg transition-colors">
                    <Trash className="w-4 h-4 text-gray-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProfessores.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm
                ? "Nenhum professor encontrado"
                : "Nenhum professor cadastrado"}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <User className="w-8 h-8 text-[#605BFF]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total de Professores
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {professores.length < 0 ? 0 : professores.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total de Estágios
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {professores.reduce(
                  (total, prof) => total + prof.totalEsagiosativos,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <User className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Média por Professor
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {professores.length > 0
                  ? Math.round(
                      professores.reduce(
                        (total, prof) => total + prof.totalEsagiosativos,
                        0,
                      ) / professores.length,
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
