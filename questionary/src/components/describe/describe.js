"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import AuroraBackground from "./aurora";
import TextGenerateEffect from "./generateText";
import { useNavigate } from "react-router-dom";

export function Describe() {
    const words = "El conocimiento es tu herramienta para llegar a los Campos Elíseos o para quedarte en el Tártaro.";
    const words2 = "Crea una cuenta o inicia sesión para demostrar tu sabiduría y alcanzar la gloria."
    const navigate = useNavigate()

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          The Quizz BDP
        </div>
        <TextGenerateEffect words={words2} className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4"/>

        <button onClick={() => navigate("/logIn")} className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Inicia sesión aquí
        </button>
      </motion.div>
    </AuroraBackground>
  );
}

export default Describe;