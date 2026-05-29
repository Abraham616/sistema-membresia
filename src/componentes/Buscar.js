import React from 'react';
import { Link } from "react-router-dom";
import logoCompleto from './logo completo boba-03.png';

class Buscar extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            cargadeDatos: false, 
            usuarios: [],
            nombre: "",
            correo: "",
            genero: "",
            noHayRegistros: false
         };
    }

    componentDidMount() {
        
    }

    usuarioExiste = (id) => {
        return this.state.usuarios.some(usuario => usuario.id === id);
    }

    agregarSello = (id, nombreUsuario) => {
        if (!this.usuarioExiste(id)) {
            alert('El usuario no existe');
            return;
        }

        const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/?agregar_sello=${id}`;
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
            // Recargar los datos de búsqueda para actualizar la tabla
            this.enviarForm({ preventDefault: () => {} });
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
        if (!this.usuarioExiste(id)) {
            alert('El usuario no existe');
            return;
        }

        const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/?quitar_sello=${id}`;

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
            // Recargar los datos de búsqueda para actualizar la tabla
            this.enviarForm({ preventDefault: () => {} });
        })
        .catch(error => {
            console.error('Error al quitar sello:', error);
            alert('Error al quitar sello: ' + error.message);
        })
    }

    eliminarUsuario = (id) => {
        if (!this.usuarioExiste(id)) {
            alert('El usuario no existe');
            return;
        }

        const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/?borrar=${id}`;

        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json'
        };

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
            this.setState({ cargadeDatos: true, usuarios: [] });
        })
        .catch(error => {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar usuario: ' + error.message);
        })
    }

    enviarForm = (e) => {
        e.preventDefault();
        console.log("formulario de búsqueda enviado");

        const { nombre, correo, id } = this.state;
        const termino = nombre || correo || id;

        if (!termino.trim()) {
            alert('Por favor ingresa un nombre, correo o ID para buscar');
            return;
        }

        const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/?buscar=${encodeURIComponent(termino)}`;

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
            console.log('Resultados de búsqueda:', datos);
            const datosArray = Array.isArray(datos) ? datos : [];
            const isNoRecords = datosArray.length === 1 && datosArray[0] && (datosArray[0].success === 0 || datosArray[0].success === "0");
            if (isNoRecords) {
                // La base de datos está vacía
                this.setState({ cargadeDatos: true, usuarios: [], noHayRegistros: true });
                return;
            }

            if (datosArray.length > 0) {
                const usuariosProcesados = datosArray.map(usuario => ({
                    ...usuario,
                    sellos: Number(usuario.sellos),
                    recompensas_gas: Number(usuario.recompensas_gas ?? 0),
                    recompensas_ob: Number(usuario.recompensas_ob ?? 0)
                }));
                this.setState({ cargadeDatos: true, usuarios: usuariosProcesados, noHayRegistros: false });
            } else {
                alert('No se encontraron usuarios');
                this.setState({ cargadeDatos: true, usuarios: [], noHayRegistros: false });
            }
        })
        .catch(error => {
            console.error('Error al buscar:', error);
            alert('Error al buscar: ' + error.message);
        })
    }

    render(){

        const{nombre, correo, id, cargadeDatos, usuarios} = this.state;
            
            return(
                <div>
                    <div className="mb-4"></div>
                    <h1>Buscar Usuario</h1>
                    <form onSubmit={this.enviarForm}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => this.setState({ nombre: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Correo/Télefono:</label>
                            <input type="text" className="form-control" id="correo" value={correo} onChange={(e) => this.setState({ correo: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="id">ID:</label>
                            <input type="text" className="form-control" id="id" value={id} onChange={(e) => this.setState({ id: e.target.value })} />
                        </div>
                        <div className="mb-4"></div>
                         
                            <button type="submit" className="btn btn-dark">Buscar</button>
                            <Link to="/" className="btn btn-dark ms-2">Volver</Link>
                    </form>

                    {cargadeDatos && (
                        <div className="mt-5">
                            {this.state.noHayRegistros ? (
                                <div className="alert alert-warning" role="alert">
                                    <strong>No hay usuarios</strong> - No hay usuarios registrados en la base de datos.
                                </div>
                            ) : usuarios.length > 0 ? (
                                <>
                                    <h3>Resultados de la búsqueda</h3>
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
                                            {usuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td>{usuario.id}</td>
                                                    <td>{usuario.nombre}</td>
                                                    <td>{usuario.correo}</td>
                                                    <td style={{textAlign: "center"}}>
                                                        <div>{usuario.sellos}</div>
                                                        <div style={{display: "flex", justifyContent: "center", gap: "5px", marginTop: "8px", flexWrap: "wrap"}}>
                                                            {Array(usuario.recompensas_ob).fill(0).map((_, idx) => (
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
                                                            <Link className= "btn btn-dark ms-2" to={`/Recompensas/${usuario.id}`}>Recompensas</Link>                                                           
                                                            {/*<button className="btn btn-danger me-2" onClick={() => this.eliminarUsuario(usuario.id)}>Eliminar Usuario</button>*/}
                                                            <div className="mb-2"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <div className="alert alert-warning" role="alert">
                                    <strong>No se encontraron usuarios</strong> - El usuario que buscas no existe en la base de datos.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
    }
}

export default Buscar;