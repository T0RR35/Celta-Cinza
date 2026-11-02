import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AgenteForm from "../components/cadastro/AgenteForm";
import ClienteForm from "../components/cadastro/ClienteForm";
import { cadastrar } from "../services/authService";
import { mensagemDeErro } from "../services/api";
import type { CadastroDTO, TipoConta } from "../types/Auth";
import "./Auth.css";

const TIPOS: { valor: TipoConta; rotulo: string }[] = [
    { valor: "CLIENTE", rotulo: "Cliente" },
    { valor: "EMPRESA", rotulo: "Empresa" },
    { valor: "BANCO", rotulo: "Banco" },
];

export default function Cadastro() {
    const navigate = useNavigate();

    const [tipoConta, setTipoConta] = useState<TipoConta>("CLIENTE");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    function trocarTipo(tipo: TipoConta) {
        setTipoConta(tipo);
        setErro("");
    }

    async function handleCadastrar(dados: CadastroDTO) {
        setEnviando(true);
        setErro("");
        try {
            await cadastrar(dados);
            navigate("/login", { state: { cadastrado: true } });
        } catch (err) {
            setErro(mensagemDeErro(err, "Não foi possível criar a conta. Tente novamente em instantes."));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="auth">
            <div className="auth__card auth__card--largo">
                <div className="auth__logo">CeltaCinza</div>
                <h1 className="auth__titulo">Criar conta</h1>

                <fieldset className="auth__tipos">
                    <legend className="sr-only">Tipo de conta</legend>
                    {TIPOS.map((t) => (
                        <label key={t.valor} className="auth__radio">
                            <input
                                type="radio"
                                name="tipoConta"
                                checked={tipoConta === t.valor}
                                onChange={() => trocarTipo(t.valor)}
                            />
                            {t.rotulo}
                        </label>
                    ))}
                </fieldset>

                {tipoConta === "CLIENTE" ? (
                    <ClienteForm enviando={enviando} erro={erro} onSubmit={handleCadastrar} />
                ) : (
                    <AgenteForm tipoConta={tipoConta} enviando={enviando} erro={erro} onSubmit={handleCadastrar} />
                )}

                <p className="auth__link">
                    <Link to="/login">Já tenho conta</Link>
                </p>
            </div>
        </div>
    );
}