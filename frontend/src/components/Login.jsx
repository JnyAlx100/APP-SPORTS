import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    try {
      const loginResponse = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email,
          password,
        }
      );
      console.log("Email:", email);
      console.log("Password:", password);
      console.log(loginResponse.data);
      if (loginResponse.status != 200) {
        throw new Error("Error en la solicitud");
      }
      navigate("/control-panel");
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleForgotPassword = () => {
    alert('Redirigir a recuperar contraseña');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Iniciar sesión</h2>

        <div style={styles.inputGroup}>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center'}}>
          <button type="submit" style={styles.button}>
            Ingresar
          </button>
          <button type="button" style={styles.registryButton} onClick={handleRegister}>
            Registrarse
          </button>
        </div>

        <div style={styles.forgotPassword}>
          <label onClick={handleForgotPassword} style={styles.link}>
            ¿Olvidaste tu contraseña?
          </label>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '40%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  registryButton: {
    width: '40%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  forgotPassword: {
    marginTop: '15px',
    textAlign: 'center'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};