import React, { useState } from 'react';
function HandleAccountSubmission() {

}
const CreateAccount = () => {
    const [isRequirementsMet, setIsRequirementsMet] = useState(false);
    return (
        <main className="w-1/3 flex justify-center mx-auto my-48
          text-3xl">
            <form className="signup-form flex flex-col w-1/3">
                <label htmlFor="username" className="text-slate-300">Username</label>
                <input type="text" id="username" name="username" />
                <label htmlFor="password" className="text-slate-300">Password</label>
                <input type="text" id="password" name="password" />
                <label htmlFor="email" className="text-slate-300">Email</label>
                <input type="text" id="email" name="email" />
                <button className='bg-[#363040]/60 
       py-4 px-2 rounded-2xl text-5xl text-slate-300 mt-10 glow-ani-border'>Create Account</button>
            </form>
        </main>
    )

}

export default CreateAccount;