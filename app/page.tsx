"use client";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import productsData from "./data/products.json";
import { Product } from "./types";
import ProductCard from "./ProductCard";
export default function Home() {
 const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [favorites, setFavorites] = useState<string[]>([]);
useEffect(() => {
  const savedFavorites = localStorage.getItem("favorites");

  if (savedFavorites) {
    setFavorites(JSON.parse(savedFavorites));
  }
}, []);
useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]); 
useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");
console.log("SUPABASE DATA:", data);
console.log("SUPABASE ERROR:", error);
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setProducts(data as Product[]);
    }
  }

  loadProducts();
}, []);
 const [showFavorites, setShowFavorites] = useState(false); 
 const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const totalProducts = products.length;
  const winnerProducts = products.filter((p: Product) => p.score >= 85).length;
  const trendingProducts = products.filter((p: Product) => p.growth >= 60).length;
 function calculateScore(product: Product) {
  const revenueScore = Math.min((product.revenue || 0) / 10000, 30);
  const viewsScore = Math.min((product.views || 0) / 200000, 25);
  const growthScore = Math.min(product.growth || 0, 25);

  let competitionPenalty = 0;
  if (product.competition === "high") competitionPenalty = 10;
  if (product.competition === "medium") competitionPenalty = 5;
  if (product.competition === "low") competitionPenalty = 0;

 return Math.round(
  revenueScore * 1.4 +
  viewsScore * 1.2 +
  growthScore * 1.5 -
  competitionPenalty +
  5
);
}
  const averageScore = Math.round(
    products.reduce((sum: number, p: Product) => sum + p.score, 0) / products.length
  );

  const categories = ["all", ...new Set(products.map((p: any) => p.category))];

  const filteredProducts = products
    .filter((product: Product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product: Product) => {
      if (filter === "winner") return product.score >= 85;
      if (filter === "trending") return product.growth >= 60;
      return true;
    })
    .filter((product: Product) => {
      if (category === "all") return true;
      return product.category === category;
    })
   .filter((product: Product) =>
  showFavorites
    ? favorites.includes(product.id)
    : true
)
    .sort((a: any, b: any) => b.score - a.score);

  return (
    <main style={{ minHeight: "100vh", background: "#0f172a", padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ color: "white", fontSize: "48px", marginBottom: "20px" }}>
        TikTok Product Finder 🚀
      </h1>
<div className="flex gap-3 mb-6">
  <div className="mb-10">
  <h2 className="text-3xl font-bold text-white mb-5">
    🔥 Beste Chancen heute
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {filteredProducts.slice(0, 3).map((product: Product) => (
      <div
        key={product.id}
        onClick={() => setSelectedProduct(product)}
       className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-2 transition-all duration-300"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-2xl mb-4"
        />

        <h3 className="text-white text-xl font-bold mb-2">
          {product.name}
        </h3>

        <p className="text-zinc-400 mb-3">
          {product.category}
        </p>

        <div className="text-cyan-400 font-bold text-2xl">
          Score: {calculateScore(product)}
        </div>
      </div>
    ))}
  </div>
</div>
  <button
    onClick={() => setShowFavorites(false)}
    className={`px-4 py-2 rounded-xl ${
      !showFavorites
        ? "bg-cyan-500 text-black"
        : "bg-zinc-800 text-white"
    }`}
  >
    Alle Produkte
  </button>

  <button
    onClick={() => setShowFavorites(true)}
    className={`px-4 py-2 rounded-xl ${
      showFavorites
        ? "bg-yellow-400 text-black"
        : "bg-zinc-800 text-white"
    }`}
  >
    Favoriten ⭐
  </button>
</div>
<input
  type="text"
  placeholder="Produkte suchen..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full max-w-xl mb-8 px-5 py-3 rounded-2xl bg-zinc-800 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-cyan-400"
/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <StatCard label="Produkte" value={totalProducts} />
        <StatCard label="Gewinner" value={winnerProducts} />
        <StatCard label="Trending" value={trendingProducts} />
        <StatCard label="Ø Score" value={averageScore} />
      </div>

      <input
        placeholder="Suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", marginBottom: "20px", fontSize: "16px" }}
      />

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>Alle</button>
        <button onClick={() => setFilter("winner")}>Gewinner</button>
        <button onClick={() => setFilter("trending")}>Trending</button>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
        {categories.map((cat: any) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: category === cat ? "#67e8f9" : "#1e293b",
              color: category === cat ? "#0f172a" : "white",
              fontWeight: "bold",
            }}
          >
            {cat === "all" ? "Alle Kategorien" : cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {filteredProducts.map((product: any) => (
          <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ background: "#1e293b", padding: "20px", borderRadius: "20px", cursor: "pointer", color: "white" }}>
            <p style={{ color: "#67e8f9", fontWeight: "bold" }}>{product.category}</p>

            {product.score >= 85 && (
              <p style={{ background: "#22c55e", color: "#052e16", padding: "6px 10px", borderRadius: "999px", display: "inline-block", fontWeight: "bold" }}>
                🏆 Gewinner
              </p>
            )}

           <img
  src={product.image?.trim() || "/images/placeholder.jpg"}
  alt={product.name}
  width={300}
  height={180}
  style={{
    borderRadius: "12px",
    width: "100%",
    height: "200px",
    objectFit: "cover"
  }}
/>

            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Supplier: {product.supplier}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px", marginBottom: "12px" }}>
             <span
  style={badgeStyle}
  className="animate-pulse"
>
  🔥 {product.trendLevel}
</span>
              <span style={badgeStyle}>⚔️ {product.competition}</span>
              <span style={badgeStyle}>💰 {product.marginPotential}</span>
              <span style={badgeStyle}>🛒 {product.priceRange}</span>
            </div>

            <a href={product.link} target="_blank" style={{ color: "#67e8f9", textDecoration: "none", fontWeight: "bold" }}>
              Produkt ansehen 🚀
            </a>

            <p>Einnahmen: €{(product.revenue || 0).toLocaleString("de-DE")}</p>
            <p>Wachstum: +{product.growth || 0}%</p>
            <p>Ansichten: {(product.views || 0).toLocaleString("de-DE")}</p>
 <p
  className={
    calculateScore(product) >= 95
      ? "text-green-400 font-bold"
      : calculateScore(product) >= 85
      ? "text-cyan-400 font-bold"
      : "text-orange-400 font-bold"
  }
>
  Punktzahl: {calculateScore(product)}
</p>
            <div className="mt-6 bg-zinc-800 rounded-2xl p-5">
  <h3 className="text-cyan-400 text-xl font-bold mb-3">
    Warum dieses Produkt gewinnt 🚀
  </h3>

  <ul className="space-y-2 text-zinc-300">
    <li>✅ Hohe Nachfrage auf TikTok</li>
    <li>✅ Gute Gewinnmarge</li>
    <li>✅ Starkes Viral-Potenzial</li>
    <li>✅ Einfach per Dropshipping verkaufbar</li>
  </ul>
</div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1e293b",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "720px",
              color: "white",
              padding: "28px",
            }}
          >
