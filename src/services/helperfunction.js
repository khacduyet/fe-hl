
export function DateToUnix(date) {
    // + 25200
    return date ? ((new Date(date).getTime() / 1000)) : null
}
export function UnixToDate(dateunix) {
    return dateunix ? (new Date(dateunix * 1000)) : null
}
export function DateStringToDate(datestring) {
    return datestring ? (new Date(new Date(datestring).getTime() + (7 * 60 * 60 * 1000))) : null
}
export function DateStringToDateGMT(datestring) {
    return datestring ? (new Date(new Date(datestring).getTime())) : null
}
export function formatDateString(datestring) {
    const day = (new Date(new Date(datestring).getTime() + (7 * 60 * 60 * 1000)));
    const yyyy = day.getFullYear();
    let mm = day.getMonth() + 1; // Months start at 0!
    let dd = day.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return datestring ? (dd + "/" + mm + "/" + yyyy) : '';
}
export function formatDateStringGMT(datestring) {
    const day = (new Date(new Date(datestring).getTime()));
    const yyyy = day.getFullYear();
    let mm = day.getMonth() + 1; // Months start at 0!
    let dd = day.getDate();
    let hour = day.getHours();
    let minute = day.getMinutes();
    let second = day.getSeconds();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return datestring ? (hour + ":" + minute + ":" + second + " " + dd + "/" + mm + "/" + yyyy) : '';
}
export function validForm(arrVar, obj) {
    if (obj) {
        for (let key of arrVar) {
            if (!obj[key] || obj[key] === '') {
                return false
            }
        }
    } else {
        return false
    }
    return true
}
export function deepCopy(object) {
    return JSON.parse(JSON.stringify(object))
}
export function dayofweektodate(week, firstdayofyear, dayofweek) {
    let current = new Date(firstdayofyear);
    let datefirst = firstdayofyear.getDay();
    let dateadd = dayofweek - datefirst;
    dateadd = dateadd >= 0 ? dateadd : 7 + dateadd;
    current.setDate(current.getDate() + (week - 1) * 7 + (dateadd));
    return current;
}
export function range(start, end) {
    let nums = [];
    for (let i = start; i < end; i++) nums.push(i);
    return nums;
}