import HijrahDate from "hijrah-date"
let monthsH = ["محرم", "صفر", "ربيع الأول", "رببع الثاني", "جمادى الأولى", "جمادى الأخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"]
let months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
let days = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
export default function getDay(date) {
    // var hijrahDate = new HijrahDate(date);
    const d = new Date(date)
    // console.log(d.getDay())
    return `${d.getDate()} ${months[(d.getMonth())]}`;
}

export function getFullDay(date) {
    // var hijrahDate = new HijrahDate(date);
    const d = new Date(date)
    // return `${hijrahDate._dayOfMonth} ${months[hijrahDate._monthOfYear - 1]} ${hijrahDate._year}`;
    console.log(d.getMonth())
    return `${d.getDate()} ${months[(d.getMonth())]} ${d.getFullYear()}`
}