<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
  <div className="bg-zinc-900 rounded-3xl max-w-3xl w-full p-6 relative border border-zinc-800">

    <button
      onClick={() => setSelectedProduct(null)}
      className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl"
    >
      ×
    </button>

    <div className="grid md:grid-cols-2 gap-8">

      <div>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          width={500}
          height={500}
          className="rounded-2xl object-cover w-full h-[350px]"
        />
      </div>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            {selectedProduct.name}
          </h2>

          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
            Score {selectedProduct.score}
          </div>
        </div>

        <p className="text-zinc-400">
          {selectedProduct.description}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4">

          <div className="bg-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-sm">Revenue</p>
            <p className="text-2xl font-bold">
              €{(selectedProduct.revenue || 0).toLocaleString("de-DE")}
            </p>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-sm">Views</p>
            <p className="text-2xl font-bold">
              {(selectedProduct.views || 0).toLocaleString("de-DE")}
            </p>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-sm">Growth</p>
            <p className="text-2xl font-bold text-green-400">
              +{selectedProduct.growth || 0}%
            </p>
          </div>

          <div className="bg-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-sm">Competition</p>
            <p className="text-xl font-bold">
              {selectedProduct.competition}
            </p>
          </div>

        </div>

        <div className="pt-4 space-y-2">

          <div className="flex justify-between">
            <span className="text-zinc-500">Supplier</span>
            <span>{selectedProduct.supplier}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Trend Level</span>
            <span>{selectedProduct.trendLevel}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Margin Potential</span>
            <span>{selectedProduct.marginPotential}</span>
          </div>
<div className="pt-6 flex gap-3">

  <a
    href={selectedProduct.link || "#"}
    target="_blank"
    className="flex-1 bg-white text-black py-3 rounded-2xl text-center font-semibold hover:opacity-90 transition"
  >
    View Product
  </a>

  <a
    href={`https://www.tiktok.com/search?q=${encodeURIComponent(selectedProduct.name)}`}
    target="_blank"
    className="flex-1 bg-pink-500 py-3 rounded-2xl text-center font-semibold hover:bg-pink-400 transition"
  >
    TikTok Research
  </a>

<button
  onClick={() => {
    if (favorites.includes(selectedProduct.id)) {
      setFavorites(
        favorites.filter((id) => id !== selectedProduct.id)
      );
    } else {
      setFavorites([...favorites, selectedProduct.id]);
    }
  }}
  className="bg-zinc-800 px-5 rounded-2xl hover:bg-zinc-700 transition"
>
  {favorites.includes(selectedProduct.id) ? "★" : "☆"}
</button>
</div>
        </div>

      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div style={{ background: "#1e293b", color: "white", padding: "20px", borderRadius: "18px" }}>
      <p style={{ color: "#94a3b8", margin: 0 }}>{label}</p>
      <h2 style={{ margin: "8px 0 0", fontSize: "32px" }}>
  {Number.isFinite(Number(value)) ? value : 0}
</h2>
    </div>
  );
}

const badgeStyle = {
  background: "#334155",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
};