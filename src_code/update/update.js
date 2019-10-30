function updateFun(latestUrl, currentVersionUrl, updateFileInfoList) {
    let getLatestVersion = require("./getLatestVersion.js");
    let getCurrentVersion = require("./getCurrentVersion.js");

    let latestVersion = getLatestVersion(latestUrl);
    console.log(latestVersion);

    if (latestVersion != null) {
        latestVersion = parseInt(latestVersion);
        let currentVersion = parseInt(getCurrentVersion(currentVersionUrl));

        console.log("latestVersion:" + latestVersion + "  currentVersion:" + currentVersion);

        if (latestVersion > currentVersion) {
            toastLog("发现新版本。当前版本版次：" + currentVersion + "，最新版次：" + latestVersion + "\n" +
                "开始请求最新脚本文件地址，请稍候");

            updateScripts(updateFileInfoList);
            updateVersionFile(currentVersionUrl, latestVersion);

        } else {
            toastLog("当前版本最新了，版次号：" + currentVersion);
        }
    }
}

let download = require("./downloadFile.js");

function updateScripts(list) {
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let url = item[0];
        let fileName = item[1];
        let possibleSize = 0;
        if (item.length > 2) possibleSize = parseInt(item[2]);

        download(url, fileName, possibleSize);
    }
}

function updateVersionFile(fileName, ver) {
    files.ensureDir(fileName);
    if (files.exists(fileName) === true) {
        let contain = "version\n" + ver;
        files.write(fileName, contain);
    }

}

function update(latestUrl, currentVersionUrl, updateFileInfoList) {
    threads.start(function () {
        updateFun(latestUrl, currentVersionUrl, updateFileInfoList);
    });
}

module.exports = update;