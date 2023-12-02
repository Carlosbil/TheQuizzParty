import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './battleRoyale.css'
import DropdownMenu from '../homebotton/homebotton';
import getAvatar from '../../avatars';
import { getCookieValue } from '../../authSlide';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../enpoints';
import RoomBattleRoyale from './roomBattleRoyale';
import ClockTimer from '../timer/timer';

/**
 * Component that displays the Battle Royale menu.
 * @returns {JSX.Element} JSX element containing the Battle Royale menu.
 */
function MenuBattleRoyale() {
    const avatar = getCookieValue("avatar")
    const navigate = useNavigate();
    let num_players = 0;
    const [showPlayers, setShowPlayers] = useState(false);
    const [players, setPlayers] = useState({}); // {name: avatar, name2: avatar2}, ...
    const [room_id, setRoom_id] = useState("0");
    const [health, setHealth] = useState(100);

    const leaveGame = () => {
        let data = {
            "token": getCookieValue("auth_token"),
            "room": room_id
        };
        socket.emit('leave_game', data);
        window.location.href = "/"
    }

    const startGame = () => {
        toast.info("Buscando partida");
        let data = {
            "token": getCookieValue("auth_token")
        };

        // Join to a room
        socket.emit('join_game', data);

        // Listen server response
        socket.on('join_game_response', (response) => {
            console.log(response);
            setRoom_id(response.room);
            setHealth(response.health);
            socket.off('join_game_response');
        });
        socket.on('update_players', (response) => {
            console.log(response);
            setShowPlayers(true);
            console.log(Object.keys(response.players).length);
            console.log(num_players);
            if (Object.keys(response.players).length > num_players) {
                toast.success('Nuevo jugador en la partida!');
            }
            else {
                toast.error('Un jugador ha abandonado la partida');
            }
            setPlayers(response.players);
            num_players = Object.keys(response.players).length;
            socket.off('join_game_response');

        });
        //listen the errors and show them
        socket.on('error', (error) => {
            console.error('Error al unirse a la partida:', error);
            toast.error('Error al unirse a la partida: ' + error);
            socket.off('error');
        });
    };


    return (
        <div className='back'>
            <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
            <b className='page'>
                {!showPlayers && <div className="container">
                    <div>
                        <button className='fun_royale' onClick={startGame} > Sobrevivirás? </button>
                        <button className='fun_royale' onClick={startGame} > Invitar a un jugador </button>
                    </div>
                </div>}
                {showPlayers && <RoomBattleRoyale prop_players={players} prop_room_id={room_id} prop_health={health} />}
            </b>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default MenuBattleRoyale;
