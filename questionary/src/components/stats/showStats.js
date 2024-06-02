import React, { useState, useEffect } from 'react';
import RadarChart from './RadarChart';  // Asegúrate de que la ruta de importación sea correcta
import { getCookieValue } from '../../authSlide';
import getAvatar from '../../avatars';
import DropdownMenu from '../homebotton/homebotton';
import { POST_STATS_URL } from '../../enpoints';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Stats = () => {
    const [accerted_list, setAccertedList] = useState([]);
    const avatar = getCookieValue("avatar")

    const leaveGame = () => {
        window.location.href = "/"
    }
  
    const postStats = () => {
        let token = getCookieValue("auth_token")
        let formData = {
            "token": token,
        }
        axios
            .post(POST_STATS_URL, formData)
            .then((response) => {
                toast.success("Se ha obtenido su informacion")
                console.log(response)
                setAccertedList(response.data)
            })
            .catch((error) => {
                console.error("Error al realizar la solicitud:", error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error("Error al realizar la solicitud:" + error.message);
                } else {
                    toast.error("Error al realizar la solicitud:" + error.response.data.error);
                }
            });
    }

    useEffect(() => {
        // Aquí podrías cargar los datos o recibirlos de alguna API
        postStats()
    }, []);

    return (
        <div className="back">
            <div className="page">
                <div>
                    <h1>Resultados por Categoría</h1>
                    <RadarChart accerted_list={accerted_list} />
                    <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Stats;
