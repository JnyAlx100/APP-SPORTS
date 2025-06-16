import React, { useState } from 'react';

export default function Profile() {
  // Datos simulados del usuario
  const initialUser = {
    nombres: 'Juan',
    apellidos: 'Pérez',
    nit: '1234567-8',
    direccionFacturacion: 'Ciudad de Guatemala, Zona 10',
    correo: 'juan.perez@example.com'
  };

  const [user, setUser] = useState(initialUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Datos guardados:', user);
    alert('Perfil actualizado correctamente');
  };

  const handleBack = () => {
    // Simulación de navegación (puedes integrar con React Router luego)
    alert('Regresando al panel de control');
  };

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
          value={user.correo}
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
