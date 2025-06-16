import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ControlPanel() {
  const navigate = useNavigate();
  
  const initialArticulos = [
    { id: 1, nombre: 'Balón de Fútbol', descripcion: 'Balón profesional', monto: 250, stock: 10, imagen: 'https://via.placeholder.com/100?text=Balon' },
    { id: 2, nombre: 'Raqueta de Tenis', descripcion: 'Raqueta de carbono', monto: 500, stock: 5, imagen: 'https://via.placeholder.com/100?text=Raqueta' },
    { id: 3, nombre: 'Guantes de Boxeo', descripcion: 'Guantes de cuero', monto: 300, stock: 8, imagen: 'https://via.placeholder.com/100?text=Guantes' },
    { id: 4, nombre: 'Pesas 10kg', descripcion: 'Par de pesas', monto: 150, stock: 15, imagen: 'https://via.placeholder.com/100?text=Pesas' }
  ];

  const nitUsuario = '1234567-8';

  const [articulos, setArticulos] = useState(initialArticulos);
  const [carrito, setCarrito] = useState([]);
  const [direccionFacturacion, setDireccionFacturacion] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleOrders = () => {
    navigate('/orders')
  }

  const handleLogout = () => {
    navigate('/')
  }

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

      <div style={styles.content}>
        <h2>Lista de Artículos</h2>

        {!isMobile ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeaderCell}>Artículo</th>
                <th style={styles.tableHeaderCell}>Descripción</th>
                <th style={styles.tableHeaderCell}>Monto</th>
                <th style={styles.tableHeaderCell}>Stock</th>
                <th style={styles.actionHeaderCell}></th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((item) => (
                <tr key={item.id}>
                  <td style={styles.tableCell}>
                    <div style={styles.articleContainer}>
                      <img src={item.imagen} alt={item.nombre} style={styles.image} />
                      <div>{item.nombre}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{item.descripcion}</td>
                  <td style={styles.tableCell}>Q{item.monto}</td>
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
        ) : (
          <div style={styles.mobileList}>
            {articulos.map(item => (
              <div key={item.id} style={styles.mobileCard}>
                <img src={item.imagen} alt={item.nombre} style={styles.image} />
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <p>Q{item.monto}</p>
                <p>Stock: {item.stock}</p>
                <button
                  onClick={() => agregarAlCarrito(item)}
                  style={styles.addButton}
                  disabled={item.stock === 0}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}

        <h2>Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>No hay artículos en el carrito.</p>
        ) : (
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.nombre} x{item.cantidad} - Q{item.monto * item.cantidad}
              </li>
            ))}
          </ul>
        )}

        <div style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label>NIT:</label>
            <input type="text" value={nitUsuario} readOnly style={styles.smallInput} />
          </div>

          <div style={styles.formGroup}>
            <label>Dirección de Facturación:</label>
            <input
              type="text"
              value={direccionFacturacion}
              onChange={(e) => setDireccionFacturacion(e.target.value)}
              style={styles.smallInput}
              placeholder="Ingrese la dirección"
            />
          </div>
        </div>

        <button onClick={confirmarPedido} style={styles.confirmButton}>
          Confirmar Pedido
        </button>
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
  logo: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  menu: {
    display: 'flex',
    gap: '20px'
  },
  menuItem: {
    cursor: 'pointer'
  },
  content: {
    padding: '30px'
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
  actionHeaderCell: {
    borderBottom: 'none',
    textAlign: 'center',
    padding: '10px'
  },
  tableCell: {
    textAlign: 'center',
    padding: '10px'
  },
  actionCell: {
    textAlign: 'center',
    padding: '5px',
    border: 'none'
  },
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
    marginTop: '20px'
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
  mobileList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center'
  },
  mobileCard: {
    width: '90%',
    maxWidth: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  formGroup: {
    marginTop: '15px',
    width: '100%',
    maxWidth: '400px'
  },
  smallInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '5px'
  }
};
