import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function RecoverAccount() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    adminUser: '',
    adminPassword: '',
    accountEmail: '',
    accountNewPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:8080/auth/reset-password", form);
      if (response.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      alert("Cuenta recuperada exitosamente");
      setForm({
        adminUser: '',
        adminPassword: '',
        accountEmail: '',
        accountNewPassword: ''
      })
    } catch (error) {
      alert("Error al recuperar la cuenta");
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    navigate("/");  // Esto te regresa a la página anterior
  };

  return (
    <div style={styles.container}>
      <h2>Recuperar Cuenta de Usuario</h2>

      <div style={styles.formGroup}>
        <label>Usuario Administrador:</label>
        <input
          type="text"
          name="adminUser"
          value={form.adminUser}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Contraseña Administrador:</label>
        <input
          type="password"
          name="adminPassword"
          value={form.adminPassword}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Correo de la cuenta a recuperar:</label>
        <input
          type="email"
          name="accountEmail"
          value={form.accountEmail}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          name="accountNewPassword"
          value={form.accountNewPassword}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button onClick={handleSubmit} style={styles.submitButton}>Recuperar Cuenta</button>

      <button onClick={handleBack} style={styles.backButton}>Regresar</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '5px'
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  }
};
