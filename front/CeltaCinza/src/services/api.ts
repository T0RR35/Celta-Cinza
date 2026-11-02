export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export function authHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

interface CorpoErroApi {
    status?: number;
    mensagem?: string;
    detalhes?: string[];
}

export class ApiError extends Error {
    readonly status: number;
    readonly detalhes: string[];

    constructor(status: number, mensagem: string, detalhes: string[] = []) {
        super(mensagem);
        this.name = "ApiError";
        this.status = status;
        this.detalhes = detalhes;
    }
}

function mensagemPadrao(status: number): string {
    if (status === 400) return "Dados inválidos. Verifique os campos informados.";
    if (status === 401) return "Sua sessão expirou. Entre novamente.";
    if (status === 403) return "Você não tem permissão para realizar esta ação.";
    if (status === 404) return "Registro não encontrado.";
    if (status === 409) return "Os dados informados conflitam com um registro existente.";
    if (status >= 500) return "Ocorreu um erro no servidor. Tente novamente em instantes.";
    return "Não foi possível concluir a solicitação.";
}

export async function erroDaResposta(resposta: Response): Promise<ApiError> {
    let corpo: CorpoErroApi | null = null;
    try {
        corpo = (await resposta.json()) as CorpoErroApi;
    } catch {
        corpo = null;
    }

    const mensagem =
        typeof corpo?.mensagem === "string" && corpo.mensagem.trim()
            ? corpo.mensagem
            : mensagemPadrao(resposta.status);

    const detalhes = Array.isArray(corpo?.detalhes)
        ? corpo.detalhes.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
        : [];

    return new ApiError(resposta.status, mensagem, detalhes);
}

export function mensagemDeErro(erro: unknown, fallback: string): string {
    if (erro instanceof ApiError) {
        return erro.detalhes.length > 0 ? `${erro.message} ${erro.detalhes.join(" ")}` : erro.message;
    }
    if (erro instanceof TypeError) {
        return "Não foi possível conectar ao servidor. Verifique se o back-end está em execução e tente novamente.";
    }
    return fallback;
}
