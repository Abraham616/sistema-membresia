import React from 'react';
import { Link } from "react-router-dom";
class Crear extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          nombre: "",
          correo: "",
          genero: "",
          telefono: "",
          contacto: ""
         };
    }
    
    
    enviarForm = (e) => {
      e.preventDefault();
      console.log("formulario enviado");

      const{nombre, correo, genero, telefono, contacto} = this.state;
      const{ sucursal = "" } = this.props;

      console.log(nombre, correo, genero, telefono, contacto, sucursal);

      if (!sucursal) {
        alert('Error: No hay sucursal seleccionada. Por favor inicia sesión nuevamente.');
        return;
      }

      if (!nombre || !genero || !contacto || (contacto === "telefono" && !telefono) || (contacto === "correo" && !correo)) {
        alert('Error: Faltan datos.');
        return;
      }

      const tunnelUrl = "https://stubbed-audience-say.ngrok-free.dev/membresias/?insertar=1";

        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };

        // Si se selecciona "Teléfono", guardar el teléfono también en la columna de correo
        const correoFinal = contacto === "telefono" ? telefono : correo;

        var datosenv= {
          "nombre": nombre,
          "correo": correoFinal,
          "genero": genero,
          "telefono": telefono,
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
            console.log('Response datos:', datos);
            if (datos.success === 1) {
                alert('Usuario creado correctamente con el folio: ' + datos.id);
                this.setState({ nombre: "", correo: "", genero: "", telefono: "", contacto: "" });
            } else {
                alert('Error al crear usuario: ' + (datos.error || 'Error desconocido'));
            }
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar datos: ' + error.message);
        })

    }

    render() { 
      const{nombre, correo, genero, telefono, contacto} = this.state;

        return (
            <div>
                <div className="mb-4"></div>
                <h1>Nuevo Miembro</h1>
                <form onSubmit={this.enviarForm}>
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input type="text" name="nombre" value={nombre} id="nombre" className="form-control" placeholder="" aria-describedby="helpId" onChange={(e) => this.setState({ nombre: e.target.value })}/>
                      <small id="helpId" className="text-muted"></small>
                    </div>

                    <div className="mb-4"></div>

                    <div className="form-group">
                      <label>Contacto Preferido</label>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="contacto" 
                          id="telefono_radio" 
                          value="telefono"
                          checked={contacto === "telefono"}
                          onChange={(e) => this.setState({ contacto: e.target.value })}
                        />
                        <label className="form-check-label" htmlFor="telefono_radio">
                          Teléfono
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="contacto" 
                          id="correo_radio" 
                          value="correo"
                          checked={contacto === "correo"}
                          onChange={(e) => this.setState({ contacto: e.target.value })}
                        />
                        <label className="form-check-label" htmlFor="correo_radio">
                          Correo
                        </label>
                      </div>
                    </div>

                    <div className="mb-4"></div>

                    {contacto === "telefono" && (
                        <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input type="text" className="form-control" name="telefono" value={telefono} id="telefono" aria-describedby="telefonoHelpId" placeholder="" onChange={(e) => this.setState({ telefono: e.target.value })}/>
                        </div>
                    )}

                    {contacto === "correo" && (
                        <div className="form-group">
                        <label htmlFor="correo">Correo</label>
                        <input type="email" className="form-control" name="correo" value={correo} id="correo" aria-describedby="emailHelpId" placeholder="" onChange={(e) => this.setState({ correo: e.target.value })}/>
                        <small id="emailHelpId" className="form-text text-muted"></small>
                        </div>
                    )}

                    <div className="mb-4"></div>

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
 
export default Crear;