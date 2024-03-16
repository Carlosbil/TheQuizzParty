import ATGOLD from "./assets/images/achi/AtheneaGold.png"
import ATSILV from "./assets/images/achi/AtheneaSilver.png"
import ATBRON from "./assets/images/achi/AtheneaBronce.png"
import ZEGOLD from "./assets/images/achi/ZeusGold.png"
import ZESILV from "./assets/images/achi/ZeusSilver.png"
import ZEBRON from "./assets/images/achi/ZeusCober.png"
import HERBRO from "./assets/images/achi/HermesBronze.png"
import HERSIL from "./assets/images/achi/HermesSilver.png"
import HERGOL from "./assets/images/achi/HermesGold.png"

const achivMap = {
    "atgold": ATGOLD,
    "atsilv": ATSILV,
    "atbron": ATBRON,
    "zeusbron": ZEBRON,
    "zeussilv": ZESILV,
    "zeusgold": ZEGOLD,
    "hermesgold": HERGOL,
    "hermessilv": HERSIL,
    "hermesbron": HERBRO
}

export default function getArchi(name){
    return achivMap[name]
}