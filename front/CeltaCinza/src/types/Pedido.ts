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

export function permiteAlteracao(status: StatusPedido) {
    return status === "EM_ANALISE" || status === "APROVADO";
}

export interface Automovel {
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
    matricula: string;
    proprietario: Proprietario;
}

export interface ContratoCredito {
    id: number;
    valor: number;
    prazoMeses: number;
    bancoId: number;
    bancoNome: string;
}

export interface Contrato {
    id: number;
    dataAssinatura: string;
    contratoCredito: ContratoCredito | null;
}

export interface Pedido {
    id: number;
    clienteNome: string;
    automovel: Automovel;
    dataRetirada: string;
    dataDevolucao: string;
    status: StatusPedido;
    comCredito: boolean;
    bancoId: number | null;
    contrato: Contrato | null;
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
    banco: Banco | null;
    dataRetirada: string;
    dataDevolucao: string;
    status: StatusPedido;
    contrato: Contrato | null;
}

export interface ParecerDTO {
    positivo: boolean;
    observacoes: string;
}

export interface ExecutarContratoDTO {
    valor: number | null;
    prazoMeses: number | null;
}
