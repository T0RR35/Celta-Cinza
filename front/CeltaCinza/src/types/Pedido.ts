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