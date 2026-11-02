import type { Rendimento } from "./Pedido";

export interface DadosCliente {
    id: number;
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    profissao: string;
    rendimentos: Rendimento[];
}

export interface AtualizarClienteDTO {
    nome: string;
    rg: string;
    endereco: string;
    profissao: string;
    rendimentos: Rendimento[];
}

export interface DadosAgente {
    nome: string;
    usuario: string;
    tipo: "EMPRESA" | "BANCO";
}