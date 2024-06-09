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

export function Tinkers() {
  const [questions, setQuestions] = useState([]);
  const [start, setStart] = useState(false);
  const avatar = getCookieValue("avatar")

  const leaveGame = () => {
    window.location.href = "/"
  }


  const handleButtonClick = () => {
    setStart(true);
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
    <div className="back">
      <DropdownMenu onClick={leaveGame} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
      <b className="page">
        {!start &&
          <button className="fun_tinker" onClick={handleButtonClick} >The fastest thinker alive</button>
        }
        {!start && <h2>Acierta para sumar puntos</h2>}
        {!start && <h2>Acaba antes de tiempo para ganar aún más</h2>}
        {!start && <h2>¡Suerte!</h2>}
        {start && <TinkersDisplayer questions_prop={questions} />}
      </b>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Tinkers;
