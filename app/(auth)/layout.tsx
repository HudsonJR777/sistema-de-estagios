import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Autenticação - Sistema de Estágios",
  description: "Login e cadastro no sistema de estágios",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center gap-[164px]">
      <div className="min-h-screen flex items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Image
                src="/assets/logo.svg"
                alt="Hebreus 13:8 - O mesmo ontem, hoje e para todo o sempre."
                width={80}
                height={40}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Entrar na Conta
            </h1>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            {children}
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            © 2024 Sistema de Estágios. Todos os direitos reservados.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Image
          src="/assets/cadastropage.svg"
          alt="Hebreus 13:8 - O mesmo ontem, hoje e para todo o sempre."
          width={693}
          height={472}
        />
      </div>
    </div>
  );
}
