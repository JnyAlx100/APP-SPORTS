import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    nit: '',
    direccionFacturacion: '',
    email: '',
    password: '',
    fechaNacimiento: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleBack = () => {
    navigate('/')
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Registro de Usuario</h2>

        <div style={styles.inputGroup}>
          <label>Nombres:</label>
          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Apellidos:</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>NIT:</label>
          <input type="text" name="nit" value={formData.nit} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Dirección de facturación:</label>
          <input type="text" name="direccionFacturacion" value={formData.direccionFacturacion} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Correo electrónico:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Fecha de nacimiento:</label>
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} style={styles.input} />
        </div>

        <button type="submit" style={styles.button}>Registrar</button>

        <button type="button" onClick={handleBack} style={styles.backButton}>Regresar</button>
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
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  backButton: {
    padding: '12px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};
