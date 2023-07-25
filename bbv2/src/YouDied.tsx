import { useEffect } from "react";
import anime from 'animejs/lib/anime.es.js'

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

    })
    //dark souls style, shoudl expand out
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

anime({
    targets: ".yd",
    scale: 1.3,
    duration: 2000,
    easing: 'linear'

})

export default YouDied;

//add in some horror sfx for phase 3?