import React, { } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./battleRoyale.css"
import DropdownMenu from "../homebotton/homebotton";
import getAvatar from "../../avatars";
import { getCookieValue } from "../../authSlide";

/**
 * Component that displays the Lost Page for Battle Royale.
 * @returns {JSX.Element} JSX element the Lost Page.
 */
function WinPage() {
    const avatar = getCookieValue("avatar")

    const leaveGame = () => {
        window.location.href = "/"
    }

    const startGame = () => {
        window.location.href = "/battleRoyale"
    };


    return (
        <div className="back">
            <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> { }
            <b className="page">
                <div className="container">
                    <div className="winner">
                        Winner Winner chicken dinner!
                    </div>
                    <div>
                        <button className="fun_royale" onClick={startGame} > ¿Desea volver a ganar? ¡Pulse aqui! </button>
                        <button className="fun_royale" onClick={leaveGame} > ¿Volver al menú principal? ¡Pulse aqui! </button>
                    </div>
                </div>
            </b>
        </div>
    );
}

export default WinPage;