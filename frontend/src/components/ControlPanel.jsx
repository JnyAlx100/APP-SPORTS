import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function ControlPanel() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  const [articulos, setArticulos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [direccionFacturacion, setDireccionFacturacion] = useState('');
  const [nitUsuario, setNitUsuario] = useState('');
  const [editandoDireccion, setEditandoDireccion] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    actualizarArticulos();
    obtenerDatosUsuario();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const actualizarArticulos = async () => {
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

  const obtenerDatosUsuario = async () => {
    try {
      const userResponse = await axiosInstance.get(`http://localhost:8080/user/${localStorage.getItem('email')}`);
      if (userResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      setUserInfo(userResponse.data);
      setDireccionFacturacion(userResponse.data.direccionFacturacion);
      setNitUsuario(userResponse.data.nit);
    } catch (error) {
      alert("No se pudieron obtener los datos del usuario");
      console.error("Error al obtener usuario:", error);
    }
  };

  const agregarAlCarrito = (articulo) => {
    if (articulo.stock === 0) {
      alert('No hay stock disponible');
      return;
    }
    setTotal(prevTotal => prevTotal + articulo.precio);

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

  const quitarDelCarrito = (articulo) => {
    const itemEnCarrito = carrito.find(item => item.id === articulo.id);
    if (!itemEnCarrito) return;

    setTotal(prevTotal => prevTotal - articulo.precio);

    if (itemEnCarrito.cantidad === 1) {
      const nuevoCarrito = carrito.filter(item => item.id !== articulo.id);
      setCarrito(nuevoCarrito);
    } else {
      const nuevoCarrito = carrito.map(item =>
        item.id === articulo.id ? { ...item, cantidad: item.cantidad - 1 } : item
      );
      setCarrito(nuevoCarrito);
    }

    const nuevosArticulos = articulos.map(item =>
      item.id === articulo.id ? { ...item, stock: item.stock + 1 } : item
    );
    setArticulos(nuevosArticulos);
  };

  const confirmarPedido = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (direccionFacturacion.trim() === '') {
      alert('Debe ingresar una dirección de facturación');
      return;
    }

    const orderId = generateOrderId();

    try {
      const detalles = carrito.map(item => ({
        pedido: { id: orderId },
        articulo: { id: item.id },
        cantidad: item.cantidad
      }));

      const loginResponse = await axiosInstance.post(
        "http://localhost:8080/order",
        {
          id: orderId,
          status: "COMPLETADO",
          direccionFacturacion,
          total,
          usuario: { id: userInfo.id },
          detalles
        }
      );
      if (loginResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      alert(`Su pedido ${orderId} se ha procesado exitosamente`);
    } catch (error) {
      alert('Error al realizar el pedido');
      console.error("Error:", error);
    }

    actualizarArticulos();
    setCarrito([]);
    setDireccionFacturacion('');
  };

  const generateOrderId = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[randomIndex];
    }
    return codigo;
  };

  const handleProfile = () => navigate('/profile');
  const handleOrders = () => navigate('/orders');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    navigate('/');
  };

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

      <div style={isMobile ? styles.mobileContent : styles.mainContent}>
        <div style={styles.articlesSection}>
          <h2>Lista de Artículos</h2>
          <div style={styles.articlesGrid}>
            {articulos.map((item) => (
              <div key={item.id} style={styles.articleCard}>
                <img src={item.urlImagen} alt={item.nombre} style={styles.image} />
                <h4>{item.nombre}</h4>
                <p>{item.descripcion}</p>
                <p><strong>Q{item.precio}</strong></p>
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
                  <button onClick={() => quitarDelCarrito(item)} style={styles.removeButton}>Quitar</button>
                </li>
              ))}
            </ul>
          )}
          <h3>Total: Q{total}</h3>

          <div style={styles.formGroup}>
            <label>NIT:</label>
            <input type="text" value={nitUsuario} readOnly style={styles.inputField} />
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
    padding: '20px',
    gap: '30px',
    flexDirection: 'row',
  },
  mobileContent: {
    display: 'flex',
    padding: '20px',
    flexDirection: 'column',
  },
  articlesSection: { flex: 3 },
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  cartSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '20px',
    color: '#fff',
    cursor: 'pointer'
  },
  removeButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer'
  },
  confirmButton: {
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '5px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  },
  formGroup: { marginBottom: '15px' },
  inputField: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  inputRow: {
    display: 'flex',
    gap: '10px'
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
