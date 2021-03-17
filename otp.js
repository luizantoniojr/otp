var dec2hex = function (s) {
    return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
};

var hex2dec = function (s) {
    return parseInt(s, 16);
};

var leftpad = function (s, l, p) {
    if (l + 1 >= s.length) {
        s = Array(l + 1 - s.length).join(p) + s;
    }
    return s;
};

var base32tohex = function (base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";

    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }

    for (var i = 0; i + 4 <= bits.length; i += 4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
    }

    return hex;
};

var getTOTP = function (secret, period, length, algorithm) {

    var epoch = Math.round(new Date().getTime() / 1000.0);
    var counter = leftpad(dec2hex(Math.floor(epoch / period)), 16, "0");

    return getHOTP(secret, counter, period, length, algorithm);
};

var getHOTP = function (secret, counter, period, length, algorithm) {
    
    var hmacObj = new jsSHA(counter, "HEX");

    var hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", algorithm, "HEX");
    var offset = hex2dec(hmac.substring(hmac.length - 1));
    var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";

    return (otp).substr(otp.length - length, length);
};

window.onload = () => {
  var otp = getTOTP("UIW6LVA2ABMN37S3KDHZFS7TM4RMIFIW", 30, 6, "SHA-1");
  alert(otp)
}
