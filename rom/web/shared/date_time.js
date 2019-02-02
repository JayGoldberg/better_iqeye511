function isADate(field) {
    if (field.type != "text") return false;

    var exp = new RegExp("(\\d+)\\/(\\d+)\\/(\\d+)$$");
    var arr = field.value.match(exp);
    if (arr == null) return false;
    if ((arr[1] < 1) || (arr[1] > 12) || (arr[2] < 1) || (arr[2] > 31)) {
        return false;
    }
    return true;
}


function isATime(field) {
    if (field.type != "text") return false;
    var exp = new RegExp("(\\d+):(\\d+):(\\d+)$$");
    var arr = field.value.match(exp);
    if (arr == null) return false;
    if ((arr[1] < 0) || (arr[2] < 0) || (arr[3] < 0) ||
        (arr[1] > 24) || (arr[2] > 60) || (arr[3] > 60)) {
        return false;
    }
    return true;
}


function getDateString() {
    var now = new Date();
    var y = now.getYear();
    var d = now.getDate();
    var m = now.getMonth() + 1;
    if (y < 1000) y += 1900;
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return (m + "/" + d + "/" + y);
}


function setDefaultDate() {
    document.myform["OidTB2.19"].value = getDateString();
    setEcam(document.myform["OidTB2.19"]);
}


function getTimeString() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    return (h + ":" + m + ":" + s);
}


function setDefaultTime() {
    document.myform["OidTB2.18"].value = getTimeString();
    setEcam(document.myform["OidTB2.18"]);
}