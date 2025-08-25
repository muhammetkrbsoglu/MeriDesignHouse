'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../../stores/cart.store';
import { useRouter } from 'next/navigation';
import { useToastContext } from '../../components/ToastProvider';
import { calculatePriceInfo, formatPrice } from '../../utils/price.utils';
import { useUser } from '@clerk/nextjs';

interface AddressForm {
  title: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  designData?: any;
}

interface CreateOrderDto {
  items: OrderItem[];
  shippingAddress: AddressForm;
  billingAddress: AddressForm;
  customerNote: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const toast = useToastContext();
  const [loading, setLoading] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isSignedIn } = useUser();

  const [shippingAddress, setShippingAddress] = useState<AddressForm>({
    title: 'Ev',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Türkiye',
    phoneNumber: ''
  });

  const [billingAddress, setBillingAddress] = useState<AddressForm>({
    title: 'Ev',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Türkiye',
    phoneNumber: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);

  // Handle redirect after successful order
  useEffect(() => {
    if (shouldRedirect) {
      // Delay redirect to allow toast to be visible
      const timer = setTimeout(() => {
        // Use window.location to avoid setState during render
        window.location.href = '/';
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect]);

  const handleAddressChange = (
    type: 'shipping' | 'billing',
    field: keyof AddressForm,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (useSameAddress) {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const createGuestOrder = async (orderData: CreateOrderDto) => {
    const response = await fetch('http://localhost:3001/api/orders/guest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sipariş oluşturulamadı');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isSignedIn) {
        toast.showInfo('Bilgilendirme', 'Giriş yapmadan da sipariş verebilirsiniz; ancak giriş yaparsanız sipariş takibi ve iletişim daha kolay olur.');
      }
      // Prepare order data
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        designData: item.designData
      }));

      const orderData: CreateOrderDto = {
        items: orderItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        customerNote
      };

      // Create order via API
      const result = await createGuestOrder(orderData);
      
      // Show success toast
      console.log('Showing success toast:', result.id, result.totalAmount);
      toast.showOrderSuccess(result.id, result.totalAmount);
      
      // Clear cart
      await clearCart();
      
             // Clear cart first
       await clearCart();
       
       // Set redirect flag to trigger useEffect
       setShouldRedirect(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      toast.showError('Sipariş Hatası', `Sipariş oluşturulurken bir hata oluştu: ${errorMessage}\nLütfen tekrar deneyin.`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
              <p className="text-gray-600 mt-2">
                Sipariş bilgilerinizi tamamlayın
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Teslimat Adresi
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres Başlığı
                    </label>
                    <select
                      value={shippingAddress.title}
                      onChange={(e) => handleAddressChange('shipping', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Ev">Ev</option>
                      <option value="İş">İş</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.firstName}
                        onChange={(e) => handleAddressChange('shipping', 'firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleAddressChange('shipping', 'lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres Satırı 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => handleAddressChange('shipping', 'addressLine1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sokak, cadde, bina no"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres Satırı 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => handleAddressChange('shipping', 'addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Daire, kat, ek bilgi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İl *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posta Kodu *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ülke *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phoneNumber}
                      onChange={(e) => handleAddressChange('shipping', 'phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5XX XXX XX XX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Fatura Adresi
                  </h2>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Teslimat adresi ile aynı</span>
                  </label>
                </div>

                {!useSameAddress && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Başlığı
                      </label>
                      <select
                        value={billingAddress.title}
                        onChange={(e) => handleAddressChange('billing', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Ev">Ev</option>
                        <option value="İş">İş</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ad *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => handleAddressChange('billing', 'firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Soyad *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => handleAddressChange('billing', 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Satırı 1 *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.addressLine1}
                        onChange={(e) => handleAddressChange('billing', 'addressLine1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sokak, cadde, bina no"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Satırı 2
                      </label>
                      <input
                        type="text"
                        value={billingAddress.addressLine2}
                        onChange={(e) => handleAddressChange('billing', 'addressLine2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Daire, kat, ek bilgi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İl *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.postalCode}
                        onChange={(e) => handleAddressChange('billing', 'postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ülke *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Note */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sipariş Notu
                </h2>
                
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Siparişinizle ilgili ek bilgi veya özel istekleriniz varsa buraya yazabilirsiniz..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sipariş Özeti
                </h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => {
                    const priceInfo = calculatePriceInfo(
                      item.product.price,
                      item.product.discountPrice,
                      item.product.discountPercentage
                    );
                    
                    return (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600">{item.quantity}x</span>
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(priceInfo.finalPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Toplam</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
