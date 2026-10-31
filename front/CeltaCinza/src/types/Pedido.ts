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

// Corpo enviado ao back-end ao criar um pedido.
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
    bancoId: number | null; // null = sem contrato de crédito
}