"use client";

import { useEffect } from "react";
import SideBar from "@/src/components/Header/SideBar";
import { logout } from "@/src/services/auth";
import {
  Grip,
  File,
  MessageSquareDot,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
  // const user = useAuth();
  // const { hasPermission } = usePermissions();
  // const router = useRouter();

  // useEffect(() => {
  //   if (user && !hasPermission("alunos", "view_orientados")) {
  //     router.push("/dashboard");
  //   }
  // }, [user, hasPermission, router]);

  // if (!user || !hasPermission("alunos", "view_orientados")) {
  //   return null;
  // }

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ROLE_COORDENADOR") {
      logout();
      window.location.href = "/login";
    }
  }, []);

  // Navegação específica para coordenador incluindo a rota de professor
  const coordenadorNavigation = [
    {
      icon: <Grip className="w-6 h-6" />,
      title: "Início",
      href: "/coordenador/inicio",
    },
    {
      icon: <File className="w-6 h-6" />,
      title: "Estágios",
      href: "/coordenador/estagios",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Professor",
      href: "/coordenador/professor",
    },
    {
      icon: <MessageSquareDot className="w-6 h-6" />,
      title: "Mensagens",
      href: "/coordenador/mensagens",
    },
    {
      icon: <BriefcaseBusiness className="w-6 h-6" />,
      title: "Vagas",
      href: "/coordenador/vagas",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar com navegação específica do coordenador */}
      <SideBar navigationItems={coordenadorNavigation} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
