import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { listarPedidosRecebidos, registrarParecer } from "../services/pedidoService";
import type { PedidoRecebido } from "../types/Pedido";
import formatarData from "../hooks/formatarData";
import "./Recebidos.css";

type Parecer = "POSITIVO" | "NEGATIVO";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function rendaTotal(p: PedidoRecebido) {
    return p.cliente.rendimentos.reduce((soma, r) => soma + r.valor, 0);
}

export default function PedidosRecebidos() {
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState<PedidoRecebido[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
    const [parecer, setParecer] = useState<Parecer>("POSITIVO");
    const [observacoes, setObservacoes] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        let ativo = true;
        listarPedidosRecebidos()
            .then((dados) => ativo && setPedidos(dados))
            .catch(() => ativo && setErro("Não foi possível carregar os pedidos recebidos."))
            .finally(() => ativo && setCarregando(false));
        return () => {
            ativo = false;
        };
    }, []);

    const selecionado = pedidos.find((p) => p.id === selecionadoId) ?? null;
    const jaAvaliado = selecionado !== null && selecionado.status !== "EM_ANALISE";

    function avaliar(id: number) {
        setSelecionadoId(id);
        setParecer("POSITIVO");
        setObservacoes("");
        setErro("");
    }

    async function handleRegistrar() {
        if (!selecionado) return;
        if (parecer === "NEGATIVO" && !observacoes.trim()) {
            setErro("Explique nas observações o motivo do parecer negativo.");
            return;
        }

        setSalvando(true);
        setErro("");
        try {
            await registrarParecer(selecionado.id, {
                positivo: parecer === "POSITIVO",
                observacoes: observacoes.trim(),
            });
            const novoStatus = parecer === "POSITIVO" ? "APROVADO" : "REPROVADO";
            setPedidos((atual) =>
                atual.map((p) => (p.id === selecionado.id ? { ...p, status: novoStatus } : p)),
            );
            setSelecionadoId(null);
            setObservacoes("");
        } catch {
            setErro("Não foi possível registrar o parecer. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <section className="recebidos">
            <h1>Pedidos recebidos</h1>

            <div className="recebidos__card">
                <div className="recebidos__scroll">
                    <table className="recebidos__tabela">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Automóvel</th>
                                <th>Renda total</th>
                                <th>Crédito</th>
                                <th>Status</th>
                                <th>
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="recebidos__vazio">
                                        {carregando ? "Carregando pedidos..." : "Nenhum pedido recebido."}
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((p) => (
                                    <tr key={p.id} className={p.id === selecionadoId ? "recebidos__linha--ativa" : ""}>
                                        <td>{p.cliente.nome}</td>
                                        <td>
                                            {p.automovel.marca} {p.automovel.modelo}
                                        </td>
                                        <td>{moeda.format(rendaTotal(p))}</td>
                                        <td>{p.comCredito ? "Sim" : "Não"}</td>
                                        <td>
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td>
                                            <Button variant="secondary" size="sm" onClick={() => avaliar(p.id)}>
                                                Avaliar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {erro && !selecionado && (
                <p className="recebidos__erro" role="alert">
                    {erro}
                </p>
            )}

            <div className="recebidos__card">
                {selecionado ? (
                    <>
                        <h2>
                            Avaliação financeira · Pedido #{String(selecionado.id).padStart(4, "0")}
                        </h2>

                        <div className="recebidos__dados">
                            <dl>
                                <dt>Cliente</dt>
                                <dd>{selecionado.cliente.nome}</dd>
                                <dt>CPF / RG</dt>
                                <dd>
                                    {selecionado.cliente.cpf} / {selecionado.cliente.rg}
                                </dd>
                                <dt>Profissão</dt>
                                <dd>{selecionado.cliente.profissao}</dd>
                                <dt>Automóvel</dt>
                                <dd>
                                    {selecionado.automovel.marca} {selecionado.automovel.modelo} ·{" "}
                                    {selecionado.automovel.ano} · {selecionado.automovel.placa}
                                </dd>
                                <dt>Período</dt>
                                <dd>
                                    {formatarData(selecionado.dataRetirada)} a {formatarData(selecionado.dataDevolucao)}
                                </dd>
                            </dl>

                            <div>
                                <h3>Rendimentos</h3>
                                <ul className="recebidos__rendimentos">
                                    {selecionado.cliente.rendimentos.map((r) => (
                                        <li key={r.entidadeEmpregadora}>
                                            <span>{r.entidadeEmpregadora}</span>
                                            <span>{moeda.format(r.valor)}</span>
                                        </li>
                                    ))}
                                    <li className="recebidos__total">
                                        <span>Renda total</span>
                                        <span>{moeda.format(rendaTotal(selecionado))}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {jaAvaliado ? (
                            <p className="recebidos__aviso">
                                Este pedido já foi avaliado (<StatusBadge status={selecionado.status} />) e não aceita
                                novo parecer.
                            </p>
                        ) : (
                            <>
                                <fieldset className="recebidos__parecer">
                                    <legend className="sr-only">Parecer financeiro</legend>
                                    <label>
                                        <input
                                            type="radio"
                                            name="parecer"
                                            checked={parecer === "POSITIVO"}
                                            onChange={() => setParecer("POSITIVO")}
                                        />
                                        Parecer positivo
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="parecer"
                                            checked={parecer === "NEGATIVO"}
                                            onChange={() => setParecer("NEGATIVO")}
                                        />
                                        Parecer negativo
                                    </label>
                                </fieldset>

                                <label htmlFor="observacoes" className="recebidos__rotulo">
                                    Observações
                                </label>
                                <input
                                    id="observacoes"
                                    className="campo"
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                />

                                {erro && (
                                    <p className="recebidos__erro" role="alert">
                                        {erro}
                                    </p>
                                )}
                            </>
                        )}

                        <div className="recebidos__acoes">
                            {!jaAvaliado && (
                                <Button onClick={handleRegistrar} disabled={salvando}>
                                    {salvando ? "Registrando..." : "Registrar parecer"}
                                </Button>
                            )}
                            <Button variant="secondary" onClick={() => navigate(`/recebidos/${selecionado.id}/editar`)}>
                                Modificar pedido
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Avaliação financeira</h2>
                        <p className="recebidos__vazio">Selecione um pedido e clique em “Avaliar”.</p>
                    </>
                )}
            </div>
        </section>
    );
}