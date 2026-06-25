export const getRoleDisplayName = (role: string): string => {
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
