import React, { useRef, useState } from 'react';
import './avatar.css';
import { getCookieValue } from '../../../authSlide';
import { UPDATE_AVATAR_URL } from '../../../enpoints';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function AvatarList({ avatarMap, prop_avatar }) {
    const containerRef = useRef(null);
    const [showAvatars, setShowAvatars] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(prop_avatar);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [hasSelected, setHasSelected] = useState(false)

    const handleImageClick = (avatar, index) => {
        console.log(index)
        setSelectedAvatar(avatar);
        setShowAvatars(false);
        setSelectedIndex(index)
        setHasSelected(true)
    };

    const saveAvatar = (index) => {
        document.cookie = `avatar=avatar${index+1}; path=/; max-age=3600; samesite=Lax`;
        let data = {
            "token": getCookieValue("auth_token"),
            "image_path": `avatar${index+1}`,
        }
        axios
        .put(UPDATE_AVATAR_URL, data)
        .then(() => {
            toast.success("Se ha guardado su informacion")
            setHasSelected(false)
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

    return (
        <div className="avatar-container" ref={containerRef}>
            {!showAvatars ? <button
                style={{ backgroundImage: `url(${selectedAvatar})` }}
                onClick={() => setShowAvatars(!showAvatars)}
                className="avatar-button">
            </button> :
             Object.values(avatarMap).map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="avatar-image"
                    onClick={() => handleImageClick(avatar, index)}
                />
            ))}
            {hasSelected && !showAvatars && <button className='linked_avatar' onClick={() => saveAvatar(selectedIndex)}>{"Guardar"}</button>}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

        </div>
    );
}

export default AvatarList;
