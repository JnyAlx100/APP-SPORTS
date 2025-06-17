import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (!fieldsAreValid()) {
        return;
      }
      const loginResponse = await axios.post(
        "http://localhost:8080/auth/register",
        {
          direccionFacturacion: formData.direccionFacturacion,
          password: formData.password,
          nit: formData.nit,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          fechaNacimiento: formData.fechaNacimiento
        }
      );
      console.log("form:", JSON.stringify(formData));
      console.log(loginResponse.data);
      if (loginResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      alert('Usuario creado exitosamente')
      cleanFields()
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const cleanFields = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      nit: "",
      direccionFacturacion: "",
      email: "",
      password: "",
      fechaNacimiento: "",
    });
  };

  const fieldsAreValid = () => {
    if (!formData.fechaNacimiento || formData.fechaNacimiento == '') {
      alert('Por favor, ingrese una fecha de nacimiento');
      return false;
    }
    if (esMenorDeEdad()) {
      alert('El usuario debe ser mayor de edad')
      return false;
    }
    console.log(formData.fechaNacimiento)
    return true
  }

  function esMenorDeEdad() {
  const fechaNacimiento = new Date(formData.fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  const mesActual = hoy.getMonth();
  const mesNacimiento = fechaNacimiento.getMonth();

  if (mesActual < mesNacimiento || 
     (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  
  return edad < 18;
}

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
