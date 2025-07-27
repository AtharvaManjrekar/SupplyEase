import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const ProductsNearbyPanel = ({ userData }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [leaflet, setLeaflet] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [orderLoading, setOrderLoading] = useState(null);
  const [orderMessage, setOrderMessage] = useState(null);

  useEffect(() => {
    setIsClient(true);
    (async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      setLeaflet(L);
    })();
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }, []);

  // Fetch products nearby
  useEffect(() => {
    if (!location) return;
    setFetchingProducts(true);
    fetch(`/api/products/nearby?lat=${location.lat}&lng=${location.lng}&maxDistance=5000`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError(data.error || 'Failed to fetch products nearby.');
        }
        setFetchingProducts(false);
      })
      .catch(() => {
        setError('Failed to fetch products nearby.');
        setFetchingProducts(false);
      });
  }, [location]);

  // Helper: assign a unique color to each distributor
  function getDistributorColor(distributorId, idx) {
    // Use a color palette or hash
    const palette = [
      '#e11d48', // rose
      '#f59e42', // orange
      '#fbbf24', // yellow
      '#10b981', // green
      '#3b82f6', // blue
      '#6366f1', // indigo
      '#a21caf', // purple
      '#f43f5e', // pink
      '#14b8a6', // teal
      '#f97316', // amber
    ];
    if (!distributorId) return palette[idx % palette.length];
    let hash = 0;
    for (let i = 0; i < distributorId.length; i++) hash = distributorId.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
  }

  async function handleOrder(productId) {
    setOrderLoading(productId);
    setOrderMessage(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, buyerId: userData?._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      setOrderMessage({ type: 'success', text: 'Order placed successfully!' });
    } catch (err) {
      setOrderMessage({ type: 'error', text: err.message });
    }
    setOrderLoading(null);
  }

  let MapContainer = null;
  let TileLayer = null;
  let Marker = null;
  let Popup = null;
  if (leaflet) {
    const rl = require('react-leaflet');
    MapContainer = rl.MapContainer;
    TileLayer = rl.TileLayer;
    Marker = rl.Marker;
    Popup = rl.Popup;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
        Products Nearby
        <span className="text-base font-normal text-black/60">(Vendor)</span>
      </h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-black/70">Fetching your location...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex-1 mb-6">
            <div className="w-full h-[400px] rounded-2xl border border-green-100 shadow-inner overflow-hidden">
              {isClient && leaflet && MapContainer && TileLayer && Marker && location && (
                <MapContainer
                  center={location}
                  zoom={14}
                  style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* User marker */}
                  <Marker
                    position={location}
                    icon={leaflet.divIcon({
                      className: '',
                      html: `<div style='background:#16a34a;width:18px;height:18px;border-radius:50%;border:3px solid #2563eb;box-shadow:0 0 0 2px #fff;'></div>`
                    })}
                  >
                    <Popup>Your Location</Popup>
                  </Marker>
                  {/* Distributor/product markers */}
                  {products.map((product, idx) => (
                    <Marker
                      key={product._id}
                      position={{
                        lat: product.location.coordinates[1],
                        lng: product.location.coordinates[0],
                      }}
                      icon={leaflet.divIcon({
                        className: '',
                        html: `<div style='background:${getDistributorColor(product.seller, idx)};width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #888;'></div>`
                      })}
                    >
                      <Popup>
                        <div className="font-bold">{product.name}</div>
                        <div>{product.description}</div>
                        <div className="text-green-700 font-semibold">₹{product.price}</div>
                        <div className="text-xs text-black/60">{(product.distance/1000).toFixed(2)} km away</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Nearby Products</h3>
            {fetchingProducts ? (
              <div className="text-black/70">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-black/70">No products found nearby.</div>
            ) : (
              <>
                {orderMessage && (
                  <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${orderMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{orderMessage.text}</div>
                )}
                <ul className="divide-y divide-gray-200">
                  {products.map((product, idx) => (
                    <li key={product._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: getDistributorColor(product.seller, idx) }}></span>
                        <div>
                          <div className="font-bold text-black text-lg">{product.name}</div>
                          <div className="text-black/70 text-sm">{product.description}</div>
                          <div className="text-black/70 text-sm">Seller: {product.sellerInfo?.firstName} {product.sellerInfo?.lastName} ({product.sellerInfo?.email})</div>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="text-green-700 font-semibold text-lg">₹{product.price}</div>
                        <div className="text-black/60 text-sm">{(product.distance/1000).toFixed(2)} km away</div>
                        <button
                          className="mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={orderLoading === product._id}
                          onClick={() => handleOrder(product._id)}
                        >
                          {orderLoading === product._id ? 'Placing Order...' : 'Order'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProductsNearbyPanel), { ssr: false }); 