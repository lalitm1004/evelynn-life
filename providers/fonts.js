import { Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";

const InterFont = Inter({
    subsets: ["latin",],
})

const Roboto100 = Roboto({
    weight: "100",
    subsets: ["latin",],
});

const Roboto400 = Roboto({
    weight: "400",
    subsets: ["latin",],  
});

const MesloLGS = localFont({
    src: "../public/fonts/MesloLGS-NF.ttf"
})

const Terminal = localFont({
    src: "../public/fonts/Terminal.ttf"
})

module.exports = {
    InterFont: InterFont,
    Roboto100: Roboto100,
    Roboto400: Roboto400,
    MesloLGS: MesloLGS,
    Terminal: Terminal
}