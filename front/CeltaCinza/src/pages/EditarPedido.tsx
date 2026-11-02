import { useLocation, useParams } from "react-router-dom";
import FormularioPedido from "./FormularioPedido";

export default function EditarPedido() {
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();
    const pedidoId = Number(id);
    const doAgente = pathname.startsWith("/recebidos");

    return (
        <FormularioPedido
            pedidoId={pedidoId}
            listaPara={doAgente ? "/recebidos" : "/pedidos"}
            aposSalvar={doAgente ? "/recebidos" : `/pedidos/${pedidoId}`}
        />
    );
}
