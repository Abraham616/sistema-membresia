import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function Recompensas() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState(""); // "success" o "error"

    const aplicarRecompensa = (tipo) => {
        const baseUrl = process.env.REACT_APP_URL;
        const recompensaTemplate = process.env.REACT_APP_URL_RECO;
        const tunnelUrl = recompensaTemplate
            ? recompensaTemplate.replace('${id}', encodeURIComponent(id))
            : `${baseUrl}?recompensa=${encodeURIComponent(id)}`;
        const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada');
        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({ 
            id: id,
            tipo: tipo
        });

        fetch(tunnelUrl, { 
            method: 'PUT',
            headers,
            body
        })
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then((datos) => {
            if (datos.success === 1) {
                setTipoMensaje("success");
                const nombreRecompensa = 
                    tipo === 1 ? "Bebida Gratis Tamaño Regular" :
                    tipo === 2 ? "Bebida Gratis Tamaño Mostro" :
                    "Vaso Coleccionable Cassava Roots";
                setMensaje(`✓ ¡Recompensa aplicada exitosamente! ${nombreRecompensa}`);
            } else {
                setTipoMensaje("error");
                setMensaje(`✗ No se pudo aplicar la recompensa: ${datos.error || "Error desconocido"}`);
            }
        })
        .catch(error => {
            setTipoMensaje("error");
            setMensaje(`✗ Error al aplicar recompensa: ${error.message}`);
        });
    };

    return (
        <div style={{textAlign: "center", marginTop: "40px", padding: "20px"}}>
            <h1>Selecciona tu Recompensa</h1>
            
            {mensaje && (
                <div 
                    style={{
                        padding: "15px",
                        marginBottom: "30px",
                        borderRadius: "5px",
                        backgroundColor: tipoMensaje === "success" ? "#d4edda" : "#f8d7da",
                        color: tipoMensaje === "success" ? "#155724" : "#721c24",
                        border: `1px solid ${tipoMensaje === "success" ? "#c3e6cb" : "#f5c6cb"}`
                    }}
                >
                    {mensaje}
                </div>
            )}

            <div style={{marginTop: "40px"}}>
                <button 
                    className="btn btn-dark btn-lg" 
                    style={{display: "block", width: "300px", margin: "20px auto", padding: "20px", fontSize: "18px"}}
                    onClick={() => aplicarRecompensa(1)}
                >
                    Bebida Gratis Tamaño Regular
                </button>

                <button 
                    className="btn btn-dark btn-lg" 
                    style={{display: "block", width: "300px", margin: "20px auto", padding: "20px", fontSize: "18px"}}
                    onClick={() => aplicarRecompensa(2)}
                >
                    Bebida Gratis Tamaño Mostro
                </button>

                <button 
                    className="btn btn-dark btn-lg" 
                    style={{display: "block", width: "300px", margin: "20px auto", padding: "20px", fontSize: "18px"}}
                    onClick={() => aplicarRecompensa(3)}
                >
                    Vaso Coleccionable Cassava Roots
                </button>

                <div style={{marginTop: "40px"}}>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate("/")}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Recompensas;