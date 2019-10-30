let fileName;

function ensureVersionFile() {
    files.ensureDir(fileName);
    if (files.exists(fileName) === false) {
        let currentVersion = app.versionCode;
        let contain = "version\n" + currentVersion;
        console.log("本地 version 文件不存在，新建...");
        files.write(fileName, contain);
    }
}

function getCurrentVersion(currentVersionFileName) {
    setFileName(currentVersionFileName);
    ensureVersionFile();

    console.log("打开本地版本文件 " + fileName);
    let file = open(fileName);
    let lines = file.readlines();
    let currentVersion = lines[1];
    toastLog("current version:" + currentVersion);
    return currentVersion;
}

function setFileName(fileN) {
    fileName = fileN;
}

module.exports = getCurrentVersion;