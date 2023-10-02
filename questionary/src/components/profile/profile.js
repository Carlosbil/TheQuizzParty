import React, { useEffect, useState } from 'react';
import './profile.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../homebotton/homebotton';
import { useNavigate } from 'react-router-dom';
import { PROFILE_URL } from '../../enpoints';

function Profile() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showProfile, setShowProfile] = useState(false)

    useEffect(() => {
        getUser();
    }, []);


    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    const getUser = () => {
        axios
            // cambiar el username bdp por el del ususario, habrá que investigar como mantenerlo en la sesion
            // en un futuro usar el JWT... 
            .get(PROFILE_URL, { params: { data: "bdp" } })
            .then((response) => {
                setUsername(decodeURIComponent(response.data.username));
                setEmail(decodeURIComponent(response.data.email));
                setName(decodeURIComponent(response.data.name));
                setPassword(decodeURIComponent(response.data.password));
                setShowProfile(true)
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

    function maskPassword(password) {
        return "*********";
    }

    return (
        <div>
            <div className="page">
                <Logo onClick={handleLogoClick} /> {/* Agregar el componente Logo aquí */}
                <div className="display_div">
                    <div className="log">Su perfil</div>

                    <div className="profile-group">
                        <div className="tittle_profile">Nombre:</div>
                        {showProfile && <div>{name}</div>}
                    </div>
                    <div className="profile-group">
                        <div className="tittle_profile">Username:</div>
                        {showProfile && <div>{username}</div>}
                    </div>
                    <div className="profile-group">
                        <div className="tittle_profile">Email:</div>
                        {showProfile && <div>{email}</div>}
                    </div>
                    <div className="profile-group">
                        <div className="tittle_profile">Contraseña:</div>
                        {showProfile && <div>{maskPassword(password)}</div>}
                    </div>
                </div>
                <button className='nextQuestion' onClick={() => getUser()}> Cargar perfil</button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default Profile;
