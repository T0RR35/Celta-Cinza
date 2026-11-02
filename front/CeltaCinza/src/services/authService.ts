import type { CadastroDTO, RespostaLogin } from "../types/Auth";
import { API_URL, erroDaResposta } from "./api";

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function login(usuario: string, senha: string): Promise<RespostaLogin> {
    const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ usuario, senha }),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function cadastrar(dados: CadastroDTO): Promise<void> {
    const resposta = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
}
