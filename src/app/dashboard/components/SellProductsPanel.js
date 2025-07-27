import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-semibold text-base transition-all
      ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
    >
      {message}
    </div>
  );
}

const SellProductsPanel = (props) => {
  const React = require('react');
  const { useEffect, useState, useRef } = React;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => ({ name: '', description: '', price: '', location: { lat: 19.0760, lng: 72.8777 } }));
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [fieldErrors, setFieldErrors] = useState({});
  const searchBoxRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  // Dynamically import leaflet only on client
  const [leaflet, setLeaflet] = useState(null);
  useEffect(() => {
    (async () => {
      const L = await import('leaflet');
      setLeaflet(L);
      await import('leaflet/dist/leaflet.css');
    })();
  }, []);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default to Mumbai if no user location
  const defaultLoc = props.user?.location?.coordinates
    ? { lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }
    : { lat: 19.0760, lng: 72.8777 }; // Mumbai

  // Remove the useEffect that sets form.location to defaultLoc after mount, as it's now set in initial state

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchError('');
    setSearchLoading(true);
    setSearchResults([]);
    if (!value.trim()) {
      setSearchLoading(false);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchError('Failed to search places.');
    }
    setSearchLoading(false);
  };

  // Custom marker icon (Leaflet's default icon fix for React)
  const markerIcon = leaflet ? new leaflet.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }) : undefined;

  // Draggable marker logic
  let DraggableMarker = null;
  if (leaflet) {
    const { Marker, useMapEvents } = require('react-leaflet');
    DraggableMarker = () => {
      const markerRef = useRef(null);
      useMapEvents({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const latlng = marker.getLatLng();
            setForm(f => ({ ...f, location: { lat: latlng.lat, lng: latlng.lng } }));
          }
        },
      });
      return (
        <Marker
          draggable
          position={form.location || defaultLoc}
          eventHandlers={{
            dragend: (e) => {
              const latlng = e.target.getLatLng();
              setForm(f => ({ ...f, location: { lat: latlng.lat, lng: latlng.lng } }));
            },
          }}
          icon={markerIcon}
          ref={markerRef}
        />
      );
    };
  }

  let MapContainer = null;
  let TileLayer = null;
  if (leaflet) {
    const rl = require('react-leaflet');
    MapContainer = rl.MapContainer;
    TileLayer = rl.TileLayer;
  }

  function isValidLatLng(loc) {
    return (
      loc &&
      typeof loc.lat === 'number' &&
      typeof loc.lng === 'number' &&
      !isNaN(loc.lat) &&
      !isNaN(loc.lng)
    );
  }

  // Compress image using canvas
  async function compressImage(file, maxWidth = 600, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsArrayBuffer(blob);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Helper to convert byte array to base64 data URL
  function imageBytesToDataUrl(bytes) {
    if (!bytes || !Array.isArray(bytes.data || bytes)) return null;
    const arr = bytes.data || bytes;
    const base64 = typeof window !== 'undefined' ? window.btoa(String.fromCharCode.apply(null, arr)) : Buffer.from(arr).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  // Fetch distributor's products
  useEffect(() => {
    if (!props.user?._id) return;
    setLoading(true);
    fetch(`/api/products?seller=${props.user._id}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [props.user, toast]);

  // Handle form input
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFieldErrors(errors => ({ ...errors, [name]: undefined }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Compress image and store bytes
      const compressed = await compressImage(file);
      setCompressedImage(compressed);
    } else {
      setImageFile(null);
      setImagePreview(null);
      setCompressedImage(null);
    }
  };

  // Handle product add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setFieldErrors({});
    let errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errors.price = 'Valid price is required.';
    if (!form.location) errors.location = 'Location is required.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setToast({ message: 'Please fix the errors in the form.', type: 'error' });
      setFormLoading(false);
      return;
    }
    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      seller: props.user._id,
      location: {
        type: 'Point',
        coordinates: [form.location.lng, form.location.lat],
      },
      image: compressedImage ? Array.from(new Uint8Array(compressedImage)) : undefined,
    };
    try {
      const res = await fetch(`/api/products${editingId ? '/' + editingId : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');
      setToast({ message: editingId ? 'Product updated!' : 'Product added!', type: 'success' });
      setForm({ name: '', description: '', price: '', location: form.location });
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setCompressedImage(null);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
    setFormLoading(false);
  };

  // Handle edit
  const handleEdit = product => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      location: {
        lat: product.location.coordinates[1],
        lng: product.location.coordinates[0],
      },
    });
    setEditingId(product._id);
  };

  // Handle delete
  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setToast({ message: 'Product deleted!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl p-8 border border-green-100 min-h-[600px] flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center gap-2 drop-shadow-sm">
        <span className="inline-block bg-green-100 text-green-700 rounded-full px-4 py-1 text-lg font-bold shadow">Sell Products</span>
        <span className="text-base font-normal text-green-500/70">(Distributor)</span>
      </h2>
      {/* Prominent error display */}
      {(toast.message) && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
      )}
      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl p-8 mb-8 shadow-lg flex flex-col gap-6 border border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-green-800 font-semibold mb-2">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={`w-full border rounded-xl px-5 py-3 text-green-900 bg-green-50 focus:ring-2 focus:ring-green-400 shadow-sm transition-all ${fieldErrors.name ? 'border-red-500' : 'border-green-200'}`} required />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="block text-green-800 font-semibold mb-2">Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className={`w-full border rounded-xl px-5 py-3 text-green-900 bg-green-50 focus:ring-2 focus:ring-green-400 shadow-sm transition-all ${fieldErrors.price ? 'border-red-500' : 'border-green-200'}`} required />
            {fieldErrors.price && <p className="text-red-500 text-xs mt-1">{fieldErrors.price}</p>}
          </div>
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-green-200 rounded-xl px-5 py-3 text-green-900 bg-green-50 focus:ring-2 focus:ring-green-400 shadow-sm transition-all" rows={2} />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-2">Product Image</label>
          <div className="flex flex-col md:flex-row items-center gap-6 mb-2">
            <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-green-400 rounded-2xl cursor-pointer bg-white hover:bg-green-50 transition-all shadow-md">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-green-600 font-bold text-4xl">+</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {imageFile && (
              <div className="flex flex-col gap-1">
                <span className="text-green-700 text-xs font-medium">{imageFile.name}</span>
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setCompressedImage(null); }} className="text-red-500 text-xs hover:underline">Remove</button>
              </div>
            )}
          </div>
          <div className="text-green-600/70 text-xs">Upload a product image (JPG, PNG, etc.).</div>
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-2">Location</label>
          <div className="mb-2">
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="Search for a place..."
              className={`w-full border rounded-xl px-5 py-3 text-green-900 bg-green-50 focus:ring-2 focus:ring-green-400 mb-2 shadow-sm transition-all ${fieldErrors.location ? 'border-red-500' : 'border-green-200'}`}
              autoComplete="off"
              onChange={handleSearch}
            />
            {searchLoading && <div className="text-xs text-green-600/70">Searching...</div>}
            {searchError && <div className="text-xs text-red-600">{searchError}</div>}
            {searchResults.length > 0 && (
              <ul className="bg-white border rounded-xl shadow max-h-40 overflow-y-auto mt-1 z-10">
                {searchResults.map((result, idx) => (
                  <li
                    key={result.place_id}
                    className="px-3 py-2 hover:bg-green-100 cursor-pointer text-green-900 text-sm rounded"
                    onClick={() => {
                      setForm(f => ({ ...f, location: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) } }));
                      setSearchResults([]);
                      if (searchBoxRef.current) searchBoxRef.current.value = result.display_name;
                    }}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
            {fieldErrors.location && <p className="text-red-500 text-xs mt-1">{fieldErrors.location}</p>}
          </div>
          <div className="w-full h-56 rounded-2xl border border-green-200 shadow-inner flex items-center justify-center bg-green-50">
            {isClient && leaflet && MapContainer && TileLayer && isValidLatLng(form.location || defaultLoc) && (
              <MapContainer
                center={isValidLatLng(form.location) ? form.location : defaultLoc}
                zoom={13}
                style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {isValidLatLng(form.location) && DraggableMarker && <DraggableMarker />}
              </MapContainer>
            )}
          </div>
          {isValidLatLng(form.location) && (
            <div className="text-green-800 text-xs mt-2">
              <span className="font-semibold">Selected Coordinates:</span> <span>Lat: {form.location.lat.toFixed(6)}, Lng: {form.location.lng.toFixed(6)}</span>
            </div>
          )}
          <div className="text-green-600/70 text-xs mt-1">Drag the marker or search to set product location.</div>
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" disabled={formLoading} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:from-green-600 hover:to-green-700 transition-all text-lg">
            {editingId ? (formLoading ? 'Updating...' : 'Update Product') : (formLoading ? 'Adding...' : 'Add Product')}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', location: form.location }); }} className="bg-gray-200 text-green-800 px-8 py-3 rounded-xl font-bold shadow hover:bg-gray-300 transition-all text-lg">
              Cancel
            </button>
          )}
        </div>
      </form>
      {/* Product List */}
      <div className="bg-white/90 rounded-2xl p-8 shadow-lg border border-green-100">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Your Products</h3>
        {loading ? (
          <div className="text-green-700/70 text-lg font-medium">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-green-700/70 text-lg font-medium">No products found.</div>
        ) : (
          <ul className="divide-y divide-green-100">
            {products.map(product => (
              <li key={product._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-green-50 rounded-xl transition-all">
                <div className="flex items-center gap-6">
                  {product.image && (
                    <img
                      src={imageBytesToDataUrl(product.image)}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-green-200 shadow bg-white"
                    />
                  )}
                  <div>
                    <div className="font-bold text-green-900 text-xl mb-1">{product.name}</div>
                    <div className="text-green-800/80 text-sm mb-1">{product.description}</div>
                    <div className="text-green-700/60 text-xs">Location: [{product.location.coordinates[1].toFixed(5)}, {product.location.coordinates[0].toFixed(5)}]</div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-green-700 font-extrabold text-xl">₹{product.price}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-all">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SellProductsPanel), { ssr: false }); 