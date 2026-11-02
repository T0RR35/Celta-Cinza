import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import { buscarPedido, cancelarPedido } from "../services/pedidoService";
import { mensagemDeErro } from "../services/api";
import type { Pedido, Proprietario, StatusPedido } from "../types/Pedido";
import formatarData from "../hooks/formatarData";
import "./DetalhePedido.css";

const PROPRIETARIO_LABEL: Record<Proprietario, string> = {
    CLIENTE: "Cliente",
    EMPRESA: "Empresa",
    BANCO: "Banco",
};

const DESCRICAO_STATUS: Record<StatusPedido, string> = {
    EM_ANALISE: "Seu pedido está em análise pela nossa equipe. Em breve você receberá uma resposta.",
    APROVADO: "Seu pedido foi aprovado. Aguarde o contato para a assinatura do contrato.",
    REPROVADO: "Seu pedido não foi aprovado. Entre em contato para mais informações.",
    CONTRATO_ASSINADO: "Contrato assinado. O automóvel está liberado para retirada no período indicado.",
    CANCELADO: "Este pedido foi cancelado e não pode mais ser alterado.",
};

function podeCancelar(status: StatusPedido) {
    return status === "EM_ANALISE" || status === "APROVADO";
}

function calcularDias(retirada: string, devolucao: string) {
    const inicio = new Date(`${retirada}T00:00:00`).getTime();
    const fim = new Date(`${devolucao}T00:00:00`).getTime();
    const dias = Math.round((fim - inicio) / 86_400_000);
    return dias > 0 ? dias : 1;
}

export default function DetalhePedido() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const pedidoId = Number(id);

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [cancelando, setCancelando] = useState(false);

    useEffect(() => {
        if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
            setErro("Pedido inválido.");
            setCarregando(false);
            return;
        }

        let ativo = true;
        buscarPedido(pedidoId)
            .then((dados) => ativo && setPedido(dados))
            .catch((err) => ativo && setErro(mensagemDeErro(err, "Não foi possível carregar o pedido.")))
            .finally(() => ativo && setCarregando(false));

        return () => {
            ativo = false;
        };
    }, [pedidoId]);

    async function handleCancelar() {
        if (!pedido) return;
        if (!window.confirm("Deseja realmente cancelar este pedido?")) return;

        setCancelando(true);
        setErro("");
        setSucesso("");
        try {
            await cancelarPedido(pedido.id);
            setPedido({ ...pedido, status: "CANCELADO" });
            setSucesso("Pedido cancelado com sucesso.");
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível cancelar o pedido."));
        } finally {
            setCancelando(false);
        }
    }

    if (carregando) {
        return (
            <section className="detalhe">
                <p className="detalhe__aviso">Carregando pedido...</p>
            </section>
        );
    }

    if (!pedido) {
        return (
            <section className="detalhe">
                <p className="detalhe__erro" role="alert">
                    {erro || "Pedido não encontrado."}
                </p>
                <div>
                    <Button variant="secondary" onClick={() => navigate("/pedidos")}>
                        Voltar para meus pedidos
                    </Button>
                </div>
            </section>
        );
    }

    const numero = `#${String(pedido.id).padStart(4, "0")}`;
    const dias = calcularDias(pedido.dataRetirada, pedido.dataDevolucao);

    return (
        <section className="detalhe">
            <div className="detalhe__topo">
                <div>
                    <h1>Pedido {numero}</h1>
                    <p className="detalhe__subtitulo">Detalhes da sua solicitação de aluguel.</p>
                </div>
                <Button variant="secondary" onClick={() => navigate("/pedidos")}>
                    Voltar
                </Button>
            </div>

            {erro && (
                <p className="detalhe__erro" role="alert">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="detalhe__sucesso" role="status">
                    {sucesso}
                </p>
            )}

            <div className="detalhe__status">
                <StatusBadge status={pedido.status} />
                <p>{DESCRICAO_STATUS[pedido.status]}</p>
            </div>

            <div className="detalhe__grade">
                <div className="detalhe__card">
                    <h2>Automóvel</h2>
                    <dl>
                        <dt>Marca</dt>
                        <dd>{pedido.automovel.marca}</dd>
                        <dt>Modelo</dt>
                        <dd>{pedido.automovel.modelo}</dd>
                        <dt>Ano</dt>
                        <dd>{pedido.automovel.ano}</dd>
                        <dt>Placa</dt>
                        <dd>{pedido.automovel.placa}</dd>
                        <dt>Matrícula</dt>
                        <dd>{pedido.automovel.matricula || "—"}</dd>
                        <dt>Proprietário</dt>
                        <dd>{PROPRIETARIO_LABEL[pedido.automovel.proprietario] ?? pedido.automovel.proprietario}</dd>
                    </dl>
                </div>

                <div className="detalhe__card">
                    <h2>Período</h2>
                    <dl>
                        <dt>Retirada</dt>
                        <dd>{formatarData(pedido.dataRetirada)}</dd>
                        <dt>Devolução</dt>
                        <dd>{formatarData(pedido.dataDevolucao)}</dd>
                        <dt>Duração</dt>
                        <dd>
                            {dias} {dias === 1 ? "dia" : "dias"}
                        </dd>
                    </dl>
                </div>

                <div className="detalhe__card">
                    <h2>Crédito</h2>
                    <dl>
                        <dt>Solicitado</dt>
                        <dd>{pedido.comCredito ? "Sim" : "Não"}</dd>
                    </dl>
                    <p className="detalhe__observacao">
                        {pedido.comCredito
                            ? "Você solicitou análise de crédito para este pedido."
                            : "Este pedido foi feito sem solicitação de crédito."}
                    </p>
                </div>
            </div>

            <div className="detalhe__acoes">
                {podeCancelar(pedido.status) ? (
                    <Button variant="secondary" onClick={handleCancelar} disabled={cancelando}>
                        {cancelando ? "Cancelando..." : "Cancelar pedido"}
                    </Button>
                ) : (
                    <p className="detalhe__observacao">
                        Este pedido não pode mais ser cancelado no status atual.
                    </p>
                )}
            </div>
        </section>
    );
}
