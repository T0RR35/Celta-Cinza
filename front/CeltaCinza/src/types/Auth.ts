import type { UsuarioLogado } from "./UsuarioLogado";

export type TipoConta = "CLIENTE" | "EMPRESA" | "BANCO";

export interface CadastroDTO {
    tipoConta: TipoConta;
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    profissao: string;
    usuario: string;
    senha: string;
}

export interface RespostaLogin {
    token: string;
    usuario: UsuarioLogado;
}