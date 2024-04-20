import UserAuthForm from "~/components/UserAuthForm";
import {ActionFunctionArgs, MetaFunction, redirect} from "@remix-run/node";
import {json} from "@remix-run/react";
import {AuthServer} from "~/controllers/Auth.server";
import {generatePageTitle} from "~/helpers/Global";
import {isAuthenticated} from "~/services/auth.server";
import {DEFAULT_LOGIN_REDIRECT} from "~/services/routes.server";

export async function action({request}: ActionFunctionArgs) {
    const isSignIn = await isAuthenticated(request)
    if(isSignIn) throw redirect(DEFAULT_LOGIN_REDIRECT)
    const {email, password} = Object.fromEntries(await request.formData());
    return json(await AuthServer.signIn(request, email, password))
}

export async function loader({request}) {
    const isSignIn = await isAuthenticated(request)
    if(isSignIn) return redirect(DEFAULT_LOGIN_REDIRECT)
    return json({})
}

export const meta: MetaFunction = ({ matches }) => {
    return generatePageTitle({matches, current: "تسجيل الدخول 🔒"});
};
export default function SignInPage() {
    return (
        <UserAuthForm type={"sign-in"} />
    )
}