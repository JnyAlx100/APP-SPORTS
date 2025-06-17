import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    obtenerOrdenes();
  }, []);

  const obtenerOrdenes = async () => {
    try {
      const userResponse = await axiosInstance.get(
        `http://localhost:8080/order/${localStorage.getItem("email")}`
      );
      if (userResponse.status !== 200) {
        throw new Error("Error en la solicitud");
      }
      let incomingOrders = [];
      userResponse.data.forEach(item => {
        let detalles = [];
        item.detalles.forEach(detalle => {
          detalles.push({
            nombre: detalle.articulo.nombre,
            cantidad: detalle.cantidad,
            precio: detalle.articulo.precio
          });
        });
        incomingOrders.push({
          id: item.id,
          direccion: item.direccionFacturacion,
          status: item.status,
          detalle: detalles
        });
      });
      setOrders(incomingOrders);
    } catch (error) {
      alert("No se pudieron obtener las órdenes");
      console.error("Error al obtener órdenes:", error);
    }
  };

  const calcularTotal = (detalle) => {
    return detalle.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  };

  const handleBack = () => {
    navigate('/control-panel');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Órdenes de Compra</h2>

      {/* Vista en tabla para desktop */}
      <div className="desktop" style={styles.desktopTable}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeaderCell}>ID</th>
              <th style={styles.tableHeaderCell}>Dirección</th>
              <th style={styles.tableHeaderCell}>Detalle</th>
              <th style={styles.tableHeaderCell}>Total</th>
              <th style={styles.tableHeaderCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={styles.tableCell}>{order.id}</td>
                <td style={styles.tableCell}>{order.direccion}</td>
                <td style={styles.tableCell}>
                  <ul style={styles.list}>
                    {order.detalle.map((item, idx) => (
                      <li key={idx}>
                        {item.nombre} x{item.cantidad} - Q{item.precio * item.cantidad}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.tableCell}>Q{calcularTotal(order.detalle)}</td>
                <td style={styles.tableCell}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista en cards para móvil */}
      <div className="mobile" style={styles.mobileCards}>
        {orders.map(order => (
          <div key={order.id} style={styles.card}>
            <h3>ID: {order.id}</h3>
            <p><strong>Dirección:</strong> {order.direccion}</p>
            <p><strong>Detalle:</strong></p>
            <ul>
              {order.detalle.map((item, idx) => (
                <li key={idx}>
                  {item.nombre} x{item.cantidad} - Q{item.precio * item.cantidad}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> Q{calcularTotal(order.detalle)}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>

      <button onClick={handleBack} style={styles.backButton}>Regresar</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  desktopTable: {
    display: 'none',
  },
  mobileCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderCell: {
    borderBottom: '2px solid #ccc',
    textAlign: 'center',
    padding: '10px'
  },
  tableCell: {
    textAlign: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'top'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'left'
  },
  backButton: {
    marginTop: '20px',
    padding: '12px 20px',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

// Responsive con media query
const mediaQuery = window.matchMedia('(min-width: 768px)');
function updateResponsiveView() {
  const desktop = document.querySelector('.desktop');
  const mobile = document.querySelector('.mobile');
  if (mediaQuery.matches) {
    desktop.style.display = 'block';
    mobile.style.display = 'none';
  } else {
    desktop.style.display = 'none';
    mobile.style.display = 'block';
  }
}
window.addEventListener('resize', updateResponsiveView);
window.addEventListener('DOMContentLoaded', updateResponsiveView);
