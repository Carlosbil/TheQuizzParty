import React, { useState } from "react";
import "./profile.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../homebotton/homebotton";
import { useNavigate } from "react-router-dom";
import { POST_PROFILE_URL, UPDATE_PROFILE_URL } from "../../enpoints";
import { getCookieValue } from "../../authSlide";
import getAvatar, { getAllAvatars } from "../../avatars";
import AvatarList from "./avatar/avatar";
import Unlockables from "./unlockables/unlockables";
import Label from "../logIn/label";
import Input from "../logIn/input";

function Profile() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const avatar = getCookieValue("avatar")
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        token: "",
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const stars = Array.from({ length: 100 }, (_, index) => index);
    //handle the changes produced in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "password") {
            setChangePass(true)
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDisconect = () => {
        document.cookie = "isAuthenticated=true; path=/; max-age=7200; samesite=Lax";
        document.cookie = `auth_token=1; path=/; max-age=7200; samesite=Lax`;
        navigate("/login");
    }
    //save user information
    const handleSubmit = (e) => {
        e.preventDefault();
        if (changePass) {
            let data = {
                "token": getCookieValue("auth_token"),
                "name": formData.name !== "" ? formData.name : name,
                "email": formData.email !== "" ? formData.email : email,
                "username": formData.username !== "" ? formData.username : username,
                "password": formData.password !== "" ? formData.password : password
            }
            callUpdate(data)

        } else {
            let data = {
                "token": getCookieValue("auth_token"),
                "name": formData.name !== "" ? formData.name : name,
                "email": formData.email !== "" ? formData.email : email,
                "username": formData.username !== "" ? formData.username : username,
            }
            callUpdate(data)
        }
    };

    function callUpdate(data) {
        console.log(data)
        axios
            .put(UPDATE_PROFILE_URL, data)
            .then((response) => {
                setUsername(decodeURIComponent(response.data.username));
                setEmail(decodeURIComponent(response.data.email));
                setName(decodeURIComponent(response.data.name));
                setPassword(decodeURIComponent(response.data.password));
                setShowProfile(true);
                setIsEditing(false)
                toast.done("Información Guardada")
            })
            .catch((error) => {
                console.error("Error al realizar la solicitud:", error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error("Error al realizar la solicitud:" + error.message);
                } else {
                    toast.error("Error al realizar la solicitud:" + error.response.data.error);
                }
            });
    }
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    const postUser = () => {
        let token = getCookieValue("auth_token")
        let formData = {
            "token": token,
        }
        axios
            .post(POST_PROFILE_URL, formData)
            .then((response) => {
                setUsername(decodeURIComponent(response.data.username));
                setEmail(decodeURIComponent(response.data.email));
                setName(decodeURIComponent(response.data.name));
                setPassword(decodeURIComponent(response.data.password));
                setShowProfile(true);
                toast.success("Se ha obtenido su informacion")
            })
            .catch((error) => {
                console.error("Error al realizar la solicitud:", error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error("Error al realizar la solicitud:" + error.message);
                } else {
                    toast.error("Error al realizar la solicitud:" + error.response.data.error);
                }
            });
    }

    function maskPassword() {
        return "*********";
    }


    // IIFE 
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        postUser();
        setDataLoaded(true);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e); // Pasamos el evento a handleSubmit
    };

    const toggleEdit = () => {
        handleEditClick();
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="star-background">
                {stars.map((_, index) => (
                    <div
                        key={index}
                        className="star"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 3 + 1}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}

                <div className="mt-20 w-[80%] mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-none dark:bg-none flex flex-col items-center justify-center">
                    <Logo onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} />
                    <AvatarList avatarMap={getAllAvatars()} prop_avatar={getAvatar(avatar)} />
                    <div className="w-[100%]">
                        {isEditing ? (
                            <div className="w-[100%] mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-2 text-center">
                                    Cambie los datos de su perfil
                                </h2>
                                <form className="my-4" onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder={name}
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            placeholder={username}
                                            type="text"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder={email}
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Password:</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder={"*******"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="input"
                                        />
                                    </div>

                                    <button type="button" className="nextQuestion" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>

                                    <div className="relative top-5 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] flex justify-center space-x-4 mb-10">
                                        <button
                                            className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-300 hover:bg-slate-950 dark:hover:bg-slate-100"
                                            type="submit"
                                        >
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black">
                                                Guardar &uarr;
                                            </span>
                                        </button>
                                        <button
                                            className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-300 hover:bg-slate-950 dark:hover:bg-slate-100"
                                            onClick={toggleEdit}
                                        >
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black">
                                                Cancelar
                                            </span>
                                        </button>
                                    </div>
                                </form>
                                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                            </div>
                        ) : (
                            <div className="w-[100%] mx-auto">
                                <div className="mb-4 flex flex-col">
                                    <div className="text-lg text-white font-semibold">Nombre:</div>
                                    {showProfile && <div className="text-base text-gray-200">{name}</div>}
                                </div>
                                <div className="bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent my-4 h-[1px] w-full" />

                                <div className="mb-4 flex flex-col">
                                    <div className="text-lg text-white font-semibold">Username:</div>
                                    {showProfile && <div className="text-base text-gray-200">{username}</div>}
                                </div>
                                <div className="bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent my-4 h-[1px] w-full" />
                                <div className="mb-4 flex flex-col">
                                    <div className="text-lg text-white font-semibold">Email:</div>
                                    {showProfile && <div className="text-base text-gray-200">{email}</div>}
                                </div>
                                <div className="bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent my-4 h-[1px] w-full" />
                                <div className="mb-4 flex flex-col">
                                    <div className="text-lg text-white font-semibold">Contraseña:</div>
                                    {showProfile && <div className="text-base text-gray-200">{maskPassword()}</div>}
                                </div>
                                <div className="bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent my-4 h-[1px] w-full" />
                                <div className="relative top-5 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] flex justify-center space-x-4 mb-10">
                                    <button
                                        className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-300 hover:bg-slate-950 dark:hover:bg-slate-100"
                                        onClick={handleEditClick}
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black">
                                            Editar Perfil &rarr;
                                        </span>
                                    </button>
                                    <button
                                        className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 transition-all duration-300 hover:bg-slate-950 dark:hover:bg-slate-100"
                                        onClick={handleDisconect}
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-3xl transition-all duration-300 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-100 dark:hover:text-black">
                                            Desconectarse &larr;
                                        </span>
                                    </button>
                                </div>
                                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                            </div>
                        )}
                    </div>
                    <Unlockables />
                </div>
            </div>
        </div>
    );
}

export default Profile;
