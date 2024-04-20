import {
    json,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration, useLoaderData,
} from "@remix-run/react";
import stylesheet from "./globals.css?url";
import { ActionFunctionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import Navbar from "~/components/Navbar";
import { Toaster } from "react-hot-toast"
import { Provider } from 'react-redux';
import middleware from "~/services/middleware.server";
import { getUserAuthenticated, logOut } from "~/services/auth.server";
import store from "~/redux/store";
import User from "./controllers/User.server";
import { Progressbar } from "./components/Progressbar";
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
];

export async function action({ request }: ActionFunctionArgs) {
    const { action } = Object.fromEntries(await request.formData());
    if (action === "signout") {
        await logOut(request)
    }
    return null
}

export async function loader({ request }) {
    // await middleware(request)
    const user = await getUserAuthenticated(request)
    return json({
        newNotification: user ? await User.getNewNotification({ username: user.username }) : false,
        user,
        SITE_TITLE: process.env.SITE_TITLE,
        SITE_DESCRIPTION: process.env.SITE_DESCRIPTION
    });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{
        title: `${data.SITE_TITLE}`,
        description: data.SITE_DESCRIPTION
    }];
};

// export function ErrorBoundary() {
//     return (
//         <html>
//             <head>
//                 <title>الصفحة غير موجودة!</title>
//                 <Meta />
//                 <Links />
//             </head>
//             <body dir={"rtl"}>
//                 <section className="h-cover relative p-10 flex flex-col items-center gap-10 text-center">
//                     <img className={"select-none border-2 border-grey w-72 aspect-square object-cover rounded"} src="/images/404.png" />
//                     <h1 className="text-4xl leading-7 font-semibold">الصفحة غير موجودة</h1>
//                     <p className="text-dark-grey text-xl leading-7 mt-4">الصفحة التي تبحث عنها غير موجودة. يمكنك الذهاب إلى <Link to={"/"} className="text-black underline">الصفحة الرئيسية</Link></p>

//                     <div className="mt-auto">
//                         <Link to={"/"} className={"flex-none"}>
//                             <h1 className="font-bold text-2xl">موريشير</h1>
//                         </Link>
//                         <p className="mt-5 text-dark-grey">اقرأ الكثير من المحتوى العلمي الموريتاني 🇲🇷</p>
//                     </div>
//                 </section>
//                 <Scripts />
//             </body>
//         </html>
//     );
// }

export default function App() {
    let { user, newNotification } = useLoaderData()
    newNotification = newNotification.status === "success" ? true : false

    return (
        <html lang="ar">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body dir={"rtl"}>
                <Progressbar />
                <Provider store={store}>
                    <Toaster />
                    <Navbar newNotification={newNotification} user={user} />
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                </Provider>
            </body>
        </html>
    );
}