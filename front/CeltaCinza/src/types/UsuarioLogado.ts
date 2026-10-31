export type Perfil = "CLIENTE" | "AGENTE";

export interface UsuarioLogado {
    nome: string;
    perfil: Perfil;
}