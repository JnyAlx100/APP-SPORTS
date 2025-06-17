import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function ControlPanel() {
  const navigate = useNavigate();

  const nitUsuario = '1234567-8';

  const [articulos, setArticulos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [direccionFacturacion, setDireccionFacturacion] = useState('');
  const [editandoDireccion, setEditandoDireccion] = useState(false);

  useEffect(() => {
    actualizarCarrito();
  }, []);

  const actualizarCarrito = async () => {
    try {
      const articleResponse = await axiosInstance.get("http://localhost:8080/article");
      if (articleResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      setArticulos(articleResponse.data);
    } catch (error) {
      alert("No se pudieron obtener los articulos");
      console.error("Error al obtener articulos:", error);
    }
  };

  const obtenerDireccion = async () => {
    try {
      const articleResponse = await axiosInstance.get("http://localhost:8080/article");
      if (articleResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      setArticulos(articleResponse.data);
    } catch (error) {
      alert("No se pudieron obtener los articulos");
      console.error("Error al obtener articulos:", error);
    }
  }

  const agregarAlCarrito = (articulo) => {
    if (articulo.stock === 0) {
      alert('No hay stock disponible');
      return;
    }
    const nuevosArticulos = articulos.map(item =>
      item.id === articulo.id ? { ...item, stock: item.stock - 1 } : item
    );
    setArticulos(nuevosArticulos);

    const itemEnCarrito = carrito.find(item => item.id === articulo.id);
    if (itemEnCarrito) {
      const nuevoCarrito = carrito.map(item =>
        item.id === articulo.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito(prev => [...prev, { ...articulo, cantidad: 1 }]);
    }
  };

  const confirmarPedido = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (direccionFacturacion.trim() === '') {
      alert('Debe ingresar una dirección de facturación');
      return;
    }

    console.log('Pedido confirmado:', carrito);
    console.log('NIT:', nitUsuario);
    console.log('Dirección:', direccionFacturacion);

    alert('Pedido realizado exitosamente');
    setCarrito([]);
    setDireccionFacturacion('');
  };

  const handleProfile = () => navigate('/profile');
  const handleOrders = () => navigate('/orders');
  const handleLogout = () => navigate('/');

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>Control Panel</div>
        <div style={styles.menu}>
          <span style={styles.menuItem} onClick={handleProfile}>Perfil</span>
          <span style={styles.menuItem} onClick={handleOrders}>Órdenes</span>
          <span style={styles.menuItem} onClick={handleLogout}>Cerrar sesión</span>
        </div>
      </nav>

      <div style={styles.mainContent}>
        <div style={styles.articlesSection}>
          <h2>Lista de Artículos</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeaderCell}>Artículo</th>
                <th style={styles.tableHeaderCell}>Descripción</th>
                <th style={styles.tableHeaderCell}>Monto</th>
                <th style={styles.tableHeaderCell}>Stock</th>
                <th style={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((item) => (
                <tr key={item.id}>
                  <td style={styles.tableCell}>
                    <div style={styles.articleContainer}>
                      <img src={item.urlImagen} alt={item.nombre} style={styles.image} />
                      <div>{item.nombre}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{item.descripcion}</td>
                  <td style={styles.tableCell}>Q{item.precio}</td>
                  <td style={styles.tableCell}>{item.stock}</td>
                  <td style={styles.actionCell}>
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      style={styles.addButton}
                      disabled={item.stock === 0}
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.cartSection}>
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>No hay artículos en el carrito.</p>
          ) : (
            <ul>
              {carrito.map((item, index) => (
                <li key={index}>
                  {item.nombre} x{item.cantidad} - Q{item.precio * item.cantidad}
                </li>
              ))}
            </ul>
          )}

          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <label>NIT:</label>
              <div style={styles.inputRow}>
                <input type="text" value={nitUsuario} readOnly style={styles.inputField} />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Dirección de Facturación:</label>
              <div style={styles.inputRow}>
                <input
                  type="text"
                  value={direccionFacturacion}
                  onChange={(e) => setDireccionFacturacion(e.target.value)}
                  readOnly={!editandoDireccion}
                  style={styles.inputField}
                />
                {!editandoDireccion ? (
                  <button style={styles.editButton} onClick={() => setEditandoDireccion(true)}>Editar</button>
                ) : (
                  <button style={styles.saveButton} onClick={() => setEditandoDireccion(false)}>Guardar</button>
                )}
              </div>
            </div>
          </div>

          <button onClick={confirmarPedido} style={styles.confirmButton}>
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: '15px',
    color: '#fff'
  },
  logo: { fontSize: '20px', fontWeight: 'bold' },
  menu: { display: 'flex', gap: '20px' },
  menuItem: { cursor: 'pointer' },
  mainContent: {
    display: 'flex',
    padding: '30px',
    gap: '30px',
    alignItems: 'flex-start'
  },
  articlesSection: { flex: 3 },
  cartSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    alignSelf: 'flex-start'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  },
  tableHeaderCell: {
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    padding: '10px'
  },
  tableCell: { textAlign: 'center', padding: '10px' },
  actionCell: { textAlign: 'center', padding: '5px', border: 'none' },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '20px',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  confirmButton: {
    padding: '12px 20px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '4px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%'
  },
  image: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '5px'
  },
  articleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formContainer: {
    marginTop: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  inputField: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer'
  }
};
