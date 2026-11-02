import { useEffect, useState, type FormEvent } from "react";
import Button from "../components/Button";
import { atualizarAgente, buscarAgente } from "../services/perfilService";
import { mensagemDeErro } from "../services/api";
import type { DadosAgente } from "../types/Perfil";
import "./Perfil.css";

const ROTULO_TIPO: Record<DadosAgente["tipo"], string> = {
    EMPRESA: "Empresa",
    BANCO: "Banco",
};

interface PerfilAgenteProps {
    onNomeAtualizado: (nome: string) => void;
}

export default function PerfilAgente({ onNomeAtualizado }: PerfilAgenteProps) {
    const [dados, setDados] = useState<DadosAgente | null>(null);
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        let ativo = true;
        buscarAgente()
            .then((d) => {
                if (!ativo) return;
                setDados(d);
                setNome(d.nome);
            })
            .catch((err) => ativo && setErro(mensagemDeErro(err, "Não foi possível carregar o seu perfil.")))
            .finally(() => ativo && setCarregando(false));
        return () => {
            ativo = false;
        };
    }, []);

    if (!dados) {
        return (
            <section className="perfil">
                <h1>Meu perfil</h1>
                <p className={erro ? "perfil__erro" : "perfil__aviso"} role={erro ? "alert" : undefined}>
                    {carregando ? "Carregando..." : erro}
                </p>
            </section>
        );
    }

    const rotuloNome = dados.tipo === "BANCO" ? "Nome do banco" : "Nome da empresa";

    async function handleSalvar(e: FormEvent) {
        e.preventDefault();
        setSucesso("");

        if (!nome.trim()) {
            setErro("Informe o nome.");
            return;
        }

        setErro("");
        setSalvando(true);
        try {
            const atualizado = await atualizarAgente(nome.trim());
            setDados(atualizado);
            setNome(atualizado.nome);
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
        setNome(dados.nome);
        setErro("");
        setSucesso("");
    }

    return (
        <section className="perfil">
            <h1>Meu perfil</h1>

            <form onSubmit={handleSalvar} noValidate>
                <div className="perfil__card perfil__card--estreito">
                    <h2>Dados da conta</h2>

                    <label htmlFor="tipo">Tipo de conta</label>
                    <input id="tipo" className="campo" value={ROTULO_TIPO[dados.tipo]} disabled />

                    <label htmlFor="nome">{rotuloNome}</label>
                    <input
                        id="nome"
                        className="campo"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            setSucesso("");
                        }}
                    />

                    <label htmlFor="usuario">Usuário (não pode ser alterado)</label>
                    <input id="usuario" className="campo" value={dados.usuario} disabled />
                </div>

                {erro && (
                    <p className="perfil__erro perfil__card--estreito" role="alert">
                        {erro}
                    </p>
                )}
                {sucesso && (
                    <p className="perfil__sucesso perfil__card--estreito" role="status">
                        {sucesso}
                    </p>
                )}

                <div className="perfil__acoes">
                    <Button type="submit" disabled={salvando}>
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </Button>
                    <Button variant="secondary" onClick={handleDescartar}>
                        Descartar
                    </Button>
                </div>
            </form>
        </section>
    );
}