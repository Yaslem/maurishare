import { Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import SideNav from "../components/SideNav";
import User from "../controllers/User.server"
import { isAuthenticated } from "../services/auth.server";
import { getUserAuthenticated } from "../services/auth.server";

export async function loader({ request, params }) {
    const isSignIn = await isAuthenticated(request)
    const user = await getUserAuthenticated(request)

    if (!isSignIn) {
        return redirect("/auth/signin")
    }
    return json({
        newNotification: user ? await User.getNewNotification({username: user.username}) : false,
    });
}
export default function Dashboard() {
    let {newNotification} = useLoaderData()
    newNotification = newNotification.status === "success" ? true : false
    return (
        <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
            <SideNav newNotification={newNotification} />
            <div className="max-md:-mt-8 mt-5 w-full">
                <Outlet />
            </div>
        </section>
    )
}