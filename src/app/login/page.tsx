export default function LoginPage(){
    return (
        <form className="mx-auto mt-10 max-w-md flex flex-col gap-2">
            <input name='email' className ="border border-black text-black" type="email" />
            <input name='password' className ="border border-black text-black" type="password" />
            <button type="submit">Login</button>
        </form>
    )
}
