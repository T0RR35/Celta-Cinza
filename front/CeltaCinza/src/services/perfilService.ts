import type { AtualizarClienteDTO, DadosAgente, DadosCliente } from "../types/Perfil";
import { API_URL, authHeaders as headers, erroDaResposta } from "./api";

export async function buscarCliente(): Promise<DadosCliente> {
    const resposta = await fetch(`${API_URL}/clientes/me`, { headers: headers() });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function atualizarCliente(dados: AtualizarClienteDTO): Promise<DadosCliente> {
    const resposta = await fetch(`${API_URL}/clientes/me`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function excluirCliente(): Promise<void> {
    const resposta = await fetch(`${API_URL}/clientes/me`, {
        method: "DELETE",
        headers: headers(),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
}

export async function buscarAgente(): Promise<DadosAgente> {
    const resposta = await fetch(`${API_URL}/agentes/me`, { headers: headers() });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function atualizarAgente(nome: string): Promise<DadosAgente> {
    const resposta = await fetch(`${API_URL}/agentes/me`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ nome }),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}
