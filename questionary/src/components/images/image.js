import React, { useState, useEffect } from "react"; // Agrega la importación de useEffect
import Card from "../card/card.js";
import "./image.css";

const imageGallery = {
    "guitarra":
    "https://img.freepik.com/foto-gratis/rollo-estudio-banda-diapason-madera_1172-290.jpg?w=2000",
    "clave de sol":
    "https://i.ebayimg.com/images/g/hXQAAOSwoG1cfkPq/s-l1600.jpg",
    "Do":
    "https://i0.wp.com/i.ytimg.com/vi/IcnFG-ZJJsg/hqdefault.jpg?w=604&ssl=1"
};

function ImageApp() {
    const [currentCard, setCurrentCard] = useState(null);
    const [remainingCards, setRemainingCards] = useState([]);
  
    useEffect(() => {
      // Inicialmente, mezclamos las claves del diccionario para obtener un orden aleatorio
      const shuffledKeys = Object.keys(imageGallery).sort(() => Math.random() - 0.5);
      setRemainingCards(shuffledKeys);
    }, []);
  
    const handleNextCard = () => {
      if (remainingCards.length === 0) {
        // Si ya no quedan tarjetas, reiniciamos el juego
        const shuffledKeys = Object.keys(imageGallery).sort(() => Math.random() - 0.5);
        setRemainingCards(shuffledKeys);
      }
  
      // Tomamos la siguiente clave aleatoria y la eliminamos de las tarjetas restantes
      const randomKey = remainingCards.pop();
      setCurrentCard(randomKey);
    };
  
    const handleRevealKey = (key) => {
      console.log(`La clave es: ${key}`);
    };
  
    useEffect(() => {
      if (remainingCards.length > 0) {
        handleNextCard();
      }
    }, [remainingCards]);
  
    return (
      <div className="App">
        <h1>Music Questionary</h1>
        <div className="card-container">
          {currentCard && (
            <Card
              key={currentCard}
              title={currentCard}
              imageUrl={imageGallery[currentCard]}
              onNextCard={handleNextCard}
              onRevealKey={handleRevealKey}
            />
          )}
        </div>
      </div>
    );
  }
  
export default ImageApp;
