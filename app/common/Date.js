import HijrahDate from "hijrah-date"
let months = ["محرم", "صفر", "ربيع الأول", "رببع الثاني", "جمادى الأولى", "جمادى الأخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"]
let days = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
export default function getDay(date) {
    var hijrahDate = new HijrahDate(date);
    return `${hijrahDate._dayOfMonth} ${months[hijrahDate._monthOfYear - 1]}`;
}

export function getFullDay(date) {
    var hijrahDate = new HijrahDate(date);
    return `${hijrahDate._dayOfMonth} ${months[hijrahDate._monthOfYear - 1]} ${hijrahDate._year}`;
}