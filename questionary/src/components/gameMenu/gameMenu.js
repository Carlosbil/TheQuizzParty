import React from "react";
import "./gameMenu.css";
import { stopSoundByName } from "../../sounds";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function FunButtons() {
  const navigate = useNavigate()

  const handleButtonClick_questionsGame = () => {
    stopSoundByName("background")
    navigate("/questions")
    localStorage.setItem("category", "History");
  };

  const handleButtonClick_tinkers = () => {
    stopSoundByName("background")
    navigate("/tinkers")
  };
  const handleButtonClick_battleRoyale = () => {
    stopSoundByName("background")
    toast.warning(" Sigo trabajando en esto, vuelve pronto ❤️")
  };
  return (
    <div className="Page">
        <div className="container_game_menu">
          <button className="fun_royale" key="battle_royale_button" onClick={() =>toast.warning(" Sigo trabajando en esto, vuelve pronto ❤️")}>
            👑 Battle Royale 👑
          </button>
          <button className="fun_royale" key="thinkers_button" onClick={() => handleButtonClick_tinkers()}>
            {/*cambiar el nombre de tinkers*/}
            ⚠️ Tinkers ⚠️
          </button>
          <button className="fun_royale" key="questionsGame_button" onClick={() => handleButtonClick_questionsGame()}>
            🎮 Practica aquí 🎮
          </button>
        </div>
    </div>
  );
}
export default FunButtons;
