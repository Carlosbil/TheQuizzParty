import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './battleRoyale.css'
import DropdownMenu from '../homebotton/homebotton';
import getAvatar from '../../avatars';
import { getCookieValue } from '../../authSlide';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOIN_ROOM_URL } from '../../enpoints';
function MenuBattleRoyale() {
    const avatar = getCookieValue("avatar")
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/")
    };

    const startGame = () => {
        toast.info("Buscando partida")
        let data = {
            "token": getCookieValue("auth_token")
        }
        axios
        .post(JOIN_ROOM_URL, data)
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
            if (error.response === undefined || error.response.data.error === undefined) {
                toast.error('Error al realizar la solicitud:' + error.message);
            } else {
                toast.error('Error al realizar la solicitud:' + error.response.data.error);
            }
        });
    }

    return (
        <div className='back'>
            <DropdownMenu onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
            <b className='page'>
                <div className="container">

                    <div>
                        <button className='fun_royale' onClick={startGame} > Sobrevivirás? </button>
                        <button className='fun_royale' onClick={startGame} > Invitar a un jugador </button>
                    </div>
                </div>
            </b>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default MenuBattleRoyale;
