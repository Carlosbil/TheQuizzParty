import { Howl } from 'howler';
import correct_sound from './assets/sounds/correct_answer.wav'
import wrong_sound from './assets/sounds/bad_answer.wav'
import clock_end from './assets/sounds/clock_ending.wav'

const good_sound = new Howl({
    src: [correct_sound] // NOTA: Es solo para demostración. Asegúrate de reemplazarlo con tu propio sonido o uno con licencia adecuada.
  });

const bad_sound = new Howl({
    src: [wrong_sound] // NOTA: Es solo para demostración. Asegúrate de reemplazarlo con tu propio sonido o uno con licencia adecuada.
});

const clock_ending = new Howl({
    src: [clock_end] // NOTA: Es solo para demostración. Asegúrate de reemplazarlo con tu propio sonido o uno con licencia adecuada.
})

// Mapeo entre nombres de sonidos y objetos Howl
const soundsMap = {
    'good_sound': good_sound,
    'bad_sound': bad_sound,
    'clock_ending': clock_ending
};

export function playSoundByName(soundName) {
    if (soundsMap[soundName]) {
        soundsMap[soundName].play();
    } else {
        console.error(`Sound "${soundName}" not found.`);
    }
}
