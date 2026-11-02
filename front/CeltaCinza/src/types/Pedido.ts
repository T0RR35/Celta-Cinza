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

export type Proprietario = "CLIENTE" | "EMPRESA" | "BANCO";

export interface Automovel {
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
    matricula: string;
    proprietario: Proprietario;
}

export interface Pedido {
    id: number;
    automovel: Automovel;
    dataRetirada: string;
    dataDevolucao: string;
    status: StatusPedido;
    comCredito: boolean;
}

export interface Banco {
    id: number;
    nome: string;
}

export interface NovoPedidoDTO {
    automovel: Automovel;
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
    automovel: Automovel;
    comCredito: boolean;
    dataRetirada: string;
    dataDevolucao: string;
    status: StatusPedido;
}

export interface ParecerDTO {
    positivo: boolean;
    observacoes: string;
}
