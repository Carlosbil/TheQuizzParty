import React, { useEffect, useState } from 'react';

function Unlockables() {
  const [data, setData] = useState({}); // Estado inicial vacío

  useEffect(() => {
    // Función para cargar los datos
    const fetchData = async () => {
      try {
        const response = await fetch('GET_UNLOCKS'); // Usa la URL real aquí
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch: ", error);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  const categories = Object.entries(data);

  return (
    <div>
      {categories.map(([categoryName, subcategories]) => (
        <div key={categoryName}>
          <h2>{categoryName}</h2>
          {subcategories.length > 0 && (
            <div>
              <h3>{subcategories[0].name}</h3>
              <p>{subcategories[0].description}</p>
              <img src={subcategories[0].image} alt={subcategories[0].name} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Unlockables;
