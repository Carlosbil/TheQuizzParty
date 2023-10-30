import React, { useState } from 'react';

const Questionary = () => {
    const [respuestas, setRespuestas] = useState({});

    const preguntas = [
        { id: 1, texto: '¿Qué te parece la interfaz de la aplicación?', tipo: 'opciones' },
        { id: 2, texto: '¿La aplicación es fácil de usar?', tipo: 'opciones' },
        { id: 3, texto: '¿Qué funcionalidades añadirías?', tipo: 'texto' }
    ];


    const opciones = [1, 2, 3, 4, 5];

    const handleOptionChange = (e, id) => {
        setRespuestas({
            ...respuestas,
            [id]: e.target.value
        });
    };

    const handleInputChange = (e, id) => {
        setRespuestas({
            ...respuestas,
            [id]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Respuestas del cuestionario:', respuestas);
        // Aquí puedes enviar las respuestas a tu backend o hacer lo que necesites con ellas
    };

    return (
        <a className='back'>
            <b className='page'>
                <div className="container">
                    <h2>Cuestionario sobre la aplicación</h2>
                    <form onSubmit={handleSubmit}>
                        {preguntas.map(pregunta => (
                            <div className="questionary" key={pregunta.id}>
                                <label>{pregunta.texto}</label>
                                <div>
                                    {pregunta.tipo === 'opciones' && opciones.map(opcion => (
                                        <label key={opcion}>
                                            <input
                                                type="radio"
                                                value={opcion}
                                                checked={respuestas[pregunta.id] == opcion}
                                                onChange={(e) => handleOptionChange(e, pregunta.id)}
                                            />
                                            {opcion}
                                        </label>
                                    ))}
                                    {pregunta.tipo === 'texto' &&
                                        <textarea
                                            value={respuestas[pregunta.id] || ''}
                                            onChange={(e) => handleInputChange(e, pregunta.id)}
                                        />
                                    }
                                </div>
                            </div>
                        ))}
                        <button className='button' type="submit">Enviar respuestas</button>
                    </form>
                </div>
            </b>
        </a>
    );
};

export default Questionary;
