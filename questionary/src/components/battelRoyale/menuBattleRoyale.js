import React, {useState, useEffect} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './battleRoyale.css'
import DropdownMenu from '../homebotton/homebotton';
import getAvatar from '../../avatars';
import { getCookieValue } from '../../authSlide';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../enpoints';
import RoomBattleRoyale from './roomBattleRoyale';

/**
 * Component that displays the Battle Royale menu.
 * @returns {JSX.Element} JSX element containing the Battle Royale menu.
 */
function MenuBattleRoyale() {
    const avatar = getCookieValue("avatar")
    const navigate = useNavigate();
    const [showPlayers, setShowPlayers] = useState(false);
    const [players, setPlayers] = useState({}); // {name: avatar, name2: avatar2}, ...
    const [room_id, setRoom_id] = useState("0");
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

        // Escuchar eventos de respuesta del servidor
        socket.on('join_game_response', (response) => {
            console.log(response);
            toast.success('Unido a la partida');
            setShowPlayers(true);
            setPlayers(response.players);
            setRoom_id(response.room_id);
        });

        socket.on('error', (error) => {
            console.error('Error al unirse a la partida:', error);
            toast.error('Error al unirse a la partida: ' + error);
        });
    };

    useEffect(() => {
        socket.on('join_game_response', (response) => {
            console.log(response);
            setPlayers(response.players);
        });
    }, []);

    return (
        <div className='back'>
            <DropdownMenu onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
            <b className='page'>
                {!showPlayers &&<div className="container">
                    <div>
                        <button className='fun_royale' onClick={startGame} > Sobrevivirás? </button>
                        <button className='fun_royale' onClick={startGame} > Invitar a un jugador </button>
                    </div>
                </div>}
                {showPlayers && <RoomBattleRoyale prop_players={players} prop_room_id={room_id} />}
            </b>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default MenuBattleRoyale;
