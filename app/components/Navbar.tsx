import {Link, useNavigate, useParams} from "@remix-run/react";
import {useEffect, useState} from "react";
import NavigationPanel from "~/components/NavigationPanel";
import {useDispatch} from "react-redux";
import {userActions} from "~/redux/slices/userSlice";
const Navbar = ({user, newNotification}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        dispatch(userActions.setUser(user))
    }, [user]);

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)

    const handelSearch = (e) => {
        const value = e.target.value
        if(e.keyCode === 13 && value.length){
            navigate(`/search/${value}`)
        }
    }

    return (
        <nav className={"navbar z-50"}>
            <Link to={"/"} className={"flex-none"}>
                <img className="max-sm:w-[100px] w-[180px] h-auto" src="/images/logo.png" />
                {/* <h1 className="font-bold text-2xl">موريشير</h1> */}
            </Link>

            <div className={"absolute w-full bg-white right-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                <i className="fi fi-rr-search absolute left-[10%] md:pointer-events-none md:right-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                <input defaultValue={params.value} onKeyDown={handelSearch} type={"text"} placeholder={"بحث"} className={"w-full md:w-auto bg-grey p-4 pr-6 pl-[12%] md:pl-6 rounded-full placeholder:text-dark-grey md:pr-12"}/>
            </div>

            <div className={"flex items-center gap-3 md:gap-6 mr-auto"}>
                <button
                    onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
                    className={"md:hidden flex items-center justify-center bg-grey w-12 h-12 rounded-full"}>
                    <i className="fi fi-rr-search text-xl"></i>
                </button>
            </div>

            <Link to={"/post/create"} className={"hidden md:flex gap-2 link"}>
                <i className="fi fi-rr-edit"></i>
                <p>اكتب</p>
            </Link>
            <Link to={"mailto:contact@maurishare.com"} className={"max-sm:w-12 max-sm:h-12 flex items-center justify-center rounded-full bg-grey relative hover:bg-black/10 md:flex gap-2 link"}>
                <i className="fi fi-rr-envelope"></i>
                <p className="hidden md:block">تواصل معنا</p>
            </Link>
            {
                user
                    ? <>
                        <Link to={"/dashboard/notifications"}
                              className={"w-12 h-12 flex items-center justify-center rounded-full bg-grey relative hover:bg-black/10"}>
                            <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                            {
                                newNotification
                                    ? <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 left-2" />
                                    : null
                            }
                        </Link>
                        <div className={"relative"} onClick={() => setUserNavPanel(!userNavPanel)} onBlur={() => {
                            setTimeout(() => {
                                setUserNavPanel(false)
                            }, 200)
                        }}>
                            <button className={"w-12 h-12 mt-1"}>
                                <img alt={"صورة شخصية"} src={`/uploads/${user.photo}`} className={"w-full h-full object-cover rounded-full"}/>
                            </button>
                            {
                                userNavPanel
                                    ? <NavigationPanel />
                                    : null
                            }
                        </div>
                    </>
                    : <>
                        <Link to={"/auth/signin"} className={"btn-dark py-2"}>تسجيل الدخول</Link>
                        <Link to={"/auth/signup"} className={"btn-light py-2 hidden md:block"}>حساب جديد</Link>
                    </>
            }

        </nav>
    )
}
export default Navbar