const VictoryScreen = () => {
    return (
        <main>
            placeholder
        </main>
    )
};
//cause: string. penalty: number
export const ScoreDeductionsMap: Map<string, number> = new Map(
    [
        ["death", 1000],
        ["item", 40],
        ["heal", 20],
        ["turn", 15] //per turn

    ]
)
//to count occurences of each
//cause, count
export const occurences: Map<string, number> = new Map
    (
        [
            ["death", 0],
            ["item", 0],
            ["heal", 0],
            ["turn", 0]
        ]
    )

//This will have a global state, starts at 10k and goes down for 
//every death, heal/item use, and turn num
const ScoreCounter = () => {

}

export default VictoryScreen;