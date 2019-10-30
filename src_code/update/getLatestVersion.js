function getVersion(versionUrl) {
    toastLog("检查更新中...");
    let getUpdateResponse = require("./getUpdateResponse.js");
    let response = getUpdateResponse(versionUrl);

    let code = null;
    let bodyJson = null;
    let version = null;
    if (response != null) {
        code = response.statusCode;
        bodyJson = response.body.json();
        version = bodyJson.versionCode;
    }
    return version;
}

module.exports = getVersion;