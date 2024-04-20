import UserAuthForm from "~/components/UserAuthForm";
import {ActionFunctionArgs, MetaFunction, redirect} from "@remix-run/node";
import {generatePageTitle} from "~/helpers/Global";
import {AuthServer} from "~/controllers/Auth.server";
import {json, useActionData, useNavigate} from "@remix-run/react";
import {toast} from "react-hot-toast";
import {useEffect} from "react";
import {isAuthenticated} from "~/services/auth.server";
import {DEFAULT_LOGIN_REDIRECT} from "~/services/routes.server";


export async function action({request}: ActionFunctionArgs) {
    const {name, email, password} = Object.fromEntries(await request.formData());
    return json(await AuthServer.signUp(name, email, password))
}

export async function loader({request}) {
    const isSignIn = await isAuthenticated(request)
    if(isSignIn) return redirect(DEFAULT_LOGIN_REDIRECT)
    return json({})
}

export const meta: MetaFunction = ({ matches }) => {
    return generatePageTitle({matches, current: "تسجيل حساب جديد 🔒"});
};
export default function SignUpPage() {
    return (
        <UserAuthForm type={"sign-up"} />
    )
}