import React, { useEffect, useState } from 'react';
import './profile.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../homebotton/homebotton';
import { useNavigate } from 'react-router-dom';
import { PROFILE_URL, UPDATE_PROFILE_URL } from '../../enpoints';
import { getCookieValue } from '../../authSlide';

function Profile() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        token: '',
        name: '',
        username: '',
        email: '',
        password: '',
    });
    
    //handle the changes produced in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    //save user information
    const handleSubmit = (e) => {
        e.preventDefault();

        let data = {
            "token": getCookieValue("auth_token"),
            "name": formData.name !== ''? formData.name : name,
            "email": formData.email !== ''? formData.email : email,
            "username": formData.username !== ''? formData.username : username,
            "password": formData.password !== ''? formData.password : password
        }
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
                console.error('Error al realizar la solicitud:', error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error('Error al realizar la solicitud:' + error.message);
                } else {
                    toast.error('Error al realizar la solicitud:' + error.response.data.error);
                }
            });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };
    
    // obtain the user information when the user open this component
    useEffect(() => {
        getUser();
    }, []);

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    const getUser = () => {
        axios
            .get(PROFILE_URL, { params: { data: getCookieValue("auth_token") } })
            .then((response) => {
                setUsername(decodeURIComponent(response.data.username));
                setEmail(decodeURIComponent(response.data.email));
                setName(decodeURIComponent(response.data.name));
                setPassword(decodeURIComponent(response.data.password));
                setShowProfile(true);
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud:', error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error('Error al realizar la solicitud:' + error.message);
                } else {
                    toast.error('Error al realizar la solicitud:' + error.response.data.error);
                }
            });
    }

    function maskPassword() {
        return "*********";
    }

    return (
        <div className='back'>
            <div className="page">
                <Logo onClick={handleLogoClick} />
                <div className="display_div">
                    {!isEditing
                        && <div className="log">Su perfil</div>}

                    {!isEditing
                        && <div className="profile-group">
                            <div className="tittle_profile">Nombre:</div>
                            {showProfile && <div>{name}</div>}
                        </div>}
                    {!isEditing
                        && <div className="profile-group">
                            <div className="tittle_profile">Username:</div>
                            {showProfile && <div>{username}</div>}
                        </div>}
                    {!isEditing
                        && <div className="profile-group">
                            <div className="tittle_profile">Email:</div>
                            {showProfile && <div>{email}</div>}
                        </div>}
                    {!isEditing
                        && <div className="profile-group">
                            <div className="tittle_profile">Contraseña:</div>
                            {showProfile && <div>{maskPassword()}</div>}
                        </div>}
                    {isEditing && (
                        <div className="container">
                            <h2>Por favor introduzca sus datos</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={name}
                                    value={formData.name}
                                    onChange={handleChange}
                                    defaultValue={name}
                                    className="input"
                                />
                                <input

                                    type="text"
                                    name="username"
                                    placeholder={username}
                                    value={formData.username}
                                    defaultValue={username}
                                    onChange={handleChange}
                                    className="input"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={email}
                                    value={formData.email}
                                    defaultValue={email}
                                    onChange={handleChange}
                                    className="input"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={password}
                                    value={formData.password}
                                    onChange={handleChange}
                                    defaultValue={password}
                                    className="input"
                                />
                                <button type="submit" className="button">
                                    Guardar
                                </button>
                                <button className="button_profile" onClick={handleEditClick}>
                                    Cancelar
                                </button>
                            </form>
                            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                        </div>
                    )}
                    {!isEditing &&
                    <button className="button_profile" onClick={handleEditClick}> Editar</button>}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default Profile;
