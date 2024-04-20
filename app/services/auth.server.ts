import db from "~/helpers/db";
import {redirect} from "@remix-run/node";
import {commitSession, destroySession, getSession} from "./session.server.js";
import {exclude} from "../helpers/Global.js";

export async function signIn(request: Request,{email}){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const user = await db.user.findUnique({where: {email}})
    const userWithoutPassword = exclude(user, ['password', "deletedAt"])
    session.set("user", userWithoutPassword);
    throw redirect("/", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function logOut(request: Request){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    throw redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
export async function isAuthenticated(request: Request){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    return session.has("user")
}

export async function getUserAuthenticated(request: Request){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    return session.get("user")
}