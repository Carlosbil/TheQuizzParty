import React, { useState } from 'react';
import './logIn.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL } from '../../enpoints';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../authSlide';

function LogIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const dispatch = useDispatch();
    const dis_token = useSelector((state) => state.auth.token); 
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
                // save the token
                dispatch(login(token, true));
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
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                </div>
            </b>
        </a>
    );
}

export default LogIn;
