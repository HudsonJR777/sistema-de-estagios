"use client";

import { useState } from "react";
import Image from "next/image";
import CardVagas from "@/app/professor/vagas/components/CardVagas";
import ModalCadastrarVagas from "@/app/professor/vagas/components/ModalCadatrarVagas";

export default function CoordenadorVagasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen space-y-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-black text-[32px] font-bold leading-8 mb-2">
            Mural de Vagas
          </h1>
        </div>
        <Image
          src="/assets/bannerMuralDeVagas.png"
          alt="Hebreus 13:8 - O mesmo ontem, hoje e para todo o sempre."
          width={1200}
          height={300}
          quality={100}
          priority
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CardVagas />
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer fixed bottom-6 right-[48px] rounded-[10px] 
        bg-gradient-to-r from-[#5B5DFF] to-[#7E1CFF] px-6 py-4 text-2xl font-semibold 
        text-white  transition duration-200 hover:brightness-110"
      >
        Adicionar Vaga
      </button>

      <ModalCadastrarVagas
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
