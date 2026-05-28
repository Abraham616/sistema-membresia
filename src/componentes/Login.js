import React from 'react';
import './Login.css';
import textura from './textura.png';
import logoCompleto from '../logo completo boba-03.png';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sucursal: "",
            contrasenia: "",
            error: ""
        };
        
        // Lista predefinida de sucursales
        this.sucursales = [
            "Acoxpa",
            "Anahuac Norte",
            "Antea Qro",
            "Antenas",
            "Antenas 2",
            "Atizapan",
            "Averanda",
            "Buenavista",
            "Centro Santa Fe",
            "Centro Las Americas",
            "Centro Mérida",
            "Centro San Miguel",
            "Cielo Abierto",
            "Cosmopol",
            "Coyoacan",
            "Cuspide",
            "Delta",
            "Explanada Pachuca",
            "Fortuna",
            "Forum Buenavista",
            "Forum Buenavista 2",
            "Galerias Coapa",
            "Galerias Metepec",
            "Gran Plaza Merida",
            "Gran Terraza",
            "Hermosillo",
            "Interlomas",
            "Jardin Neza",
            "La Diana Acapulco",
            "La Salle",
            "Las Aguilas",
            "Las Palmas Acapulco",
            "Lindavista",
            "Luna Parc",
            "Madero",
            "Manacar",
            "Mega Coapa Tec",
            "Mitikah",
            "Miyana",
            "Multiplaza Aragon",
            "Mundo E",
            "Oceania",
            "Parque Interlomas",
            "Parque Tepeyac",
            "Parque Tezontle",
            "Parque Toreo",
            "Parque Via Vallejo",
            "Paseo Interlomas",
            "Patio Martin Carrera",
            "Patio Santa Fe",
            "Pedregal",
            "Perinorte",
            "Plateros",
            "Plaza Oriente",
            "Plaza Patriotismo",
            "Plaza Tepeyac",
            "Plaza Universidad",
            "Punto Maq",
            "Reforma",
            "Satelite",
            "Tecamac",
            "Tec Milenio",
            "Tlalnepantla",
            "Toreo 2",
            "Town Center Rosario",
            "Town Square Metepec",
            "Zona Azul",
            "Zona Rosa",
        ];
        
        // Contraseña 
        this.contraseniaCorrecta = process.env.REACT_APP_PASSWORD;
    }

    enviarLogin = (e) => {
        e.preventDefault();
        const { sucursal, contrasenia } = this.state;

        // Validar que ambos campos estén llenos
        if (!sucursal.trim()) {
            this.setState({ error: "Por favor selecciona una sucursal" });
            return;
        }

        if (!contrasenia.trim()) {
            this.setState({ error: "Por favor ingresa una contraseña" });
            return;
        }

        // Validar contraseña
        if (contrasenia !== this.contraseniaCorrecta) {
            this.setState({ error: "Contraseña incorrecta" });
            return;
        }

        // Guardar sucursal en localStorage
        localStorage.setItem('sucursalSeleccionada', sucursal);
        
        // Limpiar error y llamar al callback
        this.setState({ error: "" });
        this.props.onLogin(sucursal);
    };

    render() {
        const { sucursal, contrasenia, error } = this.state;

        return (
            <div style={{backgroundImage: `url(${textura})`, backgroundRepeat: "repeat", minHeight: "100vh", margin: 0, padding: 0}}>
            <div className="login-container">
                <div className="login-box">
                    <div className="login-logo-container">
                        <img src={logoCompleto} alt="Logo Cassava" className="login-logo" />
                    </div>
                    <h1 className="login-title">Sistema de Membresía Cassava Roots</h1>
                    <h2 className="login-subtitle">Iniciar Sesión</h2>
                    
                    <form onSubmit={this.enviarLogin}>
                        <div className="form-group mb-3">
                            <label htmlFor="sucursal" className="form-label">
                                Selecciona una sucursal:
                            </label>
                            <select
                                className="form-control form-control-lg"
                                id="sucursal"
                                value={sucursal}
                                onChange={(e) => this.setState({ sucursal: e.target.value, error: "" })}
                            >
                                <option value="">-- Selecciona tu sucursal --</option>
                                {this.sucursales.map((suc) => (
                                    <option key={suc} value={suc}>
                                        {suc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="contrasenia" className="form-label">
                                Contraseña:
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                id="contrasenia"
                                value={contrasenia}
                                onChange={(e) => this.setState({ contrasenia: e.target.value, error: "" })}
                                placeholder="Ingresa la contraseña"
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg w-100">
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
            </div>
        );
    }
}

export default Login;
