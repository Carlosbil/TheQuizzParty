import React, { useEffect, useState } from "react";
import "./tinkers.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TINKERS_URL } from "../../enpoints"
import TinkersDisplayer from "./tinkersDisplayer";
import DropdownMenu from "../homebotton/homebotton";
import getAvatar from "../../avatars";
import { getCookieValue } from "../../authSlide";
import QuestionDisplayer from "../questionDisplayer/questionDisplayer";
import { stopSoundByName } from "../../sounds";
import TextGenerateEffect from "../describe/generateText";

export function Tinkers() {
  const [questions, setQuestions] = useState([]);
  const [start, setStart] = useState(false);
  const avatar = getCookieValue("avatar")
  const words2 = "1 minuto, 10 preguntas, ¿podrás acertar todas en el menor tiempo posible y ser el número 1?"
  const [deconstruct, setDeconstruct] = useState(false);

  const leaveGame = () => {
    window.location.href = "/"
  }


  const handleButtonClick = () => {
    setDeconstruct(true);
    setTimeout(() => {
      setStart(true);
    }, 1000); // Duración de la animación de deconstrucción
  };


  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = () => {
    axios
      .get(TINKERS_URL)
      .then((response) => {
        setQuestions(response.data.questions);
      })
      .catch((error) => {
        console.error("Error al iniciar el juego", error);
        if (error.response === undefined || error.response.data.error === undefined) {
          toast.error("Error al iniciar el juego:" + error.message);
        } else {
          toast.error("Error al iniciar el juego:" + error.response.data.error);
        }
      });
  }

  return (
    <div className="back2">
      <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
      <b className="page">
        {!start &&
          <div>
            <div className="text-3xl md:text-7xl font-bold text-white text-center">
              Thinkers
            </div>
            <TextGenerateEffect words={words2} className="font-extralight text-base md:text-4xl text-neutral-200 py-4" />
            <div className="flex justify-center">
              <button
                onClick={() => handleButtonClick()}
                className="bg-white rounded-lg mx-auto text-black px-4 py-2 text-center transform transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl pulse-thinker"
              >
                Pulse aquí para jugar!
              </button>
            </div>

          </div>}
        {start && <TinkersDisplayer questions_prop={questions} />}
      </b>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Tinkers;
