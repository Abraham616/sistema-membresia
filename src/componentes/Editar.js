import React from 'react';
import { Link, useParams } from "react-router-dom";

class EditarForm extends React.Component {
    constructor(props) {
        super(props);
        const { id } = props.params;
        this.state = { 
          nombre: "",
          correo: "",
          genero: "",
          usuarioId: id,
          cargando: true
         };
    }

    componentDidMount() {
        const { usuarioId } = this.state;
        
        const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/`;
        
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
            console.log('Usuarios cargados:', datos);
            if (Array.isArray(datos)) {
                const usuario = datos.find(u => u.id === usuarioId);
                if (usuario) {
                    this.setState({ 
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        genero: usuario.genero,
                        cargando: false
                    });
                } else {
                    console.error('Usuario no encontrado');
                    this.setState({ cargando: false });
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar usuario:', error);
            alert('Error al cargar los datos del usuario: ' + error.message);
            this.setState({ cargando: false });
        })
    }
    
    
    enviarForm = (e) => {
      e.preventDefault();
      console.log("formulario enviado");

      const{nombre, correo, genero, usuarioId} = this.state;
      const{ sucursal } = this.props;

      console.log(nombre, correo, genero, usuarioId, sucursal);

      if (!nombre || genero === "Selecciona una opción" || !correo) {
        alert('Error: Faltan datos.');
        return;
      }

      const tunnelUrl = `https://stubbed-audience-say.ngrok-free.dev/membresias/?actualizar=${usuarioId}`;

        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };

        var datosenv= {
          "nombre": nombre,
          "correo": correo,
          "genero": genero,
          "sucursal": sucursal
        }
        
        fetch(tunnelUrl, {
            method: 'POST',
            body: JSON.stringify(datosenv),
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
        })
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
            alert('Usuario actualizado correctamente');
            this.setState({ cargadeDatos: true, usuarios: datos });
            
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos: ' + error.message);
        })

    }

    render() { 
      const{nombre, correo, genero, cargando} = this.state;

      if (cargando) {
          return <div>Cargando datos del usuario...</div>
      }

        return (
            <div>
                <div className="mb-4"></div>
                <h1>Editar Usuario</h1>
                <form onSubmit={this.enviarForm}>
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input type="text" name="nombre" value={nombre} id="nombre" className="form-control" placeholder="" aria-describedby="helpId" onChange={(e) => this.setState({ nombre: e.target.value })}/>
                      <small id="helpId" className="text-muted"></small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="correo">Correo/Télefono</label>
                      <input type="text" className="form-control" name="correo" value={correo} id="correo" aria-describedby="emailHelpId" placeholder="" onChange={(e) => this.setState({ correo: e.target.value })}/>
                      <small id="emailHelpId" className="form-text text-muted"></small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="genero">Género</label>
                      <select className="form-control" name="genero" value={genero} id="genero" onChange={(e) => this.setState({ genero: e.target.value })}>
                        <option>Selecciona una opción</option>
                        <option>Masculino</option>
                        <option>Femenino</option>
                        <option>Otro</option>
                      </select>
                    </div>

                    <div className="mb-4"></div>

                    <button type="submit" className="btn btn-dark">Guardar</button>
                    <Link to="/" className="btn btn-dark ms-2">Volver</Link>
                </form>
            </div>
        );
    }
}

const Editar = (props) => <EditarForm params={useParams()} {...props} />;
 
export default Editar;