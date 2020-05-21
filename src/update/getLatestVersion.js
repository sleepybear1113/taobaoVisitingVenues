function getResponse(versionUrl) {
    let response = null;
    console.log("获取新版本号地址：" + versionUrl);

    http.get(versionUrl, {}, function (res, err) {
        if (err) {
            console.error(err);
            return;
        }
        response = res;
    });


    let timeOutTimes = 100;
    for (let i = 0; i < timeOutTimes; i++) {
        if (response != null) {
            console.log("waiting time " + i * 100 + " ms");
            return response;
        }
        sleep(100);
    }
    toastLog("超时，无法获取更新信息（time out-" + timeOutTimes * 100 + "ms）");
    return null;
}


function getVersion(versionUrl) {
    toastLog("检查更新中...");
    let response = getResponse(versionUrl);
    if (response == null) {
        return null;
    }

    let json = response.body.json();
    console.log("latest version is " + JSON.stringify(json));
    return json;
}

module.exports = getVersion;