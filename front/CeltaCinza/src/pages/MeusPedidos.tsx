import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { cancelarPedido, listarPedidos } from "../services/pedidoService";
import { STATUS_LABEL, type Pedido, type StatusPedido } from "../types/Pedido";
import "./MeusPedidos.css";
import { formatarDia } from "../hooks/formatarData";

function podeAlterar(status: StatusPedido) {
    return status === "EM_ANALISE" || status === "APROVADO";
}

export default function MeusPedidos() {
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<StatusPedido | "TODOS">("TODOS");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        let ativo = true;
        listarPedidos()
            .then((dados) => ativo && setPedidos(dados))
            .catch(() => ativo && setErro("Não foi possível carregar os pedidos."))
            .finally(() => ativo && setCarregando(false));
        return () => {
            ativo = false;
        };
    }, []);

    const pedidosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return pedidos.filter((p) => {
            if (filtroStatus !== "TODOS" && p.status !== filtroStatus) return false;
            if (!termo) return true;
            const texto = `${p.id} ${p.automovel.marca} ${p.automovel.modelo} ${p.automovel.placa}`;
            return texto.toLowerCase().includes(termo);
        });
    }, [pedidos, filtroStatus, busca]);

    async function handleCancelar(id: number) {
        if (!window.confirm("Deseja realmente cancelar este pedido?")) return;
        try {
            await cancelarPedido(id);
            setPedidos((atual) =>
                atual.map((p) => (p.id === id ? { ...p, status: "CANCELADO" } : p)),
            );
        } catch {
            setErro("Não foi possível cancelar o pedido.");
        }
    }

    function mensagemVazia() {
        if (carregando) return "Carregando pedidos...";
        if (pedidos.length === 0) return "Você ainda não possui pedidos.";
        return "Nenhum pedido encontrado com esses filtros.";
    }

    return (
        <section className="pedidos">
            <div className="pedidos__topo">
                <h1>Meus pedidos</h1>
                <Button onClick={() => navigate("/pedidos/novo")}>Novo pedido</Button>
            </div>

            <div className="pedidos__filtros">
                <div>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        className="campo"
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value as StatusPedido | "TODOS")}
                    >
                        <option value="TODOS">Todos</option>
                        {Object.entries(STATUS_LABEL).map(([valor, rotulo]) => (
                            <option key={valor} value={valor}>
                                {rotulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="busca">Buscar</label>
                    <input
                        id="busca"
                        className="campo"
                        type="search"
                        placeholder="Nº, marca, modelo ou placa"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
            </div>

            {erro && (
                <p className="pedidos__erro" role="alert">
                    {erro}
                </p>
            )}

            <div className="pedidos__card">
                <div className="pedidos__scroll">
                    <table className="pedidos__tabela">
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Automóvel</th>
                                <th>Período</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="pedidos__vazio">
                                        {mensagemVazia()}
                                    </td>
                                </tr>
                            ) : (
                                pedidosFiltrados.map((p) => (
                                    <tr key={p.id}>
                                        <td>#{String(p.id).padStart(4, "0")}</td>
                                        <td>
                                            {p.automovel.marca} {p.automovel.modelo} · {p.automovel.placa}
                                        </td>
                                        <td>
                                            {formatarDia(p.dataRetirada)} – {formatarDia(p.dataDevolucao)}
                                        </td>
                                        <td>
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td>
                                            <div className="pedidos__acoes">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => navigate(`/pedidos/${p.id}`)}
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={!podeAlterar(p.status)}
                                                    onClick={() => navigate(`/pedidos/${p.id}/editar`)}
                                                >
                                                    Modificar
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={!podeAlterar(p.status)}
                                                    onClick={() => handleCancelar(p.id)}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}