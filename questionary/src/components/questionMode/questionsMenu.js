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
                        <button className="fun_royale" onClick={() => startGame("science")} > Ciencias </button>
                        <button className="fun_royale" onClick={() => startGame("entertainment")} > Entretenimiento </button>
                        <button className="fun_royale" onClick={() => startGame("sports")} > Deporte </button>
                        <button className="fun_royale" onClick={() => startGame("literature")} > Entretenimiento </button>
                        <button className="fun_royale" onClick={() => startGame("pop_culture")} > Cultura POP </button>
                    </div>
                </div>}
                {showQuestionDisplayer && <QuestionDisplayer />}

                {showQuestionDisplayer &&
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] flex justify-center space-x-4 mb-10">
                        <button
                            onClick={() => leaveGame()}
                            className="bg-white rounded-lg text-black px-4 py-2 text-center transform transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl pulse-thinker flex-grow mx-2"
                        >
                            Menu Principal
                        </button>
                        <button
                            onClick={() => changeTheme()}
                            className="bg-white rounded-lg text-black px-4 py-2 text-center transform transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl pulse-thinker flex-grow mx-2"
                        >
                            Cambiar Tema
                        </button>
                    </div>}




            </b>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default QuestionsMenu;
