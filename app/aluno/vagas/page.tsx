"use client";

import { useState } from "react";
import Image from "next/image";
import CardVagas from "@/app/professor/vagas/components/CardVagas";

export default function AlunoVagasPage() {
  const [vagasSignal] = useState(0);

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
      <div className="w-full">
        <CardVagas refreshSignal={vagasSignal} />
      </div>
    </section>
  );
}
