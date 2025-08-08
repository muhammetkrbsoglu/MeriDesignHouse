Meri Design House için Stratejik Teknoloji Mimarisi:
Ölçeklenebilir ve İnteraktif bir E-Ticaret Platformu için Yol
Haritası
Giriş
Bu rapor, "Meri Design House" markası için geliştirilmesi planlanan, kişiye özel ürünler
sunacak web uygulamasına yönelik kapsamlı bir teknoloji mimarisi stratejisi
sunmaktadır. Projenin temel hedefi, standart e-ticaret platformlarının ötesine geçerek,
kullanıcılara dinamik, canlı ve bir masaüstü uygulaması akıcılığında çalışan, premium
bir dijital deneyim sunmaktır. Bu doğrultuda, yapılan teknoloji seçimleri yalnızca güncel
popülerliğe değil, projenin spesifik fonksiyonel ve fonksiyonel olmayan
gereksinimlerine (yüksek performans, kusursuz SEO, ölçeklenebilirlik, güvenlik ve
mülkiyet) getirdiği somut faydalara dayanmaktadır.
Önerilen mimarinin temelinde, sunum katmanı (front-end) ile iş mantığı katmanının
(back-end) birbirinden ayrıldığı (decoupled), bütünüyle TypeScript tabanlı bir
ekosistem yer almaktadır. Bu yaklaşım, projenin her bir parçasının kendi alanında en iyi
teknolojilerle inşa edilmesine olanak tanırken, uzun vadeli bakım kolaylığı ve
gelecekteki genişlemeler için maksimum esneklik sağlar. Front-end katmanı için
Next.js, back-end API için NestJS, veri tabanı için PostgreSQL ve kullanıcı arayüzü
için Shadcn/ui ile TailwindCSS kombinasyonu önerilmektedir. Bu teknolojiler, projenin
"sipariş talep sistemi" olarak başlayıp gelecekte tam teşekküllü bir e-ticaret
platformuna dönüşme vizyonunu destekleyecek en sağlam ve geleceğe dönük temeli
oluşturmaktadır.
Aşağıdaki özet tablo, önerilen teknoloji yığınını ve her bir seçimin arkasındaki ana
gerekçeyi bir bakışta sunmaktadır. Raporun ilerleyen bölümlerinde bu seçimlerin her
biri, güçlü alternatifleriyle karşılaştırılarak detaylı bir şekilde analiz edilecektir.
Teknoloji Yığını Özet Tablosu
Bileşen Birincil Tavsiye Temel Gerekçe
Front-End Mimarisi Next.js 14+ (App Router) SEO için Sunucu Taraflı İşleme
(SSR), performans için Sunucu
Bileşenleri (Server
Components), zengin
ekosistem.
Back-End Mimarisi NestJS (Fastify adaptörü ile) Yapılandırılmış, ölçeklenebilir,
TypeScript öncelikli, kurumsal
seviyeye hazır.
Veri Tabanı PostgreSQL Güçlü ilişkisel bütünlük, ACID
uyumluluğu, birbiriyle
bağlantılı veriler için üstün
performans.
UI Kütüphanesi Shadcn/ui + TailwindCSS Maksimum özelleştirme, kod
mülkiyeti, jenerik olmayan
premium his.
Durum Yönetimi (State
Management)
Zustand Hafif, minimum standart kod
(boilerplate), Sunucu
Bileşenleri ile uyumlu.
Dosya Depolama AWS S3 (veya uyumlu
servisler)
Kullanıcı tarafından yüklenen
içerikler için ölçeklenebilir,
güvenli ve maliyet-etkin
çözüm.
Front-End Dağıtımı
(Deployment)
Vercel Next.js ile kusursuz
entegrasyon, küresel Edge
Network, Önizleme Dağıtımları
(Preview Deployments).
Back-End Dağıtımı
(Deployment)
DigitalOcean App Platform /
Render
PaaS basitliği, yönetilen veri
tabanı, ölçeklenebilir ve
maliyet-etkin.
Bölüm 1: Temel Mimari Felsefesi ve Üst Düzey Strateji
Teknoloji mimarisi, sadece bir dizi aracın seçimi değil, aynı zamanda projenin uzun
vadeli vizyonunu ve temel felsefesini yansıtan stratejik bir kararlar bütünüdür. Meri
Design House için önerilen mimari, mülkiyet, esneklik ve ölçeklenebilirlik ilkeleri üzerine
kurulmuştur.
1.1. Monorepo ile Güçlendirilmiş Full-Stack TypeScript Ekosistemi
Projenin tamamının, Turborepo gibi modern bir araç kullanılarak tek bir monorepo (tek
bir kod deposu) içinde yapılandırılması şiddetle tavsiye edilmektedir.
1 Bu yaklaşım,
sadece kod organizasyonu sağlamanın ötesinde stratejik avantajlar sunar. En önemli
faydası, hem front-end (Next.js) hem de back-end (NestJS) uygulamaları tarafından
paylaşılabilecek ortak bir
types veya common paketi oluşturulmasına olanak tanımasıdır.
Bu sayede, User, Product, Order gibi temel veri yapıları tek bir yerde tanımlanır ve
projenin her iki katmanı tarafından da kullanılır. Bu strateji, front-end ve back-end
arasındaki veri sözleşmesi uyumsuzluklarından kaynaklanan bütün bir hata sınıfını
ortadan kaldırır ve geliştirici verimliliğini önemli ölçüde artırır.
2 Full-stack TypeScript
kullanımı, projenin başından sonuna kadar tip güvenliği sağlayarak daha sağlam,
öngörülebilir ve bakımı kolay bir kod tabanı oluşturur.
1.2. Ayrıştırılmış (Decoupled) Front-End ve Back-End Yaklaşımı
Projenin, her şeyi tek bir monolitik Next.js uygulaması içinde ele almak yerine, iki ayrı
uygulama olarak—bir Next.js front-end ve bir NestJS API—inşa edilmesi kararı,
mimarinin temel taşlarından biridir. Next.js'in kendisi bir full-stack framework olmasına
rağmen
4
, projenin karmaşıklığı, özellikle de gelişmiş admin paneli ve siparişe özel
mesajlaşma gibi özellikler, özel ve sağlam bir API katmanından büyük ölçüde fayda
görecektir.
Bu "sorumlulukların ayrıştırılması" ilkesi şu kritik avantajları sağlar:
● Bağımsız Ölçeklendirme: Genellikle okuma ağırlıklı olan front-end katmanı,
yazma ve iş mantığı ağırlıklı olan back-end katmanından bağımsız olarak
ölçeklendirilebilir. Bu, kaynakların daha verimli kullanılmasını sağlar.
● Teknolojik Saflık: NestJS, yapılandırılmış, test edilebilir ve bakımı kolay API'ler
oluşturmak için özel olarak tasarlanmıştır.
6 NestJS'in sadece bu göreve
odaklanmasına izin vermek, Next.js'in ise sunum katmanına odaklanmasını
sağlamak, daha temiz ve sağlam bir sistemle sonuçlanır. Bu yaklaşım, her
teknolojinin en güçlü olduğu alanda kullanılmasını sağlar.
● Gelecek Esnekliği: Gelecekte bir mobil uygulama veya üçüncü parti bir
entegrasyon gerektiğinde, bu yeni istemciler de aynı NestJS API'ını kullanarak
tutarlı bir veri kaynağına erişebilirler.
Bu ayrıştırma, projenin hem performans hem de ölçeklenebilirlik gereksinimlerini
doğrudan destekleyen stratejik bir karardır. Vercel gibi platformların Next.js için
sunduğu sunum katmanı optimizasyonlarından
8 sonuna kadar faydalanırken, NestJS'in
kurumsal seviyede API geliştirme yeteneklerini
6 ayrı bir platformda kullanarak her iki
dünyanın da en iyisini elde ederiz.
1.3. Mimari Genel Bakış
Önerilen sistemin bütünsel yapısı şu şekilde özetlenebilir: Kullanıcı, tarayıcısı üzerinden
Vercel Edge Network ile etkileşime girer. Vercel, statik varlıkları ve Sunucu
Bileşenlerini (Server Components) içeren Next.js Uygulama Kabuğunu sunar.
Tarayıcıdaki İstemci Bileşenleri (Client Components), bir PaaS (Platform as a Service)
üzerinde barındırılan NestJS API'ına API çağrıları yapar. NestJS API'ı, veri işlemleri için
PostgreSQL Veri Tabanı ve dosya depolama için AWS S3 ile iletişim kurar. Siparişe
özel mesajlaşma gibi gerçek zamanlı iletişimler ise, istemci ile NestJS API'ı arasında
doğrudan kurulan WebSocket bağlantıları üzerinden akar. Bu yapı, her bir bileşenin
kendi sorumluluğunu en verimli şekilde yerine getirdiği, modüler ve yüksek
performanslı bir sistem oluşturur.
Bölüm 2: Front-End Mimarisi: Premium Kullanıcı Deneyimini
Yaratmak
Front-end mimarisi, kullanıcının doğrudan etkileşimde bulunduğu katmandır ve
projenin "dinamik, canlı ve interaktif" felsefesini hayata geçirmekten sorumludur.
Seçilen teknolojiler, bu premium deneyimi sunarken aynı zamanda performans ve SEO
gibi kritik iş hedeflerini de karşılamalıdır.
2.1. Birincil Framework Tavsiyesi: Next.js ve App Router
Projenin "premium interaktivite" ve "kusursuz SEO" gibi birbiriyle çelişebilen iki temel
gereksinimi, Next.js'i bu proje için en uygun ve kesin seçenek haline getirmektedir.
● SEO için Sunucu Taraflı İşleme (Server-Side Rendering - SSR): Next.js'in temel
gücü, tüm ürün ve kategori sayfalarının sunucu tarafında tam olarak oluşturulup
istemciye gönderilmesini sağlamasıdır. Bu, arama motoru botlarının sayfaları
eksiksiz bir şekilde tarayabilmesi ve indeksleyebilmesi için e-ticaret sitelerinde
pazarlık konusu dahi edilemez bir özelliktir.
3
● İnteraktivite için App Router ve Sunucu Bileşenleri: Next.js'in modern App
Router mimarisi, projenin performans hedeflerine ulaşmasında kilit rol oynar. Bu
mimari, sayfaları Sunucu Bileşenleri (Server Components) ve İstemci Bileşenleri
(Client Components) kombinasyonuyla oluşturmamıza olanak tanır. Sunucu
Bileşenleri, sunucuda çalışır, veriyi çeker ve istemciye herhangi bir JavaScript kodu
göndermez. Bu, ilk yüklemede tarayıcıya gönderilen JavaScript miktarını (bundle
size) önemli ölçüde azaltarak projenin gerektirdiği düşük TTI (Time to Interactive)
süresine ulaşmayı sağlar.
11 "Canlı önizleme" ve "dinamik filtreleme" gibi yüksek
interaktivite gerektiren özellikler ise, sadece ihtiyaç duyulan yerlerde hidrasyona
uğrayan (interactive hale gelen) izole İstemci Bileşenleri olarak geliştirilecektir.
13
Karşılaştırmalı Analiz Tablosu: Front-End Framework'leri
Framew
ork
Bu Proje
için
Avantajl
arı
Bu Proje
için
Dezavan
tajları
Karar
Next.js
4 Kurumsa
l
11 Dikkatli
yönetilm
Tavsiye
Edilir.
(
R
e
a
c
t
)
s
e
viy
e
y
e
h
a
zır
e
k
o
sis
t
e
m
,
ü
s
t
ü
n
S
S
R
/
S
E
O
y
e
t
e
n
e
kl eri, App Router ileperform ans, Vercel ilesinerji, geniş yetenek havuzu. e
z
s
e
p
a
k
e
t
b
o
y
u
t
u
b
ü
y
ü
k
ola
bilir
(
A
p
p
R
o
u
t
e
r ile bu risk azaltılmı ştır). S
E
O
,
p
e
r
f
o
r
m
a
n
s
v
e
ölç
e
kle
n
e
bilirlik
gibi t
ü
m
t
e
m
el proje gerek
sin imleriyle mükem mel uyum sağlar. Nuxt.js (Vue) 10 Mükem mel geliştirici deneyim i, güçlü SSR/SSG özellikler i,otomatik importla r ile daha az kod yazımı. 10 React/N ext.js'e kıyasla daha küçük topluluk veekosiste m. Derin uzmanlığ a sahip geliştirici bulmak daha zor olabilir. Güçlü Alternat if. Özellikle Vue konusun dayetkin bir ekip için geçerli bir seçenek tir, ancak Next.js ekosiste mi bu ölçekteki bir proje için bir adım öndedir. SvelteKi t(Svelte) 11 Derleyici tabanlı olduğu için 11 Çok daha küçük ekosiste Bu Proje İçin Tavsiye Edilmez.
daha
küçük
paket
boyutları
ve
olağanü
stü
perform
ans.
Gerçek
anlamda
reaktif,
daha az
standart
kod.
m ve
topluluk.
Deneyim
li
geliştirici
bulmak
zordur.
Karmaşı
k,
kurumsa
l seviye
e-ticaret
için
daha az
test
edilmişti
r.
Perform
ansı
cazip
olsa da,
ekosiste
min
olgunlaş
mamışlığ
ı,
karmaşık
özellik
gereksin
imleri
olan iş
kritik bir
uygulam
a için
önemli
bir risk
teşkil
eder.
2.2. Durum Yönetimi (State Management) Stratejisi: Zustand
Next.js App Router ile birlikte, "sunucu durumu" (API'den çekilen veriler) büyük ölçüde
Sunucu Bileşenleri tarafından yönetilir. Bu nedenle, bir durum yönetimi kütüphanesine
olan birincil ihtiyaç, istemci durumunu yönetmektir: UI etkileşimleri, ürün özelleştirici
form verileri, sipariş talebi sepetinin durumu vb.
Bu senaryoda, Redux Toolkit gibi güçlü ancak standart kodu (boilerplate) fazla olan
bir kütüphane gereksizdir.
15 Redux, genellikle büyük ekiplerin yer aldığı ve karmaşık
durum dönüşümlerinin olduğu çok büyük uygulamalar için daha uygundur.
17
Zustand ise hafif, minimal bir API'ye sahip ve uygulamayı, performans sorunlarına yol
açabilen context provider'lar ile sarmalamaktan kaçınır.
18 Hook tabanlı API'si, modern
React ile doğal bir uyum içindedir ve bu projenin ihtiyaç duyduğu izole istemci durumu
parçalarını yönetmek için mükemmeldir.
15
2.3. UI Kütüphanesi ve Tasarım Sistemi: Shadcn/ui & TailwindCSS
Proje felsefesi, "standart, kalıp bir web sitesi" deneyimini açıkça reddetmektedir. Bu
durum, Material-UI (MUI) gibi oldukça tasarımsal olarak baskın (opinionated)
kütüphaneleri proje için uygunsuz kılar.
20
● TailwindCSS, herhangi bir tasarımı sıfırdan oluşturmak için gerekli olan
"utility-first" temelini sağlayarak maksimum esneklik sunar.
20
● Shadcn/ui ise bu kombinasyondaki kilit unsurdur. Geleneksel anlamda bir bileşen
kütüphanesi değildir. Araştırmaların da belirttiği gibi
23
, Shadcn/ui'nin güzel
tasarlanmış ve erişilebilirlik standartlarına uygun bileşenlerinin
kaynak kodunu doğrudan projenize kopyalarsınız. Bu yaklaşım, projenin "mülkiyet
ve esneklik" gereksinimiyle birebir örtüşmektedir. Kodun sahibi siz olursunuz.
Kütüphanenin dayattığı tasarımsal kalıplarla mücadele etmeden, bileşenleri
istediğiniz gibi özelleştirebilirsiniz. Bu yöntem, gerçekten ısmarlama (bespoke) ve
premium bir tasarım sistemi oluşturmak için idealdir.
22
Bu seçim, bilinçli bir stratejik karardır. Kolay paket güncellemelerinin getirdiği
rahatlıktan feragat edilerek, özelleştirmenin getirdiği nihai güç tercih edilmektedir. Bir
kaynakta belirtildiği gibi, bu modelde bileşenleri güncellemek daha zordur, ancak
mevcut bir bileşeni projenin ihtiyaçlarına göre değiştirmek ve yamalamak son derece
kolaydır.
25 "Meri Design House" gibi kendine özgü bir dijital kimlik yaratmak isteyen bir
marka için bu, kesinlikle doğru bir ödünleşimdir. Geliştirme ekibini, projenin ilk
gününden itibaren kendi iç tasarım sistemlerinin birer koruyucusu gibi düşünmeye
teşvik eder; bu da uzun vadeli bir proje için daha olgun ve ölçeklenebilir bir yaklaşımdır.
Bölüm 3: Back-End Mimarisi: İş Mantığı ve Verinin Motoru
Back-end mimarisi, uygulamanın görünmeyen ama en kritik parçasıdır. Kullanıcı
verilerinin yönetimi, iş kurallarının uygulanması, sipariş taleplerinin işlenmesi ve
güvenliğin sağlanması gibi tüm temel operasyonlar bu katmanda gerçekleşir.
3.1. Mimari Seçimi: Özel Geliştirilmiş Back-End (Custom Backend)
Projenin gereksinimleri, standart içerik yönetiminin çok ötesine geçtiği için, Strapi veya
Sanity.io gibi bir Headless CMS (İçerik Yönetim Sistemi) yerine özel olarak kodlanmış
bir back-end mimarisi tercih edilmelidir.
● Temel Ayırt Edici Özellikler: "Siparişe Özel Mesajlaşma" özelliği, bir içerik özelliği
değil, karmaşık bir uygulama özelliğidir. Gerçek zamanlı yetenekler, karmaşık
ilişkisel mantık (mesajların kullanıcılara ve siparişlere bağlanması) ve özel iş
kuralları gerektirir. Benzer şekilde, "Gelişmiş Admin Paneli"nin sadece ürünleri
değil (ki bunu bir CMS yapabilir), aynı zamanda kullanıcıları, sipariş durumlarını ve
mesajlaşma sistemini de yönetmesi gerekmektedir.
● Analiz: Headless CMS'ler, içerik modelleme ve editöryel iş birliği için mükemmel
araçlardır.
26 Ancak, gerçek zamanlı bir sohbet sistemi gibi karmaşık ve durumsal
(stateful) bir uygulama mantığını bu sistemlerin eklenti mimarisi içinde
oluşturmaya çalışmak, aracın temel amacına karşı gelmek olur. Özel bir back-end,
bu ısmarlama özellikleri doğal olarak inşa etmek için gereken kontrolü ve esnekliği
sağlar.
Karşılaştırmalı Analiz Tablosu: Back-End Mimarisi
Yaklaşım Bu Proje
için
Avantajl
arı
Bu Proje
için
Dezavan
tajları
Karar
Özel
Back-E
nd
(NestJS
)
6 İş
mantığı
üzerinde
tam
kontrol.
Gerçek
zamanlı
mesajlaş
ma gibi
karmaşık
özellikler
i doğal
olarak
destekle
r.
Sonsuz
ölçeklen
ebilirlik
Bir
CMS'e
göre
daha
yüksek
başlangı
ç
geliştirm
e eforu
gerektiri
r. Tüm
back-en
d
yığınının
yönetimi
ni
gerektiri
r.
Tavsiye
Edilir.
Projenin
benzersi
z
fonksiyo
nel
gereksin
imleri,
özellikle
mesajlaş
ma ve
gelişmiş
admin
paneli,
özel bir
back-en
d'i uzun
v
ees
n
e
klik. Özel uygulam abenzeri özellikler için daha uygundu r. v
a
d
e
d
e
t
e
k
g
e
ç
e
rli çözüm haline getirme
k
t
e
dir. Headles s CMS (Strapi/ Sanity) 26 Standart CRUD işlemleri (ürünler, kategoril er, statik sayfalar) için hızlı geliştirm e. İçerik editörler i için kutudan çıktığı gibi mükem mel bir admin arayüzü. 28
Ö
z
el uygula
m
am
a
n
tığı (mesajla şma) için uygun değildir. Admin panelini içerik dışı özellikler için genişlet mek karmaşık veya imkansız olabilir. Teknoloji ksınırlama lara çarpma veya satıcıya bağımlı kalma potansiy eli. Ta
v
s
i
y
e
E
d
ilm
e
z
.
B
a
sit
ö
z
ellikle
r
d
e
ki hızı cazip olsa da, projenin enyenilikçi ve kritik gereksin imleri için önemli engeller yarataca ktır.
3.2. Çekirdek Framework Tavsiyesi: NestJS
Özel bir back-end mimarisi kararı alındıktan sonra, NestJS, bu proje için Express.js gibi
daha minimalist bir framework'e göre üstün bir seçenek olarak öne çıkmaktadır.
● Yapı ve Ölçeklenebilirlik: NestJS, Angular'dan ilham alan, tasarımsal olarak
baskın (opinionated) bir framework'tür.
7 Modüller, kontrolcüler ve servisler
kullanarak modüler bir mimariyi zorunlu kılar.
6 Bu yapı, büyüyen bir ekip ve
karmaşık bir uygulama için paha biçilmezdir ve Express gibi serbest yapılı
framework'lerin yol açabileceği "dağınık kod tabanlarını" önler.
7
● TypeScript Öncelikli: NestJS, TypeScript ile inşa edilmiştir ve birinci sınıf destek
sunar.
6 Bu, full-stack TypeScript felsefemizle mükemmel bir uyum içindedir.
● "Pilleri Dahil" (Batteries Included): Bağımlılık enjeksiyonu (dependency
injection), doğrulama (validation), yapılandırma ve hatta mikroservisler gibi yaygın
ihtiyaçlar için yerleşik çözümlere veya iyi desteklenen modüllere sahiptir.
29 Bu da
onu "kurumsal seviyeye hazır" bir seçenek yapar.
7 Gerçek zamanlı mesajlaşma gibi
özellikler için WebSocket ağ geçidi (gateway) soyutlaması, geliştirme sürecini
önemli ölçüde hızlandırır.
31
● Performans: Ham "hello world" testlerinde Express marjinal olarak daha hızlı olsa
da, NestJS, önemli ölçüde daha hızlı olan Fastify adaptörünü kullanacak şekilde
yapılandırılabilir. Bu, onu büyük ölçekli uygulamalar için oldukça performanslı hale
getirir.
6
Bölüm 4: Veri Mimarisi ve Kalıcılık
Veri mimarisi, uygulamanın tüm bilgilerinin nasıl saklanacağını, yönetileceğini ve
alınacağını belirleyen stratejidir. Bu projenin başarısı için doğru veri tabanı seçimi ve
veri modelleme teknikleri hayati önem taşımaktadır.
4.1. Birincil Veri Tabanı Tavsiyesi: PostgreSQL
Bu uygulamadaki veriler, doğası gereği yüksek derecede ilişkiseldir. Bir kullanıcının
birden çok siparişi vardır. Bir siparişin birden çok mesajı vardır. Bir sipariş bir kullanıcıya
aittir. Bir ürün bir kategoriye aittir. Bunlar, klasik ilişkisel veri tabanı konseptleridir.
● PostgreSQL vs. MongoDB: MongoDB, esnekliğin anahtar olduğu
yapılandırılmamış veya yarı yapılandırılmış veriler için mükemmel bir NoSQL belge
veri tabanıdır.
33 Ancak, bu projenin katı ilişkilerini MongoDB'de modellemeye
çalışmak, veri tekrarına ve tutarlılık sorunlarına yol açabilen "denormalizasyon"
(veriyi gömme) veya MongoDB'nin avantajlarının çoğunu ortadan kaldıran
uygulama düzeyinde birleştirmeler (joins) gerektirir. PostgreSQL ise, şemalar ve
yabancı anahtarlar (foreign keys) aracılığıyla veri bütünlüğünü zorunlu kılan bir
ilişkisel veri tabanıdır. Siparişler gibi işlemsel veriler için kritik olan ACID (Atomicity,
Consistency, Isolation, Durability) uyumluluğunu garanti eder.
33
İlişkili tablolar
arasında sorgulama yapmak için (örneğin, "bu kullanıcının verdiği siparişlere ait
tüm mesajları bul"), SQL, MQL'in karmaşık birleştirme işlem hatlarına (aggregation
pipeline) göre çok daha güçlü ve verimlidir.
34
Karşılaştırmalı Analiz Tablosu: Veri Tabanı Sistemleri
Veri
Tabanı
Bu Proje
için
Avantajl
arı
Bu Proje
için
Dezavan
tajları
Karar
Postgre
SQL
(İlişkisel
)
33 Yüksek
dereced
e ilişkisel
veriler
(kullanıcı
lar,
siparişle
r,
mesajlar
) için
mükem
meldir.
Şemalar
aracılığıy
la veri
bütünlüğ
ünü
zorunlu
kılar.
İşlemsel
güvenlik
33 Daha az
esnek
şema;
değişikli
kler
migrasy
on
gerektiri
r.
Şiddetle
Tavsiye
Edilir.
Projenin
veri
modeli
temelde
n
ilişkilidir.
Postgre
SQL,
gereken
güvenliği
,
bütünlüğ
ü ve
sorgula
ma
gücünü
sağlar.
için güçlü ACID uyumlul uğu. Karmaşı ksorgular için güçlü SQL dili. Olgun ve sağlamd ır. Mongo DB(NoSQL ) 34 Esnek şema, gelişen veya yapılandı rılmamış veriler için iyidir. Potansiy el olarak daha kolay yatay ölçeklen dirme. 3
3
P
r
o
j
e
nin
bir
biriyle
b
a
ğla
n
tıl ı verileri için uygun değildir. İlişkileri zorunlu kılmak zordur. Veri tekrarına veya karmaşık uygulam adüzeyin debirleştir melere yol açabilir. ACID işlemleri mevcut olsa da tasarımı ntemelind e yer
Ta
v
s
i
y
e
E
d
ilm
e
z
.
B
u
p
r
o
j
e
d
e
M
o
n
g
o
D
Bkulla
n
m
a
k
,
v
e
rinin
d
o
ğ
al yapısın
a
k
a
r
şı sava
ş
m
a
ka
nla
mın
a
g
elir
v
e
u
z
u
n
v
a
d
e
d
e
d
a
h
a
k
a
r
m
a
şık
v
e
d
a
h
a
a
z
g
ü
v
e
nilir
bir uyg
ula
m
a
yla
s
o
n
u
çla
nır.
almaz.
4.2. Anahtar Özellikler için Veri Modelleme
● Hiyerarşik Ürün Kategorileri: En az 3 alt kırılımı destekleyen "ağaç yapısı"
(tree-view) talebi, özel bir veri modelleme stratejisi gerektirir.
● Modellerin Analizi: Çeşitli kaynaklar, birkaç farklı yaklaşımı tartışmaktadır.
36
○ Bitişiklik Listesi (Adjacency List): Her kategorinin bir parent_id sütununa
sahip olduğu en basit modeldir. Düğümleri eklemek, güncellemek ve taşımak
kolaydır.
40 Tarihsel olarak en büyük zayıflığı, tüm alt ağaçları sorgulamanın zor
olmasıydı, ancak PostgreSQL'in
WITH RECURSIVE (Recursive CTEs) gibi modern SQL özellikleri bu sorunu
büyük ölçüde çözmüştür.
40
○ İç İçe Kümeler (Nested Set): Okuma işlemleri (tüm alt öğeleri bulma) için
daha hızlıdır, ancak yazma işlemleri (bir düğüm eklemek/güncellemek, ağacın
büyük bir bölümü için değerlerin yeniden hesaplanmasını gerektirir) son
derece maliyetli ve karmaşıktır.
37 Kategorilerin aktif olarak yönetileceği bir
sistem için bu uygun bir model değildir.
○ Yol Sıralaması (Path Enumeration / Materialized Path): Her düğümün tam
yolunu (örneğin, 1.5.12.) bir metin olarak saklar. Sorgular için iyidir ancak tüm
alt öğelerin yollarının güncellenmesi gerektiğinden alt ağaçları taşımayı
karmaşıklaştırır.
36 PostgreSQL'in
ltree eklentisi bunun güçlü bir uygulamasıdır.
40
● Tavsiye: Bitişiklik Listesi (Adjacency List) modeliyle başlanmalıdır. Bu, en
sezgisel, admin panelinden yönetilmesi en kolay olan modeldir ve tarihsel zayıflığı
(alt ağaçları sorgulama) artık PostgreSQL'in recursive CTE'leri tarafından iyi bir
şekilde desteklenmektedir.
40 Bu, proje için performans ve bakım kolaylığı arasında
en iyi dengeyi sağlar.
Önerilen Şema Tablosu: categories (Bitişiklik Listesi)
Sütun Adı Veri Tipi Kısıtlamalar / Notlar
id UUID Primary Key,
gen_random_uuid()
name VARCHAR(255) NOT NULL
slug VARCHAR(255) NOT NULL, UNIQUE
parent_id UUID FOREIGN KEY REFERENCES
categories(id) ON DELETE
SET NULL
created_at TIMESTAMPTZ now()
updated_at TIMESTAMPTZ now()
4.3. Kullanıcı Yüklemeleri için Nesne Depolama: AWS S3
Kullanıcı tarafından yüklenen dosyaları (özelleştirme için fotoğraflar gibi) uygulamayı
çalıştıran sunucunun dosya sisteminde saklamak, kritik bir anti-desendir (anti-pattern).
Bu, ölçeklenebilir değildir, dağıtımları karmaşıklaştırır ve güvenlik riskleri oluşturur.
● Tavsiye: AWS S3 (veya DigitalOcean Spaces, Cloudflare R2 gibi uyumlu
alternatifler) gibi özel bir nesne depolama hizmeti endüstri standardıdır. Yüksek
düzeyde ölçeklenebilir, dayanıklı ve maliyet-etkindir.
42 Güvenli yüklemeler için
önceden imzalanmış URL (pre-signed URL) deseni kullanılacaktır.
Bölüm 5: Dağıtım (Deployment), DevOps ve Güvenlik
Bu bölüm, uygulamanın hayata geçirilmesi, operasyonel süreçleri ve uzun vadeli sağlığı
ile güvenliğinin sağlanması konularını kapsar.
5.1. Barındırma (Hosting) ve Dağıtım Stratejisi
● Front-End (Next.js): Vercel. Vercel, Next.js'in arkasındaki şirkettir ve platformları
bu framework için özel olarak tasarlanmıştır.
8 Git üzerinden sıfır yapılandırmalı
dağıtımlar, otomatik derlemeler (builds), her bir pull request için Önizleme
Dağıtımları (Preview Deployments), performans için küresel bir Edge Network ve
SSR, ISR, Görüntü Optimizasyonu gibi tüm Next.js özelliklerine kusursuz destek
sunar.
8 Next.js için başka bir platform seçmek, Vercel'in ücretsiz olarak sağladığı
özellikleri manuel olarak yeniden oluşturmak anlamına gelir.
● Back-End (NestJS) & Veri Tabanı (PostgreSQL): DigitalOcean App Platform
veya Render. Bunlar, "Heroku benzeri basitlik" sunan ancak daha iyi performans
ve fiyatlandırmaya sahip modern Platform-as-a-Service (PaaS) sağlayıcılarıdır.
47
Altyapıyı yöneterek, otomatik ölçeklendirme sağlayarak ve tek tıkla yönetilen
PostgreSQL veri tabanları sunarak DevOps'u önemli ölçüde basitleştirirler. Bu, özel
bir DevOps mühendisine ihtiyaç duymadan back-end'i dağıtmanın en
maliyet-etkin ve verimli yoludur.
5.2. Temel Güvenlik Duruşu
Uygulamanın güvenliği, geliştirmenin ilk gününden itibaren bir öncelik olmalıdır.
NestJS'in yapılandırılmış doğası, güvenlik en iyi pratiklerini uygulamayı kolaylaştırır.
● API Güvenliği: NestJS API, XSS ve clickjacking gibi yaygın saldırılara karşı koruma
sağlamak için kritik güvenlik başlıklarını (HTTP headers) ayarlayan helmet
kütüphanesini uygulayacaktır.
48
● CSRF Koruması: Kimliği doğrulanmış kullanıcı eylemleri olan herhangi bir
uygulama için gerekli olan Siteler Arası İstek Sahteciliği (Cross-Site Request
Forgery) saldırılarına karşı koruma sağlamak için csurf veya benzeri bir kütüphane
uygulanacaktır.
50
● Girdi Doğrulama (Input Validation): NestJS'in yerleşik ValidationPipe'ı,
class-validator ve class-transformer ile birlikte küresel olarak kullanılacaktır. Bu,
gelen tüm API verilerinin temizlenmesini ve beklenen şemalara uymasını
sağlayarak enjeksiyon saldırılarını önler.
52
● Güvenli Dosya Yüklemeleri: Daha önce belirtildiği gibi, dosya yüklemeleri
doğrudan back-end üzerinden yapılmayacaktır. Akış şu şekilde olacaktır:
1. Next.js istemcisi, belirli bir dosya adı için NestJS API'sinden güvenli bir
yükleme URL'si talep eder.
2. NestJS API, AWS SDK'sını kullanarak, o belirli dosya anahtarı için geçici PUT
erişimi sağlayan kısa ömürlü, önceden imzalanmış bir S3 URL'si oluşturur.
42
3. Next.js istemcisi, dosyayı bu URL'yi kullanarak doğrudan S3'e yükler. Dosya
hiçbir zaman uygulama sunucumuza temas etmez, bu da güvenliği ve
performansı önemli ölçüde artırır.
44
Bu yaklaşım, NestJS'in sadece bir framework olmadığını, aynı zamanda geliştiricileri
varsayılan olarak daha güvenli bir duruşa yönlendiren bir ekosistem olduğunu
göstermektedir. Minimalist bir framework olan Express'te ise geliştirici, bu güvenlik
bileşenlerini kendisi bulmak, doğrulamak ve entegre etmekle yükümlüdür.
52 NestJS
seçimi, aynı zamanda proaktif bir güvenlik kararıdır.
Bölüm 6: Karmaşık Özellikler için Uygulama Planları (Blueprints)
Önerilen teknoloji yığınının projenin en zorlu ve yenilikçi özelliklerini nasıl hayata
geçirebileceğini göstermek için, aşağıda üst düzey uygulama desenleri sunulmuştur.
6.1. Blueprint: Canlı Ürün Özelleştirme Önizlemesi
● Zorluk: Kullanıcı girdilerini (metin, renk seçimi, yüklenen fotoğraf) gerçek zamanlı
olarak bir ürün görseline yansıtmak.
● Mimari: Bu, tamamen istemci tarafında (client-side) gerçekleştirilecek bir
uygulamadır.
1. Arayüz: Ürün sayfası, bir İstemci Bileşeni olan <ProductCustomizer />
içerecektir.
2. Durum (State): Bu bileşen içindeki yerel durum (veya kapsamı daraltılmış bir
Zustand deposu), özelleştirme değerlerini (örneğin, text, selectedColor,
uploadedImage) tutacaktır.
3. Görüntü İşleme: Kullanıcı bir resim yüklediğinde, tarayıcı içinde çalışan
Fabric.js veya Jimp gibi bir istemci tarafı JavaScript görüntü işleme
kütüphanesi kullanılacaktır.
55
4. İşleme (Rendering): Kütüphane, bir HTML <canvas> elemanı üzerinde
çalışacaktır. Temel ürün resmi tuvale yüklenecek, ardından kullanıcının metni
ve yüklediği resim programatik olarak üzerine yerleştirilecektir. Kullanıcı
yazdıkça veya seçenekleri değiştirdikçe, tuval temizlenip gerçek zamanlı olarak
yeniden çizilecektir.
5. Gönderim: Kullanıcı onayladığında, tuvalin son hali bir resim veri URL'si
(canvas.toDataURL()) olarak dışa aktarılabilir ve sipariş talebiyle birlikte
gönderilebilir.
6.2. Blueprint: Dinamik, Sayfa Yenilemesiz Filtreleme ve Arama
● Zorluk: Bir kategori sayfasındaki arama sonuçlarını tam sayfa yenilemesi olmadan
güncellemek.
● Mimari: Bu, Next.js App Router'ın URL arama parametrelerini (search parameters)
ele alma şeklinden yararlanır.
1. Durum URL'de: Filtrelerin durumu (kategori, fiyat aralığı vb.) URL'nin sorgu
dizesinde (query string) saklanacaktır (örneğin,
?category=cerceveler&price_min=50&price_max=200). Bu, paylaşılabilirlik ve
tarayıcı geçmişi için en iyi pratiktir.
57
2. İstemci Tarafı Etkileşimi: Filtre kontrolleri (onay kutuları, kaydırıcılar) bir İstemci
Bileşeninde olacaktır. Bir kullanıcı bir filtreyi değiştirdiğinde, bir işleyici
(handler) fonksiyonu şunları yapacaktır:
a. Mevcut URL parametrelerini almak için useSearchParams hook'unu
kullanacaktır.
b. Yeni bir URLSearchParams nesnesi oluşturacak ve bunu yeni filtre değeriyle
güncelleyecektir.57
c. URL'yi sayfa yenilemesi olmadan güncellemek için useRouter hook'unun
router.replace() yöntemini kullanacaktır.58
3. Sunucu Tarafı Yeniden İşleme: Ürün listesini gösteren ana bileşen (örneğin,
<Table>) bir Sunucu Bileşeni olacaktır. URL değiştiği için, Next.js bu Sunucu
Bileşenini otomatik olarak yeniden işleyecek ve ona yeni searchParams'ı
geçirecektir. Bileşen daha sonra NestJS API'sinden yeni filtrelerle verileri
yeniden çekecek ve güncellenmiş HTML'i istemciye akıtacaktır (stream). Bu,
performans ve güvenlik için veri çekme mantığını sunucuda tutarken kusursuz
bir kullanıcı deneyimi sağlar.
58
4. Geciktirme (Debouncing): Metin arama girdisi, her tuş vuruşunda bir API
isteği göndermeyi önlemek ve performansı artırmak için bir "debounce"
hook'u kullanacaktır.
57
6.3. Blueprint: Siparişe Özel Gerçek Zamanlı Mesajlaşma
● Zorluk: Bir kullanıcı ile bir yönetici arasında, belirli bir siparişe bağlı, güvenli ve özel
bir sohbet.
● Mimari: Bu, NestJS'in WebSocket sunucusu olarak hareket ettiği WebSockets
kullanır.
1. Back-End (NestJS): NestJS'in @nestjs/websockets modülünü kullanarak bir
ChatGateway oluşturulacaktır. Bu modül, altta Socket.IO kullanır.
31
2. Kimlik Doğrulama: Bir istemci WebSocket'e bağlandığında, ağ geçidinin
handleConnection yöntemi, kullanıcıyı tanımlamak için (bağlantı el
sıkışmasında gönderilen) kullanıcının JWT'sini doğrulayacaktır.
3. Odalar (Rooms): Sohbeti özel ve siparişe özel yapmanın anahtarı,
Socket.IO'nun "odalar" özelliğidir. Bir kullanıcı 123 numaralı sipariş için sohbeti
açtığında, istemci orderId: '123' ile bir join_room olayı (event) yayınlayacaktır.
ChatGateway daha sonra bu kullanıcının soket bağlantısını o sipariş için özel
bir odaya yerleştirmek üzere socket.join('order-123') kullanacaktır.
62 Yönetici,
siparişin mesajlarını görüntülediğinde aynı işlemi yapacaktır.
4. Yayınlama (Broadcasting): Bir kullanıcı veya yönetici bir mesaj
gönderdiğinde, mesaj içeriği ve orderId ile bir send_message olayı
yayınlayacaktır. Sunucu, tüm istemcilere yayın yapmayacaktır. Bunun yerine,
mesajı yalnızca o belirli siparişin odasındaki istemcilere göndermek için
server.to('order-123').emit('new_message',...) kullanacaktır.
62
5. Kalıcılık: Ağ geçidi tarafından alınan her mesaj, order_id ve user_id'ye bağlı
olarak PostgreSQL veri tabanındaki bir messages tablosuna kaydedilecek ve
kalıcı bir sohbet geçmişi sağlanacaktır.
Sonuç
Bu raporda sunulan teknoloji mimarisi, "Meri Design House" projesinin hedeflerine
ulaşması için stratejik ve kapsamlı bir yol haritası sunmaktadır. Next.js, NestJS,
PostgreSQL ve Vercel gibi modern ve kanıtlanmış teknolojilerin bir araya getirildiği bu
yapı, projenin temel felsefesi olan premium kullanıcı deneyimi, kusursuz performans,
SEO uyumluluğu, mülkiyet ve uzun vadeli ölçeklenebilirlik ilkelerini eksiksiz bir şekilde
karşılamak üzere tasarlanmıştır.
Seçilen her bir teknoloji, popülerlikten ziyade, projenin spesifik ve karmaşık
gereksinimlerine (canlı önizleme, dinamik filtreleme, siparişe özel gerçek zamanlı
mesajlaşma gibi) getirdiği somut çözümler ve sağladığı yapısal avantajlar nedeniyle
tercih edilmiştir. Ayrıştırılmış (decoupled) mimari, her katmanın kendi alanında en iyi
araçlarla geliştirilmesine olanak tanırken, monorepo ve full-stack TypeScript yaklaşımı
geliştirici verimliliğini ve kod kalitesini en üst düzeye çıkarır.
Bu mimari, sadece bugünün ihtiyaçlarını karşılamakla kalmaz, aynı zamanda gelecekte
online ödeme sistemleri, çoklu dil desteği veya mobil uygulama gibi potansiyel
genişlemeler için de sağlam ve esnek bir temel oluşturur. Sonuç olarak, bu rapor, Meri
Design House'un dijital alanda başarılı ve kalıcı bir varlık oluşturması için gereken
teknik vizyonu ve sağlam mühendislik temellerini ortaya koymaktadır.
Alıntılanan çalışmalar
1. Full-Stack Blog App with NestJS, NextJS & Turborepo – 10-Hour Ultimate Guide -
YouTube, erişim tarihi Ağustos 8, 2025,
https://www.youtube.com/watch?v=rsRglxTKbR0
2. Simple Full-Stack CRUD with Next.js 14, PostgreSQL, and Prisma | Fajarwz, erişim
tarihi Ağustos 8, 2025,
https://fajarwz.com/blog/simple-full-stack-crud-with-nextjs-14-postgresql-and-p
risma/
3. Next.js + NestJS: modern architecture for web apps - DEV Community, erişim
tarihi Ağustos 8, 2025,
https://dev.to/akpvt/nextjs-nestjs-modern-architecture-for-web-apps-304c
4. Top Website Frameworks in 2025 - Levinci, erişim tarihi Ağustos 8, 2025,
https://levinci.group/levinci-blog/top-website-frameworks-in-2025/
5. How to Build a Fullstack App with Next.js, Prisma, and Postgres - Vercel, erişim
tarihi Ağustos 8, 2025, https://vercel.com/guides/nextjs-prisma-postgres
6. Comparing NestJS & Express.js: Which Framework is the Best - Jelvix, erişim tarihi
Ağustos 8, 2025, https://jelvix.com/blog/nestjs-vs-express
7. NestJS vs. Fastify vs. Express: The Best Backend Framework in 2025? - MISHRI
LAL SAHU, erişim tarihi Ağustos 8, 2025,
https://mishrilalsahu.in.net/Blogs/nestjs-vs-fastify-vs-express-the-best-backendframework-in-2025
8. Next.js on Vercel, erişim tarihi Ağustos 8, 2025,
https://vercel.com/docs/frameworks/full-stack/nextjs
9. Next.js on Vercel, erişim tarihi Ağustos 8, 2025,
https://vercel.com/frameworks/nextjs
10. Next.js vs. Nuxt.js 2025 : Differences - Which is Best? : Aalpha, erişim tarihi
Ağustos 8, 2025, https://www.aalpha.net/blog/nextjs-vs-nuxtjs-differences/
11. Next.js vs Nuxt vs SvelteKit: Choosing the Right Framework for SaaS
Development, erişim tarihi Ağustos 8, 2025,
https://supastarter.dev/blog/nextjs-vs-nuxt-vs-sveltekit-for-saas-development
12. Modern Full Stack Application Architecture Using Next.js 15+ - SoftwareMill, erişim
tarihi Ağustos 8, 2025,
https://softwaremill.com/modern-full-stack-application-architecture-using-next-j
s-15/
13. Top 10 NextJS alternatives in 2025 that are quietly outperforming it - BCMS,
erişim tarihi Ağustos 8, 2025, https://thebcms.com/blog/nextjs-alternatives
14. Next.js vs Remix vs Nuxt 3: Choosing the Right Meta-Framework | Better Stack
Community, erişim tarihi Ağustos 8, 2025,
https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nux
t-3/
15. Zustand vs. Redux Toolkit vs. Jotai | Better Stack Community, erişim tarihi Ağustos
8, 2025,
https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-tool
kit-vs-jotai/
16. Zustand vs. Redux Toolkit: When I Pick One Over the Other and Why - Medium,
erişim tarihi Ağustos 8, 2025,
https://medium.com/@raelsei/zustand-vs-redux-toolkit-when-i-pick-one-over-th
e-other-and-why-1cb442433300
17. Zustand vs Redux: Making Sense of React State Management - Wisp CMS, erişim
tarihi Ağustos 8, 2025,
https://www.wisp.blog/blog/zustand-vs-redux-making-sense-of-react-state-man
agement
18. Compare With Other State Management Frameworks | ZUSTAND - GitHub Pages,
erişim tarihi Ağustos 8, 2025,
https://awesomedevin.github.io/zustand-vue/en/docs/introduce/compare
19. Zustand vs. Signals — Comparing React State Management Options | by Kevin
Schaffter, erişim tarihi Ağustos 8, 2025,
https://betterprogramming.pub/zustand-vs-signals-e664bff2ce4a
20. Benefits of Using Shadcn Over Material UI | Blog - Cubet, erişim tarihi Ağustos 8,
2025,
https://cubettech.com/resources/blog/benefits-of-using-shadcn-over-material-ui
/
21. ShadCN-UI vs. Other UI Libraries: The Ultimate Showdown for Your Next Project -
Apidog, erişim tarihi Ağustos 8, 2025,
https://apidog.com/blog/shadcn-ui-vs-other-ui-libraries/
22. Build Smarter with TailwindCSS: Top 5 UI Libraries Compared for 2025 | by Hitesh
Saha, erişim tarihi Ağustos 8, 2025,
https://medium.com/@HiteshSaha/build-smarter-with-tailwindcss-top-5-ui-librari
es-compared-for-2025-1d3f70bb2a17
23. What is Shadcn UI and why you should use it?, erişim tarihi Ağustos 8, 2025,
https://peerlist.io/blog/engineering/what-is-shadcn-and-why-you-should-use-it
24. Introduction - shadcn/ui, erişim tarihi Ağustos 8, 2025, https://ui.shadcn.com/docs
25. Migrating from MUI to Tailwind + ShadCN: Any Experience or Issues? : r/reactjs -
Reddit, erişim tarihi Ağustos 8, 2025,
https://www.reddit.com/r/reactjs/comments/1j75qn2/migrating_from_mui_to_tailw
ind_shadcn_any/
26. Sanity vs Strapi vs Contentstack vs Contentful vs Builder.io - Kombee, erişim tarihi
Ağustos 8, 2025,
https://www.kombee.com/blogs/sanity-vs-strapi-vs-contentstack-vs-contentfulvs-builderio-comprehensive-comparison
27. Sanity vs Strapi: Which CMS is Best? - Webstacks, erişim tarihi Ağustos 8, 2025,
https://www.webstacks.com/blog/sanity-vs-strapi
28. Sanity vs Strapi: Customizable Content Platform, erişim tarihi Ağustos 8, 2025,
https://www.sanity.io/sanity-vs-strapi
29. NestJS vs. ExpressJS 2025 : Which Is Better Framework? - Aalpha Information
Systems, erişim tarihi Ağustos 8, 2025,
https://www.aalpha.net/blog/nestjs-vs-expressjs-difference/
30. Nestjs vs ExpressJS : r/node - Reddit, erişim tarihi Ağustos 8, 2025,
https://www.reddit.com/r/node/comments/1gnauyi/nestjs_vs_expressjs/
31. Building a Real-Time Chat Application with NestJS and WebSocket - The Right
Software, erişim tarihi Ağustos 8, 2025,
https://therightsw.com/building-real-time-chat-application-with-nestjs-and-web
socket/
32. vontanne/nestjs-socketio-chat: Real-time chat application built with NestJS and
Socket.io, featuring secure authentication, chat rooms, and direct messaging -
GitHub, erişim tarihi Ağustos 8, 2025,
https://github.com/vontanne/nestjs-socketio-chat
33. MongoDB vs PostgreSQL - Difference Between Databases - AWS, erişim tarihi
Ağustos 8, 2025,
https://aws.amazon.com/compare/the-difference-between-mongodb-and-postg
resql/
34. PostgreSQL vs MongoDB: Choosing the Right Database for Your Data Projects -
DataCamp, erişim tarihi Ağustos 8, 2025,
https://www.datacamp.com/blog/postgresql-vs-mongodb
35. Comparing MongoDB vs PostgreSQL, erişim tarihi Ağustos 8, 2025,
https://www.mongodb.com/resources/compare/mongodb-postgresql
36. Storing Hierarchical Data in a Relational Database - GeeksforGeeks, erişim tarihi
Ağustos 8, 2025,
https://www.geeksforgeeks.org/sql/storing-hierarchical-data-in-a-relational-data
base/
37. Nested set model - Wikipedia, erişim tarihi Ağustos 8, 2025,
https://wikipedia.org/wiki/Nested_set_model
38. Adjacency list vs. nested sets: PostgreSQL - explain extended, erişim tarihi
Ağustos 8, 2025,
https://explainextended.com/2009/09/24/adjacency-list-vs-nested-sets-postgres
ql/
39. Storing Hierarchical Data in Relational Databases with SQL - Adam Djellouli, erişim
tarihi Ağustos 8, 2025,
https://adamdjellouli.com/articles/databases_notes/03_sql/09_hierarchical_data
40. Hierarchical models in PostgreSQL | Ackee blog, erişim tarihi Ağustos 8, 2025,
https://www.ackee.agency/blog/hierarchical-models-in-postgresql
41. Hierarchical Data Models: Adjacency List vs. Nested Sets - Stack Overflow, erişim
tarihi Ağustos 8, 2025,
https://stackoverflow.com/questions/915481/hierarchical-data-models-adjacency
-list-vs-nested-sets
42. A Comprehensive Guide to Securely Uploading and Reading Files from Amazon
S3 Using Next.js and Nest.js - Zysk Knowledge Center, erişim tarihi Ağustos 8,
2025,
https://blog.zysk.tech/a-comprehensive-guide-to-securely-uploading-and-readin
g-files-from-amazon-s3-using-next-js-and-nest-js/
43. Secure File Upload in NestJS Using AWS S3 - ZHOST Consulting, erişim tarihi
Ağustos 8, 2025,
https://www.bithost.in/blog/tech-2/using-s3-bucket-in-nestjs-to-store-files-74
44. Implementing Secure File Download/Upload to AWS S3 with NestJS | by Sam Xzo |
Medium, erişim tarihi Ağustos 8, 2025,
https://medium.com/@sam.xzo.developing/implementing-secure-file-downloadupload-to-aws-s3-with-nestjs-11144b789c75
45. Deploying to Vercel, erişim tarihi Ağustos 8, 2025,
https://vercel.com/docs/deployments
46. Deploying Next.js to Vercel - YouTube, erişim tarihi Ağustos 8, 2025,
https://www.youtube.com/watch?v=AiiGjB2AxqA
47. Deploy Node.js Apps Like a Boss: Railway vs. Render vs. Heroku (Zero-Server
Stress), erişim tarihi Ağustos 8, 2025,
https://dev.to/alex_aslam/deploy-nodejs-apps-like-a-boss-railway-vs-render-vs-h
eroku-zero-server-stress-5p3/comments
48. Helmet | NestJS - A progressive Node.js framework, erişim tarihi Ağustos 8, 2025,
https://docs.nestjs.com/security/helmet
49. Securing NestJS Applications with Helmet | by @rnab - Medium, erişim tarihi
Ağustos 8, 2025,
https://arnab-k.medium.com/securing-nestjs-applications-with-helmet-1f16ffa7e
53c
50. CSRF | NestJS - A progressive Node.js framework, erişim tarihi Ağustos 8, 2025,
https://docs.nestjs.com/security/csrf
51. Guided: Security in NestJS - Pluralsight, erişim tarihi Ağustos 8, 2025,
https://www.pluralsight.com/labs/codeLabs/guided-security-in-nestjs
52. Nodejs Security - OWASP Cheat Sheet Series, erişim tarihi Ağustos 8, 2025,
https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.ht
ml
53. The Ultimate Guide to File Uploads in Next.js (S3, Presigned URLs, Dropzone) -
YouTube, erişim tarihi Ağustos 8, 2025,
https://m.youtube.com/watch?v=83bECYmPbI4&pp=0gcJCbAJAYcqIYzv
54. How to use AWS S3 pre-signed URLs to upload and download files - DEV
Community, erişim tarihi Ağustos 8, 2025,
https://dev.to/thesohailjafri/how-to-use-aws-s3-pre-signed-urls-to-upload-anddownload-files-4p53
55. Image manipulation on the server or client side? - Stack Overflow, erişim tarihi
Ağustos 8, 2025,
https://stackoverflow.com/questions/29640887/image-manipulation-on-the-serv
er-or-client-side
56. 12 JavaScript Image Manipulation Libraries for Your Next Web App - Flatlogic,
erişim tarihi Ağustos 8, 2025,
https://flatlogic.com/blog/12-javascript-image-manipulation-libraries-for-your-ne
xt-web-app/
57. App Router: Adding Search and Pagination - Next.js, erişim tarihi Ağustos 8, 2025,
https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
58. Mastering State in Next.js App Router with URL Query Parameters: A Practical
Guide, erişim tarihi Ağustos 8, 2025,
https://medium.com/@roman_j/mastering-state-in-next-js-app-router-with-url-q
uery-parameters-a-practical-guide-03939921d09c
59. Dynamic Form Updates via URL Query Parameters in Next.js 14 App Router -
Reddit, erişim tarihi Ağustos 8, 2025,
https://www.reddit.com/r/nextjs/comments/1gxbxqr/dynamic_form_updates_via_u
rl_query_parameters_in/
60. Getting Started: Layouts and Pages - Next.js, erişim tarihi Ağustos 8, 2025,
https://nextjs.org/docs/app/getting-started/layouts-and-pages
61. Learn Search Params in Next.js 14 by building a project! React | Tailwind |
shadcn/ui, erişim tarihi Ağustos 8, 2025,
https://www.youtube.com/watch?v=2B9l-IMk0KQ
62. Building a Scalable Real-time Chat Application with Scoket.io, React, NestJS, and
Redis Cluster | by Rezowanur Rahman Robin | Medium, erişim tarihi Ağustos 8,
2025,
https://medium.com/@robin5002234/building-a-scalable-real-time-chat-applicat
ion-with-scoket-io-react-nestjs-and-redis-cluster-7822f9d2b0a3
63. Private messaging - Part I | Socket.IO, erişim tarihi Ağustos 8, 2025,
https://socket.io/get-started/private-messaging-part-1/
64. How to create rooms with nestjs and socket.io - Stack Overflow, erişim tarihi
Ağustos 8, 2025,
https://stackoverflow.com/questions/55949600/how-to-create-rooms-with-nestj
s-and-socket-io