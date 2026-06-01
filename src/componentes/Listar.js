import React from 'react';
import { Link } from "react-router-dom";
import logoCompleto from './logo completo boba-03.png';


class Listar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cargadeDatos: false, 
            usuarios: [],
            id: "",
            sellos: "",
            noHayRegistros: false
         };
    }

    cargardatos(){

        const tunnelUrl = process.env.REACT_APP_URL;

        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };
        
        fetch(tunnelUrl, { headers })
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            return respuesta.text(); 
        })
        .then(text => {
            console.log('Response text:', text); 
            return JSON.parse(text); 
        })
        .then((datos) => {
            console.log(datos);
            const datosArray = Array.isArray(datos) ? datos : [];
            // La API devuelve [[{"success":0}]] cuando no hay registros.
            const isNoRecords = datosArray.length === 1 && datosArray[0] && (datosArray[0].success === 0 || datosArray[0].success === "0");
            if (isNoRecords || datosArray.length === 0) {
                this.setState({ cargadeDatos: true, usuarios: [], noHayRegistros: true });
                return;
            }
            const parseNumber = (value) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
            };
            const usuariosProcesados = datosArray.map(usuario => ({
                ...usuario,
                sellos: parseNumber(usuario.sellos),
                recompensas_gas: parseNumber(usuario.recompensas_gas),
                recompensas_ob: parseNumber(usuario.recompensas_ob)
            }));
            this.setState({ cargadeDatos: true, usuarios: usuariosProcesados, noHayRegistros: false });
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos: ' + error.message);
        })
    }

    agregarSello = (id, nombreUsuario) => {
        const baseUrl = process.env.REACT_APP_URL;
        const agregarSelloTemplate = process.env.REACT_APP_URL_AGREGARSELLO;
        const tunnelUrl = agregarSelloTemplate
            ? agregarSelloTemplate.replace('${id}', encodeURIComponent(id))
            : `${baseUrl}?agregar_sello=${encodeURIComponent(id)}`;
        const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada');

        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({ 
            sello: 1,
            nombre: nombreUsuario,
            sucursal: sucursalSeleccionada
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
            console.log('Sello agregado:', datos);
            if (datos.success === 1) {
                alert('Sello agregado correctamente');
            } else {
                alert('No se pudo agregar el sello: ' + (datos.error || 'Respuesta inesperada'));
            }
            // Recargar los datos para actualizar la tabla
            this.cargardatos();
        })
        .catch(error => {
            console.error('Error al agregar sello:', error);
            alert('Error al agregar sello: ' + error.message);
        })
    }

    quitarSello = (id, nombreUsuario) => {
        const confirmacion = window.confirm('¿Estás seguro de que deseas quitar un sello?');
        if (!confirmacion) {
            return;
        }

        const baseUrl = process.env.REACT_APP_URL;
        const quitarSelloTemplate = process.env.REACT_APP_URL_QUITARSELLO;
        const tunnelUrl = quitarSelloTemplate
            ? quitarSelloTemplate.replace('${id}', encodeURIComponent(id))
            : `${baseUrl}?quitar_sello=${encodeURIComponent(id)}`;
        const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada');
        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({ 
            sello: 1,
            nombre: nombreUsuario
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
            console.log('Sello quitado correctamente:', datos);
            alert('Sello quitado correctamente');
            // Recargar los datos para actualizar la tabla
            this.cargardatos();
        })
        .catch(error => {
            console.error('Error al quitar sello:', error);
            alert('Error al quitar sello: ' + error.message);
        })
    }

    
    eliminarUsuario = (id) => {
        const baseUrl = process.env.REACT_APP_URL;
        const tunnelUrl = `${baseUrl}?borrar=${encodeURIComponent(id)}`;

        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        };

        const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
        if (!confirmacion) {
            return;
        }

        fetch(tunnelUrl, { 
            method: 'DELETE',
            headers
        })
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then((datos) => {
            console.log('Usuario eliminado:', datos);
            alert('Usuario eliminado correctamente');
            // Recargar los datos para actualizar la tabla
            this.cargardatos();
        })
        .catch(error => {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario: ' + error.message);
        })
    }

    componentDidMount(){
        this.cargardatos();

    }

    render() { 

        const{ cargadeDatos, usuarios } = this.state

        if(!cargadeDatos){
                return <div>Cargando datos...</div>
        }else{
            return (
                <div>
                    <div className="mb-4"></div>
                    <h1>Lista de Usuarios</h1>
                    <div className="mb-3">
                        <Link className="btn btn-dark" to={"/Crear"}>Nuevo Usuario</Link>
                        <Link className="btn btn-dark ms-2" to={"/Buscar"}>Buscar Usuario</Link>
                    </div>

                    {usuarios.length > 0 ? (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Correo/Télefono</th>
                                        <th>Sellos Acumulados</th>
                                        <th>Género</th>
                                        <th>Sucursal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(
                                        (usuario)=>(
                                            <tr key = {usuario.id}> 
                                                <th scope="row">{usuario.id}</th>
                                                <td>{usuario.nombre}</td>
                                                <td>{usuario.correo}</td>
                                                <td style={{textAlign: "center"}}>
                                                    <div>{usuario.sellos}</div>
                                                    <div style={{display: "flex", justifyContent: "center", gap: "5px", marginTop: "8px", flexWrap: "wrap"}}>
                                                        {Array.from({ length: Math.max(0, Number.isFinite(usuario.recompensas_ob) ? usuario.recompensas_ob : 0) }, (_, idx) => (
                                                            <img 
                                                                key={idx}
                                                                src={logoCompleto} 
                                                                alt="Estampa" 
                                                                style={{height: "30px", width: "30px", objectFit: "contain"}}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{usuario.genero}</td>
                                                <td>{usuario.sucursal}</td>
                                                <td>
                                                    <div>
                                                        <button className="btn btn-dark mb-1" onClick={() => this.agregarSello(usuario.id, usuario.nombre)}>Agregar sello</button>
                                                        <button className="btn btn-dark ms-1" onClick={() => this.quitarSello(usuario.id, usuario.nombre)}>Quitar sello</button>
                                                        <Link className="btn btn-dark ms-1" to={`/Editar/${usuario.id}`}>Editar</Link>
                                                        <Link className= "btn btn-dark ms-1" to={`/Historial_de_registro/${usuario.id}`}>Historial de registro</Link>
                                                        <div className="mt-1"></div> 
                                                        <Link className= "btn btn-dark ms-1" to={`/Recompensas/${usuario.id}`}>Recompensas</Link>                                                    
                                                        {/*<button className="btn btn-danger me-2" onClick={() => this.eliminarUsuario(usuario.id)}>Eliminar Usuario</button>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="alert alert-warning" role="alert">
                            <strong>No hay usuarios</strong> - No hay usuarios registrados en la base de datos.
                        </div>
                    )}
                </div>
             );
        }
    }
} 
 
 
export default Listar;