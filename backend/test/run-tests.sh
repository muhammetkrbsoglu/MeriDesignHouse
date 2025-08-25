#!/bin/bash

echo "🧪 WhatsApp API ve Sipariş Sistemi Testleri Başlatılıyor..."
echo "=================================================="

# Test ortamı değişkenlerini ayarla
export NODE_ENV=test

# Jest test runner'ı ile testleri çalıştır
echo "📱 WhatsApp API Testleri Çalıştırılıyor..."
npm run test:whatsapp

echo ""
echo "🛒 Sipariş Sistemi Testleri Çalıştırılıyor..."
npm run test:orders

echo ""
echo "🔗 Entegrasyon Testleri Çalıştırılıyor..."
npm run test:integration

echo ""
echo "🚀 Tüm Testler Çalıştırılıyor..."
npm run test:all

echo ""
echo "✅ Testler Tamamlandı!"
echo "📊 Test Raporları: backend/coverage/ klasöründe bulunabilir"
