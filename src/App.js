import logoCompleto from './logo completo boba-03.png';
import textura from './textura2.PNG';
import letras from './letras.png';
import './App.css';


import Login from "./componentes/Login";
import Listar from "./componentes/Listar";
import Crear from "./componentes/Crear";
import Editar from "./componentes/Editar";
import Buscar from "./componentes/Buscar";
import HistorialDeRegistro from "./componentes/Historial_de_registro";
import Recompensas from "./componentes/Recompensas";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autenticado: false,
      sucursal: ""
    };
  }

  componentDidMount() {
    // Verificar si hay sucursal guardada en localStorage
    const sucursalGuardada = localStorage.getItem('sucursalSeleccionada');
    if (sucursalGuardada) {
      this.setState({
        autenticado: true,
        sucursal: sucursalGuardada
      });
    }
  }

  handleLogin = (sucursal) => {
    this.setState({
      autenticado: true,
      sucursal: sucursal
    });
  };

  handleLogout = () => {
    localStorage.removeItem('sucursalSeleccionada');
    this.setState({
      autenticado: false,
      sucursal: ""
    });
  };

  render() {
    const { autenticado, sucursal } = this.state;

    if (!autenticado) {
      return <Login onLogin={this.handleLogin} />;
    }

    return (
      <div style={{backgroundImage: `url(${textura})`, backgroundRepeat: "repeat", minHeight: "100vh", margin: 0, padding: 0}}>
        <Router>
          <nav className="navbar navbar-expand" style={{background: "linear-gradient(135deg, #910101 0%, #000000 100%)"}}>
            <div className="nav navbar-nav">
              <Link className="nav-item nav-link active" to={"/"} style={{marginLeft: "7px"}}>
                <img src={logoCompleto} alt="Logo" style={{height: "80px", objectFit: "contain"}} />
                <span className="sr-only"></span>
              </Link>
              <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "20px"}}>
                <span style={{color: "white"}}><strong>{sucursal}</strong></span>
                <Link to="/" style={{marginTop: "13px"}}>
                  <img src={letras} alt="Registro" style={{height: "40px", objectFit: "contain"}} />
                </Link>
              </div>
            </div>
            <div className="nav navbar-nav ms-auto">
              <button className="btn btn-black" style={{color: "white"}} onClick={this.handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </nav>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Listar sucursal={sucursal} />} />
              <Route path="/Crear" element={<Crear sucursal={sucursal} />} />
              <Route path="/Editar/:id" element={<Editar sucursal={sucursal} />} />
              <Route path="/Buscar" element={<Buscar sucursal={sucursal} />} />
              <Route path="/Historial_de_registro/:id" element={<HistorialDeRegistro sucursal={sucursal} />} />
              <Route path="/Recompensas/:id" element={<Recompensas />} />
            </Routes>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;