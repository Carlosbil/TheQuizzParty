import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './battleRoyale.css'
import DropdownMenu from '../homebotton/homebotton';
import getAvatar from '../../avatars';
import { getCookieValue } from '../../authSlide';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../enpoints';
/**
 * Component that displays the Battle Royale menu.
 * @returns {JSX.Element} JSX element containing the Battle Royale menu.
 */
function MenuBattleRoyale() {
    const avatar = getCookieValue("avatar")
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/")
    };
    
    const startGame = () => {
        toast.info("Buscando partida");
        let data = {
            "token": getCookieValue("auth_token")
        };

        // Emitir evento al servidor para unirse a la sala
        socket.emit('join_game', data);

        // Emitir un evento de prueba
        socket.emit('test_event', {data: 'Test data'});

        // Escuchar eventos de respuesta del servidor
        socket.on('join', (response) => {
            console.log(response);
        });

        socket.on('error', (error) => {
            console.error('Error al unirse a la partida:', error);
            toast.error('Error al unirse a la partida: ' + error);
        });
    };
    

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
