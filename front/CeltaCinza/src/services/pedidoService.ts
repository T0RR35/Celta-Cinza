import type { Banco, NovoPedidoDTO, ParecerDTO, Pedido, PedidoRecebido } from "../types/Pedido";
import { API_URL, authHeaders as headers, erroDaResposta } from "./api";

export async function listarPedidos(): Promise<Pedido[]> {
    const resposta = await fetch(`${API_URL}/pedidos`, { headers: headers() });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function cancelarPedido(id: number): Promise<void> {
    const resposta = await fetch(`${API_URL}/pedidos/${id}/cancelar`, {
        method: "PATCH",
        headers: headers(),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
}

export async function criarPedido(dados: NovoPedidoDTO): Promise<Pedido> {
    const resposta = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function listarBancos(): Promise<Banco[]> {
    const resposta = await fetch(`${API_URL}/bancos`, { headers: headers() });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function listarPedidosRecebidos(): Promise<PedidoRecebido[]> {
    const resposta = await fetch(`${API_URL}/pedidos/recebidos`, { headers: headers() });
    if (!resposta.ok) throw await erroDaResposta(resposta);
    return resposta.json();
}

export async function registrarParecer(id: number, parecer: ParecerDTO): Promise<void> {
    const resposta = await fetch(`${API_URL}/pedidos/${id}/parecer`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(parecer),
    });
    if (!resposta.ok) throw await erroDaResposta(resposta);
}
