import ATGOLD from "./assets/images/AtheneaGold.png"
import ATSILV from "./assets/images/AtheneaSilver.png"
import ATBRON from "./assets/images/AtheneaBronce.png"

const achivMap = {
    "atgold": ATGOLD,
    "atsilv": ATSILV,
    "atbron": ATBRON
}

export default function getArchi(name){
    return achivMap[name]
}