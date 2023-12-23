import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropdownMenu from "../homebotton/homebotton";
import getAvatar from "../../avatars";
import { getCookieValue } from "../../authSlide";
import QuestionDisplayer from "../questionDisplayer/questionDisplayer";
import { stopSoundByName } from "../../sounds";

/**
 * Component that displays the Battle Royale menu.
 * @returns {JSX.Element} JSX element containing the Battle Royale menu.
 */
function QuestionsMenu() {
    const avatar = getCookieValue("avatar")
    const [showQuestionDisplayer, setShowQuestionDisplayer] = useState(false);
    const leaveGame = () => {
        window.location.href = "/"
    }
    const changeTheme = () => {
        setShowQuestionDisplayer(false);
    }
    const startGame = (theme) => {
        stopSoundByName("background")
        setShowQuestionDisplayer(true);
        localStorage.setItem("category", theme);
    }

    return (
        <div className="back">
            <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
            <b className="page">
                {!showQuestionDisplayer && <div className="container">
                    <div>
                        <button className="fun_royale" onClick={() => startGame("history")} > Historia </button>
                        <button className="fun_royale" onClick={() => startGame("geography")} > Geografia </button>
                        <button className="fun_royale" onClick={() => startGame("science")} > Ciencuas </button>
                        <button className="fun_royale" onClick={() => startGame("entertainment")} > Entretenimiento </button>
                    </div>
                </div>}
                {showQuestionDisplayer && <QuestionDisplayer />}
                {showQuestionDisplayer && <button className="leave" onClick={() => leaveGame()}> Volver al menú principal </button>}
                {showQuestionDisplayer && <button className="leave" onClick={() => changeTheme()}> Seleccionar otro tema </button>}

            </b>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default QuestionsMenu;
