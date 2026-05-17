import Image from "next/image";
import { Product } from "./types";

type Props = {
  product: Product;
  onClick: () => void;
};

const badgeStyle = {
  background: "#334155",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
};

export default function ProductCard({ product, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "20px",
        cursor: "pointer",
        color: "white",
      }}
    >
      <p style={{ color: "#67e8f9", fontWeight: "bold" }}>
        {product.category}
      </p>

      {product.score >= 85 && (
        <p
          style={{
            background: "#22c55e",
            color: "#052e16",
            padding: "6px 10px",
            borderRadius: "999px",
            display: "inline-block",
            fontWeight: "bold",
          }}
        >
          🏆 Gewinner
        </p>
      )}

      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={180}
        style={{
          borderRadius: "12px",
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <p>Supplier: {product.supplier}</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "12px",
          marginBottom: "12px",
        }}
      >
        <span style={badgeStyle}>🔥 {product.trendLevel}</span>
        <span style={badgeStyle}>⚔️ {product.competition}</span>
        <span style={badgeStyle}>💰 {product.marginPotential}</span>
        <span style={badgeStyle}>🛒 {product.priceRange}</span>
      </div>

     <a
  href={product.link}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    color: "#67e8f9",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  Produkt ansehen 🚀
</a>

      <p>Einnahmen: €{product.revenue.toLocaleString("de-DE")}</p>
      <p>Wachstum: +{product.growth}%</p>
      <p>Ansichten: {product.views.toLocaleString("de-DE")}</p>
      <p>Punktzahl: {product.score}</p>
    </div>
  );
}