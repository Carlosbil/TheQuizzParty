import React, { useState } from "react";
import "./card.css"; // Asegúrate de que la ruta del archivo de estilo sea correcta

function Card({ title, imageUrl, onNextCard, onRevealKey }) {
  const [revealed, setRevealed] = useState(false);

  const handleRevealKey = () => {
    setRevealed(true);
    onRevealKey(title);
  };

  return (
    <div className={`card ${revealed ? "revealed" : ""}`}>
      <div className="card-content">
        <img src={imageUrl} alt={title} className="card-image" />
        <h2>{revealed ? title : "*****"}</h2>
      </div>
      <div className="card-buttons">
        <button className="reveal-button" onClick={handleRevealKey}>
          Revelar Clave
        </button>
        <button className="next-button" onClick={onNextCard}>
          Avanzar
        </button>
      </div>
    </div>
  );
}

export default Card;
