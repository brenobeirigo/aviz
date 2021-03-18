function secondsBetweenDateTimes(earliest, latest) {
    if (earliest === null || latest === null)
        return null;
    return parseInt((Date.parse(latest) - Date.parse(earliest)) / 1000);
}

function getDateTimeStringFromDateTime(dateTime) {
    return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
}
function getDateTimeStringFromMillis(dateTimeMillis) {
    var dateTime = new Date(dateTimeMillis);
    return getDateTimeStringFromDateTime(dateTime);
}