import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { useAuth } from '../AuthContext';

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchProducts(token)
      .then(setProducts)
      .catch(e => setError(e.message));
  }, [token]);

  if (!token) {
    return <p>Please login.</p>;
  }

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
