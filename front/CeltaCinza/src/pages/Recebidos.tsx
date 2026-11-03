import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { executarContrato, listarPedidosRecebidos, registrarParecer } from "../services/pedidoService";
import { mensagemDeErro } from "../services/api";
import { permiteAlteracao, type PedidoRecebido } from "../types/Pedido";
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
    const [sucesso, setSucesso] = useState("");

    const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
    const [parecer, setParecer] = useState<Parecer>("POSITIVO");
    const [observacoes, setObservacoes] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [valorCredito, setValorCredito] = useState("");
    const [prazoCredito, setPrazoCredito] = useState("");
    const [executando, setExecutando] = useState(false);

    useEffect(() => {
        let ativo = true;
        listarPedidosRecebidos()
            .then((dados) => ativo && setPedidos(dados))
            .catch((err) => ativo && setErro(mensagemDeErro(err, "Não foi possível carregar os pedidos recebidos.")))
            .finally(() => ativo && setCarregando(false));
        return () => {
            ativo = false;
        };
    }, []);

    const selecionado = pedidos.find((p) => p.id === selecionadoId) ?? null;
    const jaAvaliado = selecionado !== null && selecionado.status !== "EM_ANALISE";
    const podeExecutarContrato =
        selecionado !== null && selecionado.status === "APROVADO" && selecionado.contrato === null;

    function avaliar(id: number) {
        setSelecionadoId(id);
        setParecer("POSITIVO");
        setObservacoes("");
        setValorCredito("");
        setPrazoCredito("");
        setErro("");
        setSucesso("");
    }

    async function handleRegistrar() {
        if (!selecionado) return;
        if (parecer === "NEGATIVO" && !observacoes.trim()) {
            setErro("Explique nas observações o motivo do parecer negativo.");
            return;
        }

        setSalvando(true);
        setErro("");
        setSucesso("");
        try {
            await registrarParecer(selecionado.id, {
                positivo: parecer === "POSITIVO",
                observacoes: observacoes.trim(),
            });
            const novoStatus = parecer === "POSITIVO" ? "APROVADO" : "REPROVADO";
            setPedidos((atual) =>
                atual.map((p) => (p.id === selecionado.id ? { ...p, status: novoStatus } : p)),
            );
            setObservacoes("");
            setSucesso(
                parecer === "POSITIVO"
                    ? "Parecer positivo registrado. O contrato já pode ser executado."
                    : "Parecer negativo registrado.",
            );
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível registrar o parecer. Tente novamente."));
        } finally {
            setSalvando(false);
        }
    }

    async function handleExecutarContrato() {
        if (!selecionado) return;

        let valor: number | null = null;
        let prazoMeses: number | null = null;

        if (selecionado.comCredito) {
            valor = Number(valorCredito.replace(",", "."));
            prazoMeses = Number(prazoCredito);
            if (!valorCredito.trim() || !Number.isFinite(valor) || valor <= 0) {
                setErro("Informe um valor válido para o contrato de crédito.");
                return;
            }
            if (!Number.isInteger(prazoMeses) || prazoMeses <= 0) {
                setErro("Informe um prazo válido, em meses, para o contrato de crédito.");
                return;
            }
        }

        setExecutando(true);
        setErro("");
        setSucesso("");
        try {
            const atualizado = await executarContrato(selecionado.id, { valor, prazoMeses });
            setPedidos((atual) => atual.map((p) => (p.id === atualizado.id ? atualizado : p)));
            setSucesso("Contrato executado com sucesso. O aluguel foi formalizado.");
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível executar o contrato. Tente novamente."));
        } finally {
            setExecutando(false);
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
                            {selecionado.status === "APROVADO" || selecionado.status === "CONTRATO_ASSINADO"
                                ? "Contrato de aluguel"
                                : "Avaliação financeira"}{" "}
                            · Pedido #{String(selecionado.id).padStart(4, "0")}
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
                                <dt>Crédito</dt>
                                <dd>
                                    {selecionado.comCredito
                                        ? `Sim · ${selecionado.banco?.nome ?? "Banco não informado"}`
                                        : "Não"}
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

                        {sucesso && (
                            <p className="recebidos__sucesso" role="status">
                                {sucesso}
                            </p>
                        )}

                        {selecionado.status === "EM_ANALISE" ? (
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
                            </>
                        ) : selecionado.status === "APROVADO" ? (
                            <>
                                <p className="recebidos__aviso">
                                    O parecer financeiro foi positivo. Execute o contrato para formalizar o aluguel.
                                    {selecionado.comCredito
                                        ? " Como o pedido possui crédito, informe os dados do contrato de crédito."
                                        : " Este contrato não possui crédito associado."}
                                </p>

                                {selecionado.comCredito && (
                                    <div className="recebidos__credito">
                                        <div>
                                            <label htmlFor="valorCredito" className="recebidos__rotulo">
                                                Valor do crédito (R$)
                                            </label>
                                            <input
                                                id="valorCredito"
                                                className="campo"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={valorCredito}
                                                onChange={(e) => setValorCredito(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="prazoCredito" className="recebidos__rotulo">
                                                Prazo (meses)
                                            </label>
                                            <input
                                                id="prazoCredito"
                                                className="campo"
                                                type="number"
                                                min="1"
                                                max="600"
                                                step="1"
                                                value={prazoCredito}
                                                onChange={(e) => setPrazoCredito(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : selecionado.status === "CONTRATO_ASSINADO" && selecionado.contrato ? (
                            <div className="recebidos__contrato">
                                <h3>Contrato executado</h3>
                                <dl>
                                    <dt>Assinado em</dt>
                                    <dd>{formatarData(selecionado.contrato.dataAssinatura)}</dd>
                                    <dt>Proprietário do automóvel</dt>
                                    <dd>
                                        {selecionado.automovel.proprietario === "BANCO"
                                            ? "Banco"
                                            : selecionado.automovel.proprietario === "EMPRESA"
                                              ? "Empresa"
                                              : "Cliente"}
                                    </dd>
                                    {selecionado.contrato.contratoCredito && (
                                        <>
                                            <dt>Crédito</dt>
                                            <dd>
                                                {moeda.format(selecionado.contrato.contratoCredito.valor)} em{" "}
                                                {selecionado.contrato.contratoCredito.prazoMeses} meses ·{" "}
                                                {selecionado.contrato.contratoCredito.bancoNome}
                                            </dd>
                                        </>
                                    )}
                                </dl>
                            </div>
                        ) : (
                            <p className="recebidos__aviso">
                                Este pedido está com status <StatusBadge status={selecionado.status} /> e não aceita
                                novas ações de contrato.
                            </p>
                        )}

                        {erro && (
                            <p className="recebidos__erro" role="alert">
                                {erro}
                            </p>
                        )}

                        <div className="recebidos__acoes">
                            {permiteAlteracao(selecionado.status) && (
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/recebidos/${selecionado.id}/editar`)}
                                >
                                    Modificar pedido
                                </Button>
                            )}
                            {!jaAvaliado && (
                                <Button onClick={handleRegistrar} disabled={salvando}>
                                    {salvando ? "Registrando..." : "Registrar parecer"}
                                </Button>
                            )}
                            {podeExecutarContrato && (
                                <Button onClick={handleExecutarContrato} disabled={executando}>
                                    {executando ? "Executando..." : "Executar contrato"}
                                </Button>
                            )}
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
