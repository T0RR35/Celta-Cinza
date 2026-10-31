import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { cadastrar } from "../services/authService";
import type { TipoConta } from "../types/Auth";
import "./Auth.css";

const TIPOS: { valor: TipoConta; rotulo: string }[] = [
    { valor: "CLIENTE", rotulo: "Cliente" },
    { valor: "EMPRESA", rotulo: "Empresa" },
    { valor: "BANCO", rotulo: "Banco" },
];

interface FormCadastro {
    tipoConta: TipoConta;
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    profissao: string;
    usuario: string;
    senha: string;
}

const FORM_INICIAL: FormCadastro = {
    tipoConta: "CLIENTE",
    nome: "",
    cpf: "",
    rg: "",
    endereco: "",
    profissao: "",
    usuario: "",
    senha: "",
};

export default function Cadastro() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormCadastro>(FORM_INICIAL);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    function atualizar<K extends keyof FormCadastro>(campo: K, valor: FormCadastro[K]) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    function validar(): string {
        const obrigatorios = [form.nome, form.cpf, form.rg, form.endereco, form.profissao, form.usuario];
        if (obrigatorios.some((v) => !v.trim()) || !form.senha) {
            return "Preencha todos os campos.";
        }
        if (form.cpf.replace(/\D/g, "").length !== 11) {
            return "O CPF deve ter 11 dígitos.";
        }
        if (form.senha.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres.";
        }
        return "";
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const mensagem = validar();
        setErro(mensagem);
        if (mensagem) return;

        setEnviando(true);
        try {
            await cadastrar({
                ...form,
                nome: form.nome.trim(),
                cpf: form.cpf.replace(/\D/g, ""),
                rg: form.rg.trim(),
                endereco: form.endereco.trim(),
                profissao: form.profissao.trim(),
                usuario: form.usuario.trim(),
            });
            navigate("/login", { state: { cadastrado: true } });
        } catch (err) {
            const usuarioExistente = err instanceof Error && err.message === "USUARIO_EXISTENTE";
            setErro(
                usuarioExistente
                    ? "Esse usuário já está em uso. Escolha outro."
                    : "Não foi possível criar a conta. Tente novamente em instantes.",
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="auth">
            <form className="auth__card auth__card--largo" onSubmit={handleSubmit} noValidate>
                <div className="auth__logo">CeltaCinza</div>
                <h1 className="auth__titulo">Criar conta</h1>

                <fieldset className="auth__tipos">
                    <legend className="sr-only">Tipo de conta</legend>
                    {TIPOS.map((t) => (
                        <label key={t.valor} className="auth__radio">
                            <input
                                type="radio"
                                name="tipoConta"
                                checked={form.tipoConta === t.valor}
                                onChange={() => atualizar("tipoConta", t.valor)}
                            />
                            {t.rotulo}
                        </label>
                    ))}
                </fieldset>

                <label htmlFor="nome">Nome completo</label>
                <input id="nome" className="campo" autoComplete="name" value={form.nome} onChange={(e) => atualizar("nome", e.target.value)} />

                <div className="auth__linha">
                    <div>
                        <label htmlFor="cpf">CPF</label>
                        <input id="cpf" className="campo" inputMode="numeric" maxLength={14} value={form.cpf} onChange={(e) => atualizar("cpf", e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="rg">RG</label>
                        <input id="rg" className="campo" value={form.rg} onChange={(e) => atualizar("rg", e.target.value)} />
                    </div>
                </div>

                <label htmlFor="endereco">Endereço</label>
                <input id="endereco" className="campo" autoComplete="street-address" value={form.endereco} onChange={(e) => atualizar("endereco", e.target.value)} />

                <label htmlFor="profissao">Profissão</label>
                <input id="profissao" className="campo" value={form.profissao} onChange={(e) => atualizar("profissao", e.target.value)} />

                <div className="auth__linha">
                    <div>
                        <label htmlFor="usuario">Usuário</label>
                        <input id="usuario" className="campo" autoComplete="username" value={form.usuario} onChange={(e) => atualizar("usuario", e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="senha">Senha</label>
                        <input id="senha" type="password" className="campo" autoComplete="new-password" value={form.senha} onChange={(e) => atualizar("senha", e.target.value)} />
                    </div>
                </div>

                {erro && (
                    <p className="auth__erro" role="alert">
                        {erro}
                    </p>
                )}

                <div className="auth__acao">
                    <Button type="submit" fullWidth disabled={enviando}>
                        {enviando ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </div>

                <p className="auth__link">
                    <Link to="/login">Já tenho conta</Link>
                </p>
            </form>
        </div>
    );
}