$(document).ajaxSend(function(event, jqXHR, ajaxOptions) {
    let keyValue = new Date().getTime()+'&'+userId
    // let keyValue="=pmatsemit".split("").reverse().join("")+new Date()["\u0067\u0065\u0074\u0054\u0069\u006d\u0065"]()
    let encryptedData = CryptoJS.AES.encrypt(keyValue, CryptoJS.enc.Utf8.parse((function(){let _0x578c5f="".split("").reverse().join("");let _0x2cbbb0="\u0031\u0032\u0033\u0038\u0065\u0034\u0062\u0063\u0033\u0030\u0063\u0032\u0034\u0037\u0066\u0065\u0039\u0038\u0037";let _0x85306e="\u0066\u0032\u0063\u0065\u0034\u0064\u0032\u0032\u0031\u0034\u0032\u0037";return _0x578c5f+_0x2cbbb0+_0x85306e+"\u0066";})()), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })

    let encryptedDataStr = encryptedData.toString();
    jqXHR.setRequestHeader('Encrypted-Data', encryptedDataStr)

    // jqXHR.setRequestHeader('Encrypted-Data', CryptoJS.MD5(keyValue).toString())
    // if (ajaxOptions.type == 'GET') {
    //     var params = ajaxOptions.url.split('?')[1]
    //     if (params) {
    //         var encryptedParams = CryptoJS.MD5(params).toString()
    //         jqXHR.setRequestHeader('Encrypted-Params', encryptedParams)
    //     }
    // } else if (ajaxOptions.type == 'POST') {
    //     console.log(ajaxOptions.data)
    //     var encryptedData = CryptoJS.MD5(ajaxOptions.data).toString()
    //     console.log(`md5=${encryptedData}`)
    //     jqXHR.setRequestHeader('Encrypted-Data', encryptedData)
    // }
});

