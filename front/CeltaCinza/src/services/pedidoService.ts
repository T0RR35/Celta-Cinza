import type {
    Pedido
} from "../types/Pedido";

const API_URL =
    import.meta.env.VITE_API_URL;

function headers(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? {
            Authorization: `Bearer ${token}`
        } : {}),
    };
}

export async function listarPedidos(): Promise < Pedido[] > {
    const resposta = await fetch(`${API_URL}/pedidos`, {
        headers: headers()
    });
    if (!resposta.ok) throw new Error("Falha ao carregar pedidos");
    return resposta.json();
}

export async function cancelarPedido(id: number): Promise < void > {
    const resposta = await fetch(`${API_URL}/pedidos/${id}/cancelar`, {
        method: "PATCH",
        headers: headers(),
    });
    if (!resposta.ok) throw new Error("Falha ao cancelar pedido");
}