import React from 'react';
import { Link, useParams } from "react-router-dom";

class HistorialForm extends React.Component {
    constructor(props) {
        super(props);
        const { id } = props.params;
        this.state = {
            cargadeDatos: false,
            historial: [],
            usuarioId: id,
            nombreUsuario: ""
        };
    }

    componentDidMount() {
        this.cargarHistorial();
    }

    cargarHistorial = () => {
        const { usuarioId } = this.state;
        const baseUrl = process.env.REACT_APP_URL;
        const historialTemplate = process.env.REACT_APP_URL_HISTORIAL;
        const tunnelUrl = historialTemplate
            ? historialTemplate.replace('${usuarioId}', encodeURIComponent(usuarioId))
            : `${baseUrl}?historial=${encodeURIComponent(usuarioId)}`;
        const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada');

        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };

        fetch(tunnelUrl, { headers })
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((datos) => {
                console.log('Historial cargado:', datos);
                if (Array.isArray(datos) && datos.length > 0) {
                    this.setState({ 
                        cargadeDatos: true, 
                        historial: datos,
                        nombreUsuario: datos[0].nombre
                    });
                } else {
                    this.setState({ cargadeDatos: true, historial: [] });
                }
            })
            .catch(error => {
                console.error('Error al cargar historial:', error);
                alert('Error al cargar historial: ' + error.message);
                this.setState({ cargadeDatos: true, historial: [] });
            })
    }

    render() {
        const { cargadeDatos, historial, nombreUsuario } = this.state;

        if (!cargadeDatos) {
            return <div>Cargando historial...</div>
        }

        return (
            <div>
                <div className="mb-4"></div>
                <h1>Historial de Registros</h1>
                {nombreUsuario && <h4>Usuario: {nombreUsuario}</h4>}
                
                {historial.length > 0 ? (
                    <>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID Usuario</th>
                                    <th>Nombre</th>
                                    <th>Sucursal</th>
                                    <th>Fecha y Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((registro, index) => (
                                    <tr key={index}>
                                        <td>{registro.id}</td>
                                        <td>{registro.nombre}</td>
                                        <td>{registro.sucursal}</td>
                                        <td>{registro.fecha_hora}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div className="alert alert-warning" role="alert">
                        <strong>No hay registros</strong> - Este usuario no tiene registros de sellos en el historial.
                    </div>
                )}

                <Link className="btn btn-dark mt-3" to="/">Volver</Link>
            </div>
        );
    }
}

const Historial_de_registro = (props) => <HistorialForm params={useParams()} {...props} />;

export default Historial_de_registro;
