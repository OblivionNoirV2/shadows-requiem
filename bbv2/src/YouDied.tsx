import { useEffect } from "react";

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
    //dark souls style
    return (
        <h1 className="text-8xl justify-center items-center flex">
            YOU DIED
        </h1>
    )

}

export default YouDied;

//add in some horror sfx for phase 3?