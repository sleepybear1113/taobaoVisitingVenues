function getCurrentVersion(currentVersionFileName, scripts) {
    ensureVersionFileExist(currentVersionFileName, scripts);

    console.log("打开本地版本文件 " + currentVersionFileName);
    let v = files.read(currentVersionFileName, "utf-8");
    let version = JSON.parse(v);
    console.log("current version:" + v);
    return version;

}

function ensureVersionFileExist(currentVersionFileName, scripts) {
    files.ensureDir(currentVersionFileName);
    if (files.exists(currentVersionFileName) === false) {
        toastLog("File not exist. Now create." + currentVersionFileName);
        let version = {};
        for (let i = 0; i < scripts.length; i++) {
            version[scripts[i]] = "0";
        }
        let v = JSON.stringify(version);
        files.write(currentVersionFileName, v, "utf-8");
    }
}


module.exports = getCurrentVersion;