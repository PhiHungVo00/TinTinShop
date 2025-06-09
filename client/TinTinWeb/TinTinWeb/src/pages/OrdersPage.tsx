import { useEffect, useState } from 'react';
import { fetchOrders } from '../api';
import { useAuth } from '../AuthContext';

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role?.name?.toLowerCase() === 'admin';

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetchOrders(token)
      .then(setOrders)
      .catch(e => setError(e.message));
  }, [token, isAdmin]);

  if (!token) return <p>Please login.</p>;
  if (!isAdmin) return <p>Unauthorized</p>;

  return (
    <div>
      <h2>Orders</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {orders.map(o => (
          <li key={o.id}>Order #{o.id}</li>
        ))}
      </ul>
    </div>
  );
}
