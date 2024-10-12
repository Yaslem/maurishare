export function NotAllowed({message}){
    return (
        <div
            className={"border p-4 shadow-inner flex-col max-w-fit mt-5 mx-auto rounded-lg border-black/10 flex items-center gap-4"}>
            <i className="fi fi-rr-ban text-red text-5xl"></i>
            <p className={"font-medium"}>{message}</p>
        </div>
    )
}