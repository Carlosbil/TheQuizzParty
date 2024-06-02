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

                <div className="page">
                    <Logo onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} />
                    <AvatarList avatarMap={getAllAvatars()} prop_avatar={getAvatar(avatar)} />
                    <div className="display_div">
                        {isEditing ? (
                            <div className="container">
                                <h2>Por favor introduzca sus datos</h2>
                                <form onSubmit={handleFormSubmit}>
                                    <div>
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder={name}
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder={username}
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={email}
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input"
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

                                    <button type="submit" className="button_profile">
                                        Guardar
                                    </button>
                                    <button className="button_profile" onClick={toggleEdit}>
                                        Cancelar
                                    </button>
                                </form>
                                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                            </div>
                        ) : (
                            <>
                                <div className="log">Su perfil</div>
                                <div className="profile-group"><div className="tittle_profile">Nombre:</div>{showProfile && <div>{name}</div>}</div>
                                <div className="profile-group"><div className="tittle_profile">Username:</div>{showProfile && <div>{username}</div>}</div>
                                <div className="profile-group"><div className="tittle_profile">Email:</div>{showProfile && <div>{email}</div>}</div>
                                <div className="profile-group"><div className="tittle_profile">Contraseña:</div>{showProfile && <div>{maskPassword()}</div>}</div>
                                <button className="button_profile" onClick={toggleEdit}>Editar</button>
                            </>
                        )}
                    </div>
                    <Unlockables />
                </div>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </div>
        </div>
    );
}

export default Profile;
