import React, { useState } from 'react';
import './signUp.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_URL } from '../../enpoints';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
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
            .post(SIGNUP_URL, formData)
            .then((_) => {
                navigate("/")
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
        <div className="container">
            <h2>Por favor introduce tus datos</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                />
                <input

                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
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
                    Register
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default SignUp;
