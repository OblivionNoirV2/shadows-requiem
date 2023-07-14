
import React from 'react';
import { Link } from 'react-router-dom';
const BackButton = () => {
    return (
        <button className='text-3xl s-back-btn text-slate-300 mt-4 ml-4'>
            <Link to='/' className='story-back'>Back to start</Link>
        </button>
    )

}
export const Story = () => {
    //looks like it's on a stone tablet
    return (
        <>
            <div>
                <BackButton />
            </div>
            <main className="text-container justify-center flex mx-auto 
        max-w-lg text-slate-300 leading-loose text-3xl mt-[28rem] max-h-[50rem]
        rounded-tr-xl rounded-tl-xl ">
                <div className="px-8 pt-16 z-30">
                    Here lies a king who refuses to pass from this realm.
                    Many have tried and failed to calm this raging spirit, and he
                    leaves none behind who disturb his slumber. This king is said
                    to be a creature of shadow, not of light or any essence of humanity.
                    It cannot be killed with any human manner of combat. You may attempt, to protect this world, but he will only rise again...

                </div>

            </main>
        </>
    )


}

export default Story;
