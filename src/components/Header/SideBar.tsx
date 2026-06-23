"use client";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Grip,
  MessageSquareDot,
  File,
  BriefcaseBusiness,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/src/services/auth";
import { useEffect, useState } from "react";

interface NavigationItem {
  icon: React.ReactNode;
  title: string;
  href: string;
}

interface SideBarProps {
  navigationItems?: NavigationItem[];
}

export default function SideBar({ navigationItems }: SideBarProps) {
  const pathname = usePathname();
  // const { user, logout } = useAuth();

  // const handleLogout = () => {
  //   logout();
  // };

  // Função para obter o nome do role em português

  /*
  const getRoleDisplayName = () => {
    if (!user?.role) return "Usuário";
    switch (user.role) {
      case "aluno":
        return "Aluno";
      case "professor":
        return "Professor";
      case "coordenador":
        return "Coordenador";
      default:
        return "Usuário";
    }
  };
*/

  // Detectar automaticamente a base da URL para criar navegação inteligente
  const getBaseRoute = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      return `/${segments[0]}`;
    }
    return "";
  };

  // Obter cor do tema baseada na URL ou role
  const getRoleColor = () => {
    const baseRoute = getBaseRoute();
    switch (baseRoute) {
      case "/aluno":
        return "#3B82F6"; // blue-500
      case "/professor":
        return "#605BFF"; // roxo-500
      case "/coordenador":
        return "#8B5CF6"; // purple-500
      default:
        return "#0059FF";
    }
  };

  // Navegação padrão baseada na URL atual
  const getDefaultNavigation = (): NavigationItem[] => {
    const baseRoute = getBaseRoute();

    return [
      {
        icon: <Grip className="w-6 h-6" />,
        title: "Início",
        href: `${baseRoute}/inicio`,
      },
      {
        icon: <File className="w-6 h-6" />,
        title: "Meus Estágios",
        href: `${baseRoute}/meus-estagios`,
      },
      {
        icon: <MessageSquareDot className="w-6 h-6" />,
        title: "Mensagens",
        href: `${baseRoute}/mensagens`,
      },
      {
        icon: <BriefcaseBusiness className="w-6 h-6" />,
        title: "Vagas",
        href: `${baseRoute}/vagas`,
      },
    ];
  };

  const currentNavigation = navigationItems || getDefaultNavigation();
  const roleColor = getRoleColor();
  const [userName, setUserName] = useState<string>("Usuário");
  const [userRole, setUserRole] = useState<string>("Usuário");

  const getFirstName = (fullName: string): string => {
    if (!fullName) return "Usuário";

    const firstName = fullName.trim().split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  // Função para converter role da API para nome em português
  const getRoleDisplayName = (role: string): string => {
    if (!role) return "Usuário";

    switch (role) {
      case "ROLE_ALUNO":
        return "Aluno";
      case "ROLE_PROFESSOR":
        return "Professor";
      case "ROLE_COORDENADOR":
        return "Coordenador";
      default:
        return "Usuário";
    }
  };

  // Carregar dados do usuário do localStorage
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
  }, []);

  return (
    <section className="relative w-[350px] h-screen shadow-lg bg-white">
      <header className="pl-[30px] py-[50px] flex flex-col gap-[36px]">
        <div className="flex items-center gap-4">
          <Link
            href={`${getBaseRoute()}/inicio`}
            className="flex items-center flex-shrink-0"
          >
            <Image
              src="/assets/logo.svg"
              alt="Hebreus 13:8 - O mesmo ontem, hoje e para todo o sempre."
              width={80}
              height={40}
              className=""
            />
          </Link>
          <h1 className="text-[#030229] text-[24px] leading-[32px] font-semibold">
            {userRole}
          </h1>
        </div>
        <div className="flex flex-col gap-[30px]">
          {currentNavigation.map((header, index) => {
            const isActive = pathname === header.href;

            return (
              <div
                className="flex items-center gap-4 cursor-pointer transition-all duration-300 ease-in-out hover:transform group p-2"
                key={index}
              >
                <div
                  className={`transition-all duration-300 ease-in-out group-hover:scale-110 ${
                    isActive
                      ? "text-[color:var(--role-color)]"
                      : "text-[#030229] group-hover:text-[#605BFF]"
                  }`}
                  style={isActive ? { color: roleColor } : {}}
                >
                  {header.icon}
                </div>
                <Link
                  href={header.href}
                  className={`text-[24px] leading-[24px] transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-[color:var(--role-color)] font-bold"
                      : "text-[#030229] font-semibold group-hover:text-[#605BFF]"
                  }`}
                  style={isActive ? { color: roleColor } : {}}
                >
                  {header.title}
                </Link>
              </div>
            );
          })}
        </div>
      </header>
      <div className="flex items-center gap-5 absolute bottom-[60px] left-[30px]">
        {/* <Image
          src="/assets/aluno.jpeg"
          alt="Foto do usuário"
          width={45}
          height={40}
          quality={100}
          priority
          className="rounded-[12px] object-cover"
        /> */}
        <div className="flex items-center gap-[30px] ">
          <div className="flex flex-col gap-1">
            <h4 className="text-[#000000] text-[24px] leading-5 font-semibold">
              {userName}
            </h4>
            <p className="text-[#00000052] text-[16px] leading-5 font-normal">
              {userRole}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
            title="Sair"
          >
            <LogOut className="w-6 h-6 text-[#030229]" />
          </button>
        </div>
      </div>
    </section>
  );
}
