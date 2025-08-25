'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  createdAt: string;
  orderId?: string;
  status: 'PENDING' | 'READ' | 'REPLIED';
}

export default function MessagesPage() {
  const { isSignedIn, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [orders, setOrders] = useState<Array<{ id: string; totalAmount: number; status: string; createdAt: string }>>([]);

  useEffect(() => {
    if (isSignedIn) {
      fetchMessages();
      fetchUserOrders();
    }
  }, [isSignedIn]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/messages/user/me', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders/user/me', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          orderId: selectedOrder || undefined,
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        setSelectedOrder('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-gray-600 mb-6">Mesajlarınızı görüntülemek için lütfen giriş yapın.</p>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mesajlarım</h1>
            <p className="text-gray-600 mt-2">
              Admin ekibimizle iletişime geçin ve siparişlerinizle ilgili sorularınızı sorun
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mesaj Geçmişi</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Mesajlar yükleniyor...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz mesaj yok</h3>
                    <p className="mt-1 text-sm text-gray-500">İlk mesajınızı göndererek başlayın.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.isFromUser
                            ? 'bg-blue-50 border border-blue-200 ml-8'
                            : 'bg-gray-50 border border-gray-200 mr-8'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">
                              {message.isFromUser ? 'Siz' : 'Admin Ekibi'}
                            </p>
                            <p className="text-gray-900">{message.content}</p>
                            {message.orderId && (
                              <p className="text-xs text-gray-500 mt-1">
                                Sipariş: #{message.orderId}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString('tr-TR', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Send Message Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Mesaj</h2>
                
                <form onSubmit={sendMessage} className="space-y-4">
                  {/* Order Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sipariş (Opsiyonel)
                    </label>
                    <select
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Genel soru</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          Sipariş #{order.id} - ₺{order.totalAmount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız *
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mesajınızı buraya yazın..."
                      required
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </button>
                </form>

                {/* Help Text */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">💡 İpucu</h3>
                  <p className="text-xs text-blue-700">
                    Siparişinizle ilgili bir sorunuz varsa, lütfen sipariş numarasını seçin. 
                    Bu sayede daha hızlı yardım alabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
