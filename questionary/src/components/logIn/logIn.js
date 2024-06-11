import React, { useState } from "react";
import "./logIn.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../../enpoints";
import { motion } from "framer-motion";
import AuroraBackground from "../describe/aurora";

import  Label  from "./label";
import  Input  from "./input";
import TextGenerateEffect from "../describe/generateText";

function LogIn() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(LOGIN_URL, formData)
            .then((response) => {
                // get the info
                const token = response.data.token;
                const avatar = response.data.image_path
                const username = response.data.username
                // save tokens
                document.cookie = "isAuthenticated=true; path=/; max-age=7200; samesite=Lax";
                document.cookie = `auth_token=${token}; path=/; max-age=7200; samesite=Lax`;
                document.cookie = "sound=true; path=/; max-age=7200; samesite=Lax";
                document.cookie = `avatar=${avatar}; path=/; max-age=7200; samesite=Lax`;
                document.cookie = `username=${username}; path=/; max-age=7200; samesite=Lax`;
                toast.success("Sesion iniciada correctamente")

                // go to mainmenu
                navigate("/");
            })
            .catch((error) => {
                console.error("Error al realizar la solicitud:", error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error("Error al realizar la solicitud:" + error.message);
                } else {
                    toast.error("Error al realizar la solicitud:" + error.response.data.error);
                }
            });
    };
    const words = "Inicie sesión o registrese para acceder"

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
                <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-2 text-center">
                        Welcome to The Quizz BDP
                    </h2>
                    <p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300 mb-4 text-center">
                        <TextGenerateEffect
                            words={words}
                            className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-2"
                        />
                    </p>
                    <form className="my-4" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-300 hover:bg-slate-950 dark:hover:bg-slate-100"
                                type="submit"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-950 px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black">
                                    Iniciar Sesión &rarr;
                                </span>
                            </button>
                        </div>
                        <div className="bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent my-4 h-[1px] w-full" />
                        <div className="text-center">
                            <button
                                className="text-sm mt-2 underline text-blue-500 hover:text-blue-700 focus:outline-none"
                                onClick={() => navigate("/signUp")}
                            >
                                ¿No tiene una cuenta? Registrese aquí!
                            </button>
                        </div>
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                        />
                    </form>
                </div>
            </motion.div>
        </AuroraBackground>

    );
}

export default LogIn;
