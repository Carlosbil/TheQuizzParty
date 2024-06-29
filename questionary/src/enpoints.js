
import io from "socket.io-client";

// local tests
const LOCAL = "http://192.168.1.96"
const PORT_LOCAL = "3001"
const BASE_URL = `${LOCAL}:${PORT_LOCAL}`;

// dockers
//const BASE_URL = "http://python_server:3001";


export const socket = io(`${BASE_URL}`);

export const QUESTIONS_URL = `${BASE_URL}/api/questions`;
export const TINKERS_URL = `${BASE_URL}/api/tinker`;
export const LOGIN_URL = `${BASE_URL}/api/logIn`;
export const SIGNUP_URL = `${BASE_URL}/api/createUser`;
export const TINKERS_SCORE_URL = `${BASE_URL}/api/tinkerScore`;
export const GET_TINKERS_SCORE_URL = `${BASE_URL}/api/getAllScores`;
export const UPDATE_PROFILE_URL = `${BASE_URL}/api/updateProfile`;
export const UPDATE_AVATAR_URL = `${BASE_URL}/api/updateAvatar`;
export const ADD_QUESTIONARY_URL = `${BASE_URL}/api/addQuestionary`;
export const JOIN_ROOM_URL = `${BASE_URL}/api/addRoyale`
export const SAVE_QUESTION_URL = `${BASE_URL}/api/saveQuestions`
export const GET_UNLOCKS = `${BASE_URL}/api/getUnlocks`
export const UNLOCK_ACHIEVEMENTS = `${BASE_URL}/api/unlockAchievements`
export const POST_PROFILE_URL = `${BASE_URL}/api/postProfile`;
export const POST_STATS_URL = `${BASE_URL}/api/userStats`
