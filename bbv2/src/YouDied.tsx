import { useEffect } from "react";
import anime from 'animejs/lib/anime.es.js'

const BackToTitle = () => {
    //put an arrow next to it
    return (
        <h1 className="text-red-900">Back to Title</h1>
    )
}
const YouDied = () => {
    useEffect(() => {
        //change to black
        const original_bg = document.body.style.backgroundImage;
        document.body.style.backgroundImage = "none"
        document.body.style.backgroundColor = "rgb(0, 0, 0)";

        return () => {
            document.body.style.backgroundImage = original_bg;
        };
    }, []);
    useEffect(() => {
        const targets = ".yd"
        anime({
            targets: targets,
            scale: 1.3,
            duration: 2000,
            easing: 'linear'

        })
        return () => {
            anime.remove(targets)
        }

    }, [])
    //dark souls style
    return (
        <main className="justify-center items-center
            flex h-screen">
            <h1 className="text-[12rem] text-red-900 yd ">
                YOU DIED
            </h1>
            <script src="anime.min.js"></script>
        </main>
    )

}

export default YouDied;

//add in some horror sfx for phase 3?