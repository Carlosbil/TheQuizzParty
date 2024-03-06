import AVATAR_1 from "./assets/images/avatars/simple_avatar.png";
import AVATAR_2 from "./assets/images/avatars/simple_drake.png";
import AVATAR_3 from "./assets/images/avatars/simple_gamer.png";
import AVATAR_4 from "./assets/images/avatars/realistic_person1.png";
import AVATAR_5 from "./assets/images/avatars/realistic_person2.png";
import AVATAR_6 from "./assets/images/avatars/realistic_person3.png";
import AVATAR_7 from "./assets/images/avatars/realistic_person4.png";
import AVATAR_8 from "./assets/images/avatars/cyberpunk_person1.png";
import AVATAR_9 from "./assets/images/avatars/cyberpunk_person2.png";





const avatarMap = {
    "avatar1" : AVATAR_1,
    "avatar2" : AVATAR_2,
    "avatar3" : AVATAR_3,
    "avatar4" : AVATAR_4,
    "avatar5" : AVATAR_5,
    "avatar6" : AVATAR_6,
    "avatar7" : AVATAR_7,
    "avatar8" : AVATAR_8,
    "avatar9" : AVATAR_9
};

export default function getAvatar(name) {
    return avatarMap[name]
}

export function getAllAvatars(){
    return avatarMap
}