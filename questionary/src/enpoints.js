
import io from "socket.io-client";

const BASE_URL = "http://192.168.1.61:3001";


export const socket = io(`${BASE_URL}`);

export const QUESTIONS_URL = `${BASE_URL}/api/questions`;
export const TINKERS_URL = `${BASE_URL}/api/tinker`;
export const PROFILE_URL = `${BASE_URL}/api/profile`;
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