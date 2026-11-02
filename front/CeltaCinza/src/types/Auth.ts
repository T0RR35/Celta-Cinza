import type { UsuarioLogado } from "./UsuarioLogado";

export type TipoConta = "CLIENTE" | "EMPRESA" | "BANCO";

export interface CadastroDTO {
    tipoConta: TipoConta;
    nome: string;
    usuario: string;
    senha: string;
    cpf?: string;
    rg?: string;
    endereco?: string;
    profissao?: string;
}
export interface CadastroFormProps {
    enviando: boolean;
    erro: string;
    onSubmit: (dados: CadastroDTO) => void;
}

export interface RespostaLogin {
    token: string;
    usuario: UsuarioLogado;
}