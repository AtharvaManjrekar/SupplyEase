"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export default function OrdersPage({ userData, role }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const lastSeenRef = useRef(null);
  const socketRef = useRef(null);
  const loadingRef = useRef(false);

  // Fetch orders function (ref for use in socket events)
  const fetchOrders = useCallback(async () => {
    if (!userData?._id) return;
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const param = role === 'distributor' ? 'seller' : 'buyer';
      const res = await fetch(`/api/orders?${param}=${userData._id}`);
      const data = await res.json();
      if (!res || !Array.isArray(data)) throw new Error(data.error || 'Failed to fetch orders');
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    loadingRef.current = false;
  }, [userData, role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Notification badge logic (localStorage-based)
  useEffect(() => {
    if (role === 'distributor' && orders.length > 0) {
      const pendingCount = orders.filter(o => o.status === 'pending').length;
      const lastSeen = parseInt(localStorage.getItem('orders_last_seen') || '0', 10);
      if (pendingCount > lastSeen) {
        setToast({ type: 'info', text: `You have ${pendingCount} new order(s)!` });
      }
      lastSeenRef.current = pendingCount;
      localStorage.setItem('orders_last_seen', pendingCount);
    }
  }, [orders, role]);

  // Socket.io real-time notifications
  useEffect(() => {
    if (!userData?._id) return;
    if (!socketRef.current) {
      socketRef.current = io();
    }
    const socket = socketRef.current;
    // New order notification for distributors
    socket.on('order:new', ({ order, seller }) => {
      if (role === 'distributor' && seller === userData._id) {
        setToast({ type: 'info', text: 'New order received!' });
        fetchOrders();
      }
    });
    // Order status update notification for buyer/seller
    socket.on('order:status', ({ order, seller, buyer }) => {
      if ((role === 'distributor' && seller === userData._id) || (role === 'vendor' && buyer === userData._id)) {
        setToast({ type: 'info', text: `Order status updated: ${order.status}` });
        fetchOrders();
      }
    });
    return () => {
      socket.off('order:new');
      socket.off('order:status');
    };
  }, [userData, role, fetchOrders]);

  async function updateOrderStatus(orderId, status) {
    setToast(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: data.status } : o));
      setToast({ type: 'success', text: `Order marked as ${status}` });
    } catch (err) {
      setToast({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl p-8 border border-green-100 min-h-[600px] flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center gap-2 drop-shadow-sm">
        <span className="inline-block bg-green-100 text-green-700 rounded-full px-4 py-1 text-lg font-bold shadow">{role === 'distributor' ? 'Your Sales' : 'Your Orders'}</span>
        {role === 'distributor' && orders.some(o => o.status === 'pending') && (
          <span className="ml-4 inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">{orders.filter(o => o.status === 'pending').length} New</span>
        )}
      </h2>
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${toast.type === 'success' ? 'bg-green-100 text-green-700' : toast.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{toast.text}</div>
      )}
      {loading ? (
        <div className="text-green-700/70 text-lg font-medium">Loading...</div>
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-green-700/70 text-lg font-medium">No orders found.</div>
      ) : (
        <ul className="divide-y divide-green-100">
          {orders.map(order => (
            <li key={order._id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-green-50 rounded-xl transition-all">
              <div className="flex items-center gap-6">
                <div>
                  <div className="font-bold text-green-900 text-xl mb-1">{order.product?.name || 'Product'}</div>
                  <div className="text-green-800/80 text-sm mb-1">{order.product?.description}</div>
                  {role === 'distributor' ? (
                    <div className="text-green-700/60 text-xs">Buyer: {order.buyerInfo?.firstName} {order.buyerInfo?.lastName} ({order.buyerInfo?.email})</div>
                  ) : (
                    <div className="text-green-700/60 text-xs">Seller: {order.sellerInfo?.firstName} {order.sellerInfo?.lastName} ({order.sellerInfo?.email})</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <div className="text-green-700 font-extrabold text-xl">Status: {order.status}</div>
                <div className="text-black/60 text-sm">{new Date(order.createdAt).toLocaleString()}</div>
                {role === 'distributor' && order.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => updateOrderStatus(order._id, 'accepted')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all">Accept</button>
                    <button onClick={() => updateOrderStatus(order._id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all">Reject</button>
                  </div>
                )}
                {role === 'distributor' && order.status === 'accepted' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => updateOrderStatus(order._id, 'completed')} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all">Mark as Completed</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 