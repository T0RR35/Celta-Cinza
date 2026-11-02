import type { AtualizarClienteDTO, DadosAgente, DadosCliente } from "../types/Perfil";

const API_URL = import.meta.env.VITE_API_URL;

function headers(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function buscarCliente(): Promise<DadosCliente> {
    const resposta = await fetch(`${API_URL}/clientes/me`, { headers: headers() });
    if (!resposta.ok) throw new Error("Falha ao carregar o perfil");
    return resposta.json();
}

export async function atualizarCliente(dados: AtualizarClienteDTO): Promise<DadosCliente> {
    const resposta = await fetch(`${API_URL}/clientes/me`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error("Falha ao salvar o perfil");
    return resposta.json();
}

export async function excluirCliente(): Promise<void> {
    const resposta = await fetch(`${API_URL}/clientes/me`, {
        method: "DELETE",
        headers: headers(),
    });
    if (resposta.status === 409) throw new Error("CONTA_COM_VINCULOS");
    if (!resposta.ok) throw new Error("Falha ao excluir a conta");
}

export async function buscarAgente(): Promise<DadosAgente> {
    const resposta = await fetch(`${API_URL}/agentes/me`, { headers: headers() });
    if (!resposta.ok) throw new Error("Falha ao carregar o perfil");
    return resposta.json();
}

export async function atualizarAgente(nome: string): Promise<DadosAgente> {
    const resposta = await fetch(`${API_URL}/agentes/me`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ nome }),
    });
    if (!resposta.ok) throw new Error("Falha ao salvar o perfil");
    return resposta.json();
}