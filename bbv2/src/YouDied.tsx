import { useEffect } from "react";
import { playClickSfx } from "./sfxManagement";
import anime from 'animejs/lib/anime.es.js'
import { Link } from "react-router-dom";

const BackToTitle = () => {
    //put an arrow next to it
    return (
        <button onClick={playClickSfx}>
            <Link to="/StartMenu">
                <h1 className="text-red-900 text-4xl mt-4">
                    <span>&#8656;</span>Back to Title
                </h1>
            </Link>
        </button>
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
        <main className="overflow-y-hidden">
            <BackToTitle />
            <section className="justify-center items-center
            flex h-screen overflow-y-hidden">

                <h1 className="text-[12rem] text-red-900 yd ">
                    YOU DIED
                </h1>
                <script src="anime.min.js"></script>
            </section>
        </main>
    )
}

export default YouDied;

//add in some horror sfx for phase 3?