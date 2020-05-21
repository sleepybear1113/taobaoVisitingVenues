function update(onlineUrl, path, versionFileName) {
    let getLatest = require("./getLatestVersion.js");
    let getCurrent = require("./getCurrentVersion.js");
    let download = require("./downloadFile.js");


    let latestVersion = getLatest(onlineUrl + versionFileName);

    let scripts = latestVersion["scripts"];
    let currentVersion = getCurrent(path + versionFileName, scripts);

    let newFiles = [];
    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];

        let current = parseInt(currentVersion[script]);
        if (isNaN(current)) {
            current = 0;
        }
        let latest = parseInt(latestVersion[script]);

        if (current < latest) {
            newFiles.push([script, current, latest]);
        }
    }

    if (newFiles.length > 0) {
        let info = "下列脚本需要更新";
        let s = ""
        for (let i = 0; i < newFiles.length; i++) {
            let item = newFiles[i];
            s += item[0] + ":  \t\t" + item[1] + "\t->\t" + item[2] + "\n";
        }

        dialogs.confirm(info, s, function (value) {
            if (value) {
                threads.start(function () {
                    let success = true;
                    for (let i = 0; i < newFiles.length; i++) {
                        let item = newFiles[i][0];
                        let ok = download(onlineUrl + item, path + item);
                        if (!ok) {
                            success = false;
                        }
                    }

                    if (!success) {
                        dialogs.alert("下载失败");
                    } else {
                        files.write(path + versionFileName, JSON.stringify(latestVersion), "utf-8");
                        toastLog("更新完成");
                    }
                });
            } else {
                toastLog("取消");
            }
        });
    } else {
        let info = "当前脚本都是最新的了";
        dialogs.alert(info);
    }
}

module.exports = update;