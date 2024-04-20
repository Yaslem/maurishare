import InputBox from "~/components/InputBox";
import {Link, useActionData, useNavigate, useSubmit} from "@remix-run/react";
import AnimationWrapper from "~/common/Animation";
import Validate from "~/helpers/Validate";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast"
import {action} from "~/routes/auth.signup";
const UserAuthForm = ({ type }) => {
    const submit = useSubmit();

    const navigate = useNavigate()
    const data = useActionData<typeof action>();
    useEffect(() => {
        if(data !== undefined){
            if(data.status === "error"){
                toast.error(data.message)
            } else {
                toast.success(data.message)
                setTimeout(() => {
                    navigate("/auth/signin")
                }, 1000)
            }
        }
    }, [data]);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handel = (e) => {
        e.preventDefault()
        if(type === "sign-in"){
            const validated = Validate.signIn.safeParse({email, password})
            if(validated.success){
                const formData = new FormData();
                formData.append("email", email);
                formData.append("password", password);
                submit(formData, { method: "post" });
            }else {
                const error = validated.error.format()
                if(error.email){
                    return toast.error(error.email._errors.join())
                }
                if(error.password){
                    return toast.error(error.password._errors.join())
                }
            }
        }else {
            const validated = Validate.signUp.safeParse({name, email, password})
            if(validated.success){
                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("password", password);
                submit(formData, { method: "post" });
            }else {
                const error = validated.error.format()
                if(error.name){
                   return toast.error(error.name._errors.join())
                }
                if(error.email){
                    return toast.error(error.email._errors.join())
                }
                if(error.password){
                    return toast.error(error.password._errors.join())
                }
            }
        }

    }
    return (
        <AnimationWrapper keyValue={type}>
            <section className={"h-cover flex items-center justify-center"}>
                <form onSubmit={handel} className={"w-[80%] max-w-[400px]"}>
                    <h1 className={"text-4xl font-bold text-center mb-12"}>{type === "sign-in" ? "مرحبا بعودتك" : "انضم لنا اليوم"}</h1>
                    {
                        type !== "sign-in"
                            ? <InputBox onChange={(e) => setName(e.target.value)}
                                        icon={"fi-rr-user"}
                                        value={name}
                                        type={"text"}
                                        name={"name"}
                                        placeholder={"الاسم الكامل"}/>
                            : null
                    }
                    <InputBox onChange={(e) => setEmail(e.target.value)}
                              icon={"fi-rr-envelope"}
                              value={email}
                              type={"email"}
                              name={"email"}
                              placeholder={"البريد الإلكتروني"}/>
                    <InputBox onChange={(e) => setPassword(e.target.value)}
                              icon={"fi-rr-key"}
                              value={password}
                              type={"password"}
                              name={"password"}
                              placeholder={"كلمة المرور"}/>
                    <button type={"submit"} className={"btn-dark center mt-14"}>{type === "sign-in" ? "تسجيل الدخول" : "تسجيل حساب جديد"}</button>
                    {
                        type === "sign-in"
                            ? <p className={"mt-6 text-dark-grey text-xl text-center"}>
                                ليس لديك حساب ؟
                                <Link to={"/auth/signup"} className={"underline text-black text-xl mr-1"}>انضم إلينا الآن.</Link>
                            </p>
                            : <p className={"mt-6 text-dark-grey text-xl text-center"}>
                                لديك حساب ؟
                                <Link to={"/auth/signin"} className={"underline text-black text-xl mr-1"}>سجل الدخول من
                                    هنا.</Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    )
}
export default UserAuthForm