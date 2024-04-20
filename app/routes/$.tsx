import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader = () => {
    return json(null, { status: 404 });
};
export default function NotFound() {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-10 text-center">
            <img className={"select-none border-2 border-grey w-72 aspect-square object-cover rounded"} src="/images/404.png" />
            <h1 className="text-4xl leading-7 font-semibold">الصفحة غير موجودة</h1>
            <p className="text-dark-grey text-xl leading-7 mt-4">الصفحة التي تبحث عنها غير موجودة. يمكنك الذهاب إلى <Link to={"/"} className="text-black underline">الصفحة الرئيسية</Link></p>

            <div className="mt-auto">
                <Link to={"/"} className={"flex-none"}>
                    <h1 className="font-bold text-2xl">موريشير</h1>
                </Link>
                <p className="mt-5 text-dark-grey">اقرأ الكثير من المحتوى العلمي الموريتاني 🇲🇷</p>
            </div>
        </section>
    )
}