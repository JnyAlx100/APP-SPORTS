import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userResponse = await axiosInstance.patch(`http://localhost:8080/user`, {
        id: user.id,
        direccionFacturacion: user.direccionFacturacion,
        nit: user.nit,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email
      });
      if (userResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      console.log('Datos guardados:', user);
      alert('Perfil actualizado correctamente');
      obtenerDatosUsuario()
    } catch (error) {
      alert("No se pudieron actualizar los datos");
      console.error("Error al actualizar datos:", error);
    }
  };

  const handleBack = () => {
    navigate('/control-panel')
  };

  const obtenerDatosUsuario = async () => {
    try {
      const userResponse = await axiosInstance.get(`http://localhost:8080/user/${localStorage.getItem('email')}`);
      if (userResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      setUser(userResponse.data)
    } catch (error) {
      alert("No se pudieron obtener los articulos");
      console.error("Error al obtener articulos:", error);
    }
  }

  useEffect(() => {
    obtenerDatosUsuario()
  }, []);

  return (
    <div style={styles.container}>
      <h2>Perfil de Usuario</h2>

      <div style={styles.formGroup}>
        <label>Nombres:</label>
        <input
          type="text"
          name="nombres"
          value={user.nombres}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Apellidos:</label>
        <input
          type="text"
          name="apellidos"
          value={user.apellidos}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>NIT:</label>
        <input
          type="text"
          name="nit"
          value={user.nit}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Dirección de facturación:</label>
        <input
          type="text"
          name="direccionFacturacion"
          value={user.direccionFacturacion}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Correo electrónico:</label>
        <input
          type="email"
          name="correo"
          value={user.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveButton}>Guardar Cambios</button>
        <button onClick={handleBack} style={styles.backButton}>Regresar</button>
      </div>
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '20px'
  },
  saveButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  backButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
