export type StatusPedido =
    | "EM_ANALISE"
    | "APROVADO"
    | "REPROVADO"
    | "CONTRATO_ASSINADO"
    | "CANCELADO";

export const STATUS_LABEL: Record<StatusPedido, string> = {
    EM_ANALISE: "Em análise",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    CONTRATO_ASSINADO: "Contrato assinado",
    CANCELADO: "Cancelado",
};
export interface Pedido {
    id: number;
    automovel: {
        marca: string;
        modelo: string;
        placa: string;
    };
    dataRetirada: string; 
    dataDevolucao: string; 
    status: StatusPedido;
}

export type Proprietario = "CLIENTE" | "EMPRESA" | "BANCO";

export interface Banco {
    id: number;
    nome: string;
}
export interface NovoPedidoDTO {
    automovel: {
        marca: string;
        modelo: string;
        ano: number;
        placa: string;
        matricula: string;
        proprietario: Proprietario;
    };
    dataRetirada: string;
    dataDevolucao: string;
    bancoId: number | null;
}

export interface Rendimento {
    entidadeEmpregadora: string;
    valor: number; 
}
export interface PedidoRecebido {
    id: number;
    cliente: {
        nome: string;
        cpf: string;
        rg: string;
        profissao: string;
        rendimentos: Rendimento[]; 
    };
    automovel: {
        marca: string;
        modelo: string;
        ano: number;
        placa: string;
        matricula: string;
        proprietario: Proprietario;
    };
    comCredito: boolean;
    dataRetirada: string;
    dataDevolucao: string;
    status: StatusPedido;
}

export interface ParecerDTO {
    positivo: boolean;
    observacoes: string;
}