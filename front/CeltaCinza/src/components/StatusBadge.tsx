import { STATUS_LABEL, type StatusPedido } from "../types/Pedido";
import "./StatusBadge.css";

export default function StatusBadge({ status }: { status: StatusPedido }) {
    return (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
            {STATUS_LABEL[status]}
        </span>
    );
}