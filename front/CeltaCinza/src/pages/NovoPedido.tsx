import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { criarPedido, listarBancos } from "../services/pedidoService";
import type { Banco, Proprietario } from "../types/Pedido";
import "./NovoPedido.css";

const ETAPAS = ["Automóvel", "Período", "Crédito", "Revisão"];

const PROPRIETARIOS: { valor: Proprietario; rotulo: string }[] = [
    { valor: "CLIENTE", rotulo: "Cliente" },
    { valor: "EMPRESA", rotulo: "Empresa" },
    { valor: "BANCO", rotulo: "Banco" },
];

interface FormPedido {
    marca: string;
    modelo: string;
    ano: string;
    placa: string;
    matricula: string;
    proprietario: Proprietario;
    dataRetirada: string;
    dataDevolucao: string;
    comCredito: boolean;
    bancoId: string;
}

const FORM_INICIAL: FormPedido = {
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    matricula: "",
    proprietario: "CLIENTE",
    dataRetirada: "",
    dataDevolucao: "",
    comCredito: false,
    bancoId: "",
};

// "2026-11-05" -> "05/11/2026" (sem passar por Date, para evitar bug de fuso)
function formatarData(data: string) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

export default function NovoPedido() {
    const navigate = useNavigate();

    const [etapa, setEtapa] = useState(0);
    const [form, setForm] = useState<FormPedido>(FORM_INICIAL);
    const [bancos, setBancos] = useState<Banco[]>([]);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const hoje = new Date().toLocaleDateString("sv-SE"); // formato YYYY-MM-DD
    const ultimaEtapa = etapa === ETAPAS.length - 1;

    useEffect(() => {
        listarBancos()
            .then(setBancos)
            .catch(() => setBancos([]));
    }, []);

    function atualizar<K extends keyof FormPedido>(campo: K, valor: FormPedido[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    // Devolve a mensagem de erro da etapa, ou "" se estiver tudo certo.
    function validar(numeroEtapa: number): string {
        if (numeroEtapa === 0) {
            const ano = Number(form.ano);
            if (!form.marca.trim() || !form.modelo.trim() || !form.placa.trim() || !form.matricula.trim()) {
                return "Preencha marca, modelo, placa e matrícula.";
            }
            if (!Number.isInteger(ano) || ano < 1900 || ano > new Date().getFullYear() + 1) {
                return "Informe um ano válido.";
            }
        }
        if (numeroEtapa === 1) {
            if (!form.dataRetirada || !form.dataDevolucao) return "Informe as datas de retirada e devolução.";
            if (form.dataDevolucao < form.dataRetirada) return "A devolução não pode ser antes da retirada.";
        }
        if (numeroEtapa === 2 && form.comCredito && !form.bancoId) {
            return "Selecione o banco agente do crédito.";
        }
        return "";
    }

    async function enviar() {
        setEnviando(true);
        try {
            await criarPedido({
                automovel: {
                    marca: form.marca.trim(),
                    modelo: form.modelo.trim(),
                    ano: Number(form.ano),
                    placa: form.placa.trim(),
                    matricula: form.matricula.trim(),
                    proprietario: form.proprietario,
                },
                dataRetirada: form.dataRetirada,
                dataDevolucao: form.dataDevolucao,
                bancoId: form.comCredito ? Number(form.bancoId) : null,
            });
            navigate("/pedidos");
        } catch {
            setErro("Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const mensagem = validar(etapa);
        setErro(mensagem);
        if (mensagem) return;

        if (ultimaEtapa) {
            enviar();
        } else {
            setEtapa(etapa + 1);
        }
    }

    function voltar() {
        setErro("");
        setEtapa(etapa - 1);
    }

    const nomeBanco = bancos.find((b) => String(b.id) === form.bancoId)?.nome ?? "—";
    const rotuloProprietario = PROPRIETARIOS.find((p) => p.valor === form.proprietario)?.rotulo;

    return (
        <section className="novo">
            <h1>Novo pedido de aluguel</h1>

            <ol className="novo__etapas" aria-label="Etapas do pedido">
                {ETAPAS.map((nome, i) => (
                    <li
                        key={nome}
                        className={i <= etapa ? "novo__etapa novo__etapa--ativa" : "novo__etapa"}
                        aria-current={i === etapa ? "step" : undefined}
                    >
                        {i + 1} {nome}
                    </li>
                ))}
            </ol>

            <form onSubmit={handleSubmit} noValidate>
                <div className="novo__card">
                    <h2>{ETAPAS[etapa]}</h2>

                    {etapa === 0 && (
                        <div className="novo__campos">
                            <div className="novo__linha novo__linha--2">
                                <div>
                                    <label htmlFor="marca">Marca</label>
                                    <input id="marca" className="campo" value={form.marca} onChange={(e) => atualizar("marca", e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="modelo">Modelo</label>
                                    <input id="modelo" className="campo" value={form.modelo} onChange={(e) => atualizar("modelo", e.target.value)} />
                                </div>
                            </div>

                            <div className="novo__linha novo__linha--3">
                                <div>
                                    <label htmlFor="ano">Ano</label>
                                    <input id="ano" className="campo" inputMode="numeric" maxLength={4} value={form.ano} onChange={(e) => atualizar("ano", e.target.value.replace(/\D/g, ""))} />
                                </div>
                                <div>
                                    <label htmlFor="placa">Placa</label>
                                    <input id="placa" className="campo" maxLength={8} value={form.placa} onChange={(e) => atualizar("placa", e.target.value.toUpperCase())} />
                                </div>
                                <div>
                                    <label htmlFor="matricula">Matrícula</label>
                                    <input id="matricula" className="campo" value={form.matricula} onChange={(e) => atualizar("matricula", e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="proprietario">Proprietário</label>
                                <select id="proprietario" className="campo" value={form.proprietario} onChange={(e) => atualizar("proprietario", e.target.value as Proprietario)}>
                                    {PROPRIETARIOS.map((p) => (
                                        <option key={p.valor} value={p.valor}>
                                            {p.rotulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {etapa === 1 && (
                        <div className="novo__campos">
                            <div className="novo__linha novo__linha--2">
                                <div>
                                    <label htmlFor="retirada">Retirada</label>
                                    <input id="retirada" type="date" className="campo" min={hoje} value={form.dataRetirada} onChange={(e) => atualizar("dataRetirada", e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="devolucao">Devolução</label>
                                    <input id="devolucao" type="date" className="campo" min={form.dataRetirada || hoje} value={form.dataDevolucao} onChange={(e) => atualizar("dataDevolucao", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {etapa === 2 && (
                        <div className="novo__campos">
                            <label className="novo__check" htmlFor="credito">
                                <input
                                    id="credito"
                                    type="checkbox"
                                    checked={form.comCredito}
                                    onChange={(e) => {
                                        atualizar("comCredito", e.target.checked);
                                        if (!e.target.checked) atualizar("bancoId", "");
                                    }}
                                />
                                Associar contrato de crédito (opcional)
                            </label>

                            <div>
                                <label htmlFor="banco">Banco agente</label>
                                <select id="banco" className="campo" disabled={!form.comCredito} value={form.bancoId} onChange={(e) => atualizar("bancoId", e.target.value)}>
                                    <option value="">Selecione o banco</option>
                                    {bancos.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {etapa === 3 && (
                        <dl className="novo__resumo">
                            <dt>Automóvel</dt>
                            <dd>
                                {form.marca} {form.modelo} · {form.ano}
                            </dd>
                            <dt>Placa / Matrícula</dt>
                            <dd>
                                {form.placa} / {form.matricula}
                            </dd>
                            <dt>Proprietário</dt>
                            <dd>{rotuloProprietario}</dd>
                            <dt>Período</dt>
                            <dd>
                                {formatarData(form.dataRetirada)} a {formatarData(form.dataDevolucao)}
                            </dd>
                            <dt>Crédito</dt>
                            <dd>{form.comCredito ? nomeBanco : "Sem contrato de crédito"}</dd>
                        </dl>
                    )}

                    {erro && (
                        <p className="novo__erro" role="alert">
                            {erro}
                        </p>
                    )}
                </div>

                <div className="novo__rodape">
                    <Button variant="secondary" onClick={() => navigate("/pedidos")}>
                        Cancelar
                    </Button>
                    <div className="novo__navegacao">
                        <Button variant="secondary" disabled={etapa === 0 || enviando} onClick={voltar}>
                            Voltar
                        </Button>
                        <Button type="submit" disabled={enviando}>
                            {ultimaEtapa ? (enviando ? "Enviando..." : "Enviar pedido") : "Próximo"}
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    );
}