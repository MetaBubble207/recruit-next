'use client'
import {FormEvent} from "react"

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(formData.get('email'), formData.get('password'));
        const response = await fetch(`/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            }),
        });
        console.log({response});
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md flex flex-col gap-2">
            <input name='email' className="border border-black text-black" type="email"/>
            <input name='password' className="border border-black text-black" type="password"/>
            <button type="submit">Resgiter</button>
        </form>
    )
}
