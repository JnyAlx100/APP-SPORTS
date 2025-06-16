import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {

  const navigate = useNavigate();

  const initialOrders = [
    {
      id: 'ORD001',
      direccion: 'Ciudad de Guatemala, Zona 10',
      detalle: [
        { nombre: 'Balón de Fútbol', cantidad: 2, precio: 250 },
        { nombre: 'Guantes de Boxeo', cantidad: 1, precio: 300 }
      ],
      status: 'Entregado'
    },
    {
      id: 'ORD002',
      direccion: 'Mixco, Zona 4',
      detalle: [
        { nombre: 'Pesas 10kg', cantidad: 3, precio: 150 }
      ],
      status: 'En Proceso'
    },
    {
      id: 'ORD003',
      direccion: 'Villa Nueva, Zona 5',
      detalle: [
        { nombre: 'Raqueta de Tenis', cantidad: 1, precio: 500 },
        { nombre: 'Balón de Fútbol', cantidad: 1, precio: 250 }
      ],
      status: 'Cancelado'
    }
  ];

  const [orders] = useState(initialOrders);

  const calcularTotal = (detalle) => {
    return detalle.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  };

  const handleBack = () => {
    navigate('/control-panel')
  };

  return (
    <div style={styles.container}>
      <h2>Órdenes de Compra</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeaderCell}>ID</th>
            <th style={styles.tableHeaderCell}>Dirección de Facturación</th>
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

      <button onClick={handleBack} style={styles.backButton}>Regresar</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '90%',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
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
