import React, { useRef, useState } from 'react';
import './avatar.css';

function AvatarList({ avatarMap, prop_avatar }) {
    const containerRef = useRef(null);
    const [showAvatars, setShowAvatars] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(prop_avatar);

    const handleImageClick = (avatar) => {
        setSelectedAvatar(avatar);
        setShowAvatars(false);
    };

    return (
        <div className="avatar-container" ref={containerRef}>
            {!showAvatars && <button
                style={{ backgroundImage: `url(${selectedAvatar})` }}
                onClick={() => setShowAvatars(!showAvatars)}
                className="avatar-button">
            </button>}
            {showAvatars && Object.values(avatarMap).map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="avatar-image"
                    onClick={() => handleImageClick(avatar)}
                />
            ))}
        </div>
    );
}

export default AvatarList;
