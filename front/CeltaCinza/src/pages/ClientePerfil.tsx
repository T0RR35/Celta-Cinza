import { useEffect, useState, type FormEvent } from "react";
import Button from "../components/Button";
import { atualizarCliente, buscarCliente, excluirCliente } from "../services/perfilService";
import { mensagemDeErro } from "../services/api";
import type { DadosCliente } from "../types/Perfil";
import "./Perfil.css";

const MAX_RENDIMENTOS = 3;

interface LinhaRendimento {
    entidadeEmpregadora: string;
    valor: string;
}

interface FormCliente {
    nome: string;
    rg: string;
    endereco: string;
    profissao: string;
    rendimentos: LinhaRendimento[];
}

function paraForm(d: DadosCliente): FormCliente {
    return {
        nome: d.nome,
        rg: d.rg,
        endereco: d.endereco,
        profissao: d.profissao,
        rendimentos: d.rendimentos.map((r) => ({
            entidadeEmpregadora: r.entidadeEmpregadora,
            valor: String(r.valor),
        })),
    };
}

interface PerfilClienteProps {
    onNomeAtualizado: (nome: string) => void;
    onContaExcluida: () => void;
}

export default function PerfilCliente({ onNomeAtualizado, onContaExcluida }: PerfilClienteProps) {
    const [dados, setDados] = useState<DadosCliente | null>(null); // último estado salvo no back-end
    const [form, setForm] = useState<FormCliente | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        let ativo = true;
        buscarCliente()
            .then((d) => {
                if (!ativo) return;
                setDados(d);
                setForm(paraForm(d));
            })
            .catch((err) => ativo && setErro(mensagemDeErro(err, "Não foi possível carregar o seu perfil.")))
            .finally(() => ativo && setCarregando(false));
        return () => {
            ativo = false;
        };
    }, []);

    if (!form || !dados) {
        return (
            <section className="perfil">
                <h1>Meu perfil</h1>
                <p className={erro ? "perfil__erro" : "perfil__aviso"} role={erro ? "alert" : undefined}>
                    {carregando ? "Carregando..." : erro}
                </p>
            </section>
        );
    }

    function atualizarCampo(campo: "nome" | "rg" | "endereco" | "profissao", valor: string) {
        setForm((atual) => (atual ? { ...atual, [campo]: valor } : atual));
        setSucesso("");
    }

    function atualizarLinha(indice: number, campo: keyof LinhaRendimento, valor: string) {
        setForm((atual) =>
            atual
                ? {
                      ...atual,
                      rendimentos: atual.rendimentos.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r)),
                  }
                : atual,
        );
        setSucesso("");
    }

    function adicionarLinha() {
        setForm((atual) =>
            atual && atual.rendimentos.length < MAX_RENDIMENTOS
                ? { ...atual, rendimentos: [...atual.rendimentos, { entidadeEmpregadora: "", valor: "" }] }
                : atual,
        );
    }

    function removerLinha(indice: number) {
        setForm((atual) =>
            atual ? { ...atual, rendimentos: atual.rendimentos.filter((_, i) => i !== indice) } : atual,
        );
        setSucesso("");
    }

    function validar(f: FormCliente): string {
        if (!f.nome.trim() || !f.rg.trim() || !f.endereco.trim() || !f.profissao.trim()) {
            return "Preencha nome, RG, endereço e profissão.";
        }
        const linhaInvalida = f.rendimentos.some(
            (r) => !r.entidadeEmpregadora.trim() || r.valor === "" || Number(r.valor) < 0,
        );
        if (linhaInvalida) {
            return "Informe o empregador e o rendimento de cada linha (ou remova a linha).";
        }
        return "";
    }

    async function handleSalvar(e: FormEvent) {
        e.preventDefault();
        if (!form) return;

        const mensagem = validar(form);
        setErro(mensagem);
        setSucesso("");
        if (mensagem) return;

        setSalvando(true);
        try {
            const atualizado = await atualizarCliente({
                nome: form.nome.trim(),
                rg: form.rg.trim(),
                endereco: form.endereco.trim(),
                profissao: form.profissao.trim(),
                rendimentos: form.rendimentos.map((r) => ({
                    entidadeEmpregadora: r.entidadeEmpregadora.trim(),
                    valor: Number(r.valor),
                })),
            });
            setDados(atualizado);
            setForm(paraForm(atualizado));
            onNomeAtualizado(atualizado.nome);
            setSucesso("Dados salvos com sucesso.");
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível salvar. Tente novamente."));
        } finally {
            setSalvando(false);
        }
    }

    function handleDescartar() {
        if (!dados) return;
        setForm(paraForm(dados));
        setErro("");
        setSucesso("");
    }

    async function handleExcluir() {
        if (!window.confirm("Deseja realmente excluir a sua conta? Essa ação não pode ser desfeita.")) return;
        try {
            await excluirCliente();
            onContaExcluida();
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível excluir a conta. Tente novamente."));
        }
    }

    return (
        <section className="perfil">
            <h1>Meu perfil</h1>

            <form onSubmit={handleSalvar} noValidate>
                <div className="perfil__colunas">
                    <div className="perfil__card">
                        <h2>Identificação</h2>

                        <label htmlFor="nome">Nome completo</label>
                        <input id="nome" className="campo" value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} />

                        <label htmlFor="cpf">CPF (não pode ser alterado)</label>
                        <input id="cpf" className="campo" value={dados.cpf} disabled />

                        <label htmlFor="rg">RG</label>
                        <input id="rg" className="campo" value={form.rg} onChange={(e) => atualizarCampo("rg", e.target.value)} />

                        <label htmlFor="endereco">Endereço</label>
                        <input id="endereco" className="campo" value={form.endereco} onChange={(e) => atualizarCampo("endereco", e.target.value)} />

                        <label htmlFor="profissao">Profissão</label>
                        <input id="profissao" className="campo" value={form.profissao} onChange={(e) => atualizarCampo("profissao", e.target.value)} />
                    </div>

                    <div className="perfil__card">
                        <div className="perfil__topo-card">
                            <h2>Rendimentos (máx. {MAX_RENDIMENTOS})</h2>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={form.rendimentos.length >= MAX_RENDIMENTOS}
                                onClick={adicionarLinha}
                            >
                                + Adicionar
                            </Button>
                        </div>

                        {form.rendimentos.length === 0 && (
                            <p className="perfil__aviso">Nenhum rendimento cadastrado.</p>
                        )}

                        {form.rendimentos.map((r, i) => (
                            <div key={i} className="perfil__rendimento">
                                <div>
                                    <label htmlFor={`empregador-${i}`}>Entidade empregadora</label>
                                    <input
                                        id={`empregador-${i}`}
                                        className="campo"
                                        value={r.entidadeEmpregadora}
                                        onChange={(e) => atualizarLinha(i, "entidadeEmpregadora", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`valor-${i}`}>Rendimento mensal (R$)</label>
                                    <input
                                        id={`valor-${i}`}
                                        className="campo"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        inputMode="decimal"
                                        value={r.valor}
                                        onChange={(e) => atualizarLinha(i, "valor", e.target.value)}
                                    />
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => removerLinha(i)}>
                                    Remover
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {erro && (
                    <p className="perfil__erro" role="alert">
                        {erro}
                    </p>
                )}
                {sucesso && (
                    <p className="perfil__sucesso" role="status">
                        {sucesso}
                    </p>
                )}

                <div className="perfil__rodape">
                    <div className="perfil__acoes">
                        <Button type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar alterações"}
                        </Button>
                        <Button variant="secondary" onClick={handleDescartar}>
                            Descartar
                        </Button>
                    </div>
                    <Button variant="secondary" onClick={handleExcluir}>
                        Excluir conta
                    </Button>
                </div>
            </form>
        </section>
    );
}