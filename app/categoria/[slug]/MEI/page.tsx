"use client";

import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, Globe, Instagram } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SwiperCarousel } from "../../../../components/CarouselMEI";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categories } from "@/app/page";
import Image from "next/image";

// --- DADOS DE EXEMPLO (SUBSTITUA PELA SUA BUSCA NO FIREBASE) ---
const mei = {
  name: "Art's & Crochê",
  rating: 4.7,
  logo: "/gatinho.jpg",
  reviewsCount: 23,
  description:
    "Art's & Crochê é um espaço dedicado à arte do crochê, onde cada peça é criada com carinho, criatividade e atenção aos detalhes. Mais do que um simples ateliê, é um lugar que valoriza o trabalho manual e transforma linhas em arte, oferecendo produtos exclusivos que carregam histórias, afeto e autenticidade, feitos especialmente para quem aprecia o verdadeiro valor do artesanal.",
  description_diferencial:
    "1.✨ Peças exclusivas feitas à mão, com amor, autenticidade e dedicação em cada detalhe.\n" +
    "2.🛍️ Produtos únicos, artesanais e cheios de significado. Mais que peças, histórias feitas à mão.\n" +
    "3.💖 Artesanato exclusivo: cada peça é feita à mão com carinho, originalidade e qualidade incomparável.",
  instagram: "https://www.instagram.com/vinicius.diller/?hl=en",
  category: "telefones-uteis",
  images: ["/placeholder.jpg", "/gatinho.jpg", "/placeholder.jpg"],
  address: "Rua das Artes, 123 - Centro, Saquarema - RJ",
  phone: "(22) 97794-8763",
  website: "https://github.com/",
  coordinates: {
    lat: -22.921,
    lng: -42.509,
  },
  reviews: [
    { id: 1, user: "Maria S.", rating: 5, comment: "Peças maravilhosas..." },
    {
      id: 2,
      user: "João P.",
      rating: 4,
      comment: "O atendimento foi ótimo...",
    },
  ],
};
// --- FIM DOS DADOS DE EXEMPLO ---

// Configuração dos ícones do mapa
const defaultIcon = new L.Icon({
  iconUrl: "/marker-icon-blue.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componentes do Mapa carregados dinamicamente
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Componente para renderizar as estrelas de avaliação
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-yellow-400"
        />
      ))}
      {halfStar && <Star key="half" className="w-5 h-5 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
};

export default function MeiDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Estado para garantir que o mapa só renderize no lado do cliente
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // TODO: Adicione aqui sua lógica para buscar os dados do MEI do Firebase

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-orange-400">
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <Link
            href={`/categoria/${mei.category}`}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-800 truncate pr-12">
            {mei.name}
          </h1>
        </div>
      </header>

      <main className="w-full p-4 md:p-6 ">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            {/* Grid principal com 3 colunas */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna 2: Nome, Avaliações e Descrição (ocupando 2 colunas) */}
              <div className="md:col-span-2 flex flex-col">
                {/* Container para Nome e Avaliações */}
                <div className="mb-4 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {mei.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 px-auto justify-center">
                    <StarRating rating={mei.rating} />
                    <span className="text-gray-600 font-semibold">
                      {mei.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({mei.reviewsCount} avaliações)
                    </span>
                  </div>
                </div>

                {/* Container para a Descrição */}
                <div className="milecem:pl-10 milecem:mt-6 flex flex-col h-full ">
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {mei.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed mt-6">
                      <strong>
                        {mei.description_diferencial
                          .split("\n")
                          .map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                      </strong>
                    </p>
                  </div>
                  <div className="hidden quinhentos:mt-6 quinhentos:flex items-center md:mt-10 milesetecentos:mt-auto milesetecentos:mb-[5%]">
                    <span>Instagram:</span>
                    <a
                      href={mei.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                    >
                      <Instagram size={26} strokeWidth={2} />
                    </a>

                    <span className="ml-2.5 milecem:ml-5 desktop:ml-10">
                      Website:
                    </span>
                    <a
                      href={mei.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors ml-1"
                    >
                      <Globe size={26} strokeWidth={2} />
                    </a>
                  </div>
                </div>
              </div>

              {/*Logo */}
              <div className="flex items-center justify-center md:block md:col-span-1 ">
                <Image
                  src={mei.logo}
                  alt={`Logo de ${mei.name}`}
                  width={200}
                  height={300}
                  className="w-auto h-auto object-cover rounded-3xl border-2 border-gray-200"
                />
              </div>
              <div className="mt-6 flex items-center quinhentos:hidden">
                <span>Instagram:</span>
                <a
                  href={mei.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                >
                  <Instagram size={26} strokeWidth={2} />
                </a>

                <span className="ml-2.5 milecem:ml-5 desktop:ml-10">Site:</span>
                <a
                  href={mei.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors ml-1"
                >
                  <Globe size={26} strokeWidth={2} />
                </a>
              </div>
            </div>
          </section>

          {/* ===== SEÇÃO DO MAPA MOVIDA PARA CÁ ===== */}
          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Localização e Contato
            </h3>
            <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden mb-4 border">
              {isClient && mei.coordinates ? (
                <MapContainer
                  center={[mei.coordinates.lat, mei.coordinates.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[mei.coordinates.lat, mei.coordinates.lng]}
                    icon={defaultIcon}
                  >
                    <Popup>{mei.name}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p className="flex items-center justify-center h-full text-gray-500">
                  Carregando mapa...
                </p>
              )}
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                <span>{mei.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>{mei.phone}</span>
              </div>
            </div>
          </section>
          {/* ======================================= */}

          <section className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações
            </h3>
            <div className="space-y-6">
              {mei.reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <div className="flex items-center gap-1 my-1">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
