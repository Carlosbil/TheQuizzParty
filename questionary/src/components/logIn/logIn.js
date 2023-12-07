import React, { useState } from 'react';
import './logIn.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from '../../enpoints';


function LogIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
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
                console.error('Error al realizar la solicitud:', error);
                if (error.response === undefined || error.response.data.error === undefined) {
                    toast.error('Error al realizar la solicitud:' + error.message);
                } else {
                    toast.error('Error al realizar la solicitud:' + error.response.data.error);
                }
            });
    };


    return (
        <a className='back'>
            <b className='page'>
                <div className="container">
                    <h2>Por favor introduce tus datos</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                        />
                        <button type="submit" className="button" link="/">
                            Iniciar Sesión
                        </button>
                    </form>
                    <button className="linked" onClick={() => navigate('/signUp')}>¿No tiene una cuenta? Registrese aquí!</button>
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                </div>
            </b>
        </a>
    );
}

export default LogIn;
