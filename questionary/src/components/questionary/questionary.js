import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ADD_QUESTIONARY_URL } from '../../enpoints';
import { getCookieValue } from '../../authSlide';

const Questionary = () => {
    const [respuestas, setRespuestas] = useState({});

    const preguntas = [
        { id: 1, texto: '¿Qué te parece la interfaz de la aplicación?', tipo: 'opciones' },
        { id: 2, texto: '¿La aplicación es fácil de usar?', tipo: 'opciones' },
        { id: 3, texto: '¿Las preguntas le parecieron interesantes?', tipo: 'opciones' },
        { id: 4, texto: '¿Qué funcionalidades añadirías?', tipo: 'texto' },
        { id: 5, texto: '¿Que quitarís o cambiarías?', tipo: 'texto' }
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
        let data = {
            "interface": respuestas[1],
            "ez2use": respuestas[2],
            "questions": respuestas[3],
            "functionality": respuestas[4],
            "delete": respuestas[5],
            "token": getCookieValue("auth_token"),
        }
        console.log('Respuestas del cuestionario:', data);
        axios
        .post(ADD_QUESTIONARY_URL, data)
        .then((_) => {
            toast.success("Las respuestas se han guardado, gracias!")
        })
        .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
            if (error.response === undefined || error.response.data.error === undefined) {
                toast.error('Error al realizar la solicitud:' + error.message);
            } else {
                toast.error('Error al realizar la solicitud:' + error.response.data.error);
            }
        });    };

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
                        <button className='linked' type="button" onClick={() => window.location.href = "/"}>Volver al inicio</button>
                    </form>
                </div>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </b>
        </a>
    );
};

export default Questionary;
