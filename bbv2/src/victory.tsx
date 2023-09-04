import { selected_difficulty } from "./StartMenu";
import { useContext, useEffect } from "react";
import victorybg from './assets/images/bg-and-effects/victorybg.png'
import { PrecipTypeContext } from "./Context";
import { seconds } from "./Timer";
import { Link } from "react-router-dom";

//cause: string. penalty: number
export const ScoreDeductionsMap: Map<string, number> = new Map(
    [
        ["death", 1000],
        ["turn", 15] //per turn

    ]
)
//difficulty also gets taken into account 
//to count occurences of each
//cause, count
export const Occurences: Map<string, number> = new Map
    (
        [
            ["death", 0],
            ["turn", 0]
        ]
    )
//take chosen difficulty into account
const DifficultyToScore: Map<string, number> = new Map(
    [
        ["very_easy", -2000],
        ["easy", -1000],
        ["normal", 0],
        ["hard", 1000],
        ["nightmare", 2000]

    ]
)
//will also add a timer
function CalculateScore() {
    const death_penalty = Occurences.get("death")! * ScoreDeductionsMap.get("death")!;

    const turn_penalty = Occurences.get("turn")! * ScoreDeductionsMap.get("turn")!;
    const time_penalty = seconds * 2;

    const pre_final = (10000 - (death_penalty + turn_penalty + time_penalty))

    //take difficulty into account 
    return pre_final + DifficultyToScore.get(selected_difficulty)!

}


const DifficultyToText: Map<string, string> = new Map(
    [   //idk why I didn't just write it like this in the first place 
        //but at this point I'm too afraid to touch it 
        ["very_easy", "Very Easy"],
        ["easy", "Easy"],
        ["normal", "Normal"],
        ["hard", "Hard"],
        ["nightmare", "Nightmare"]
    ]
)
const SecondsToMinutes = () => {

    const seconds_remainder = seconds % 60;
    const even_seconds = seconds - seconds_remainder;
    const minutes = (even_seconds / 60);
    const hours = (minutes / 60); //lol

    return (
        <div className="ml-3">
            <span>{String(hours).padStart(2, '0')}:</span>
            <span>{String(minutes).padStart(2, '0')}:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
        </div>
    )
};
const ReturnToTitle = () => {
    return (
        <button>
            <Link to="/StartMenu" >
                Return to Title
            </Link>
        </button>
    )
}
const VictoryScreen = () => {
    const { setPrecipType } = useContext(PrecipTypeContext)
    useEffect(() => {
        setPrecipType('confetti');
        const original_bg = document.body.style.backgroundImage;
        document.body.style.backgroundImage = `url(${victorybg})`
        return () => {
            document.body.style.backgroundImage = original_bg;
        };
    }, []);

    return (
        <main className="text-white flex flex-col items-center w-full">
            <h1 className="
            text-8xl mt-2 opacity-80 v-title ">
                ENEMY DEFEATED
            </h1>
            {/*score calc here. rainbow bg!*/}
            <section className="flex flex-col items-start w-1/4 results 
            text-4xl p-4 mt-12 rounded-xl" >
                <ul>
                    <div className="space-y-12">
                        <li>
                            Deaths: {Occurences.get("death")}
                        </li>

                        <li>
                            Turns taken: {Occurences.get("turn")}
                        </li>

                        <li className="flex">
                            Total Time: <SecondsToMinutes />
                        </li>

                        <li>
                            Difficulty Chosen: {DifficultyToText.get(selected_difficulty)}
                        </li>
                    </div>
                    <hr className="mt-8"></hr>

                    <li className="text-6xl mt-4">
                        Final Score: {CalculateScore()}
                    </li>
                </ul>
            </section>
            <section className="text-3xl hover:border-white hover:border-2 rounded-xl mt-4 p-4">
                <ReturnToTitle />
            </section>
        </main>
    )
};

export default VictoryScreen;