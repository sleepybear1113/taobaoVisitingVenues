"ui";
let deviceWidth = device.width;
let deviceHeight = device.height;

let margin = parseInt(deviceWidth * 0.05);
let buttonWidth = parseInt(deviceWidth * 0.30);

ui.layout(
    <vertical margin={margin + "px"}>
        <button margin={margin + "px"} id={"showFloating"} text={"加载悬浮窗"} width={buttonWidth + "px"}/>
        <button margin={margin + "px"} id={"about1"} text={"关于--001"} width={buttonWidth + "px"}/>

        <button margin={margin + "px"} id={"about2"} text={"关于--002"} width={buttonWidth + "px"}/>

        <button margin={margin + "px"} id={"attention"} text={"attention"} width={buttonWidth + "px"}/>
        <button margin={margin + "px"} id={"update"} text={"获取新版本"} width={buttonWidth + "px"}/>
        <button margin={margin + "px"} id={"clear"} text={"清除本地脚本"} width={buttonWidth + "px"}/>
        <button margin={margin + "px"} id={"open"} text={"切换到淘宝"} width={buttonWidth + "px"}/>
    </vertical>
);

ui.showFloating.click(() => {
    engines.execScriptFile("floating.js");
});

let update = require("./update/update.js");
ui.update.click(() => {
    // let githubUrl = "https://raw.githubusercontent.com/sleepybear1113/taobaoVisitingVenues/master/";
    let githubUrl = "https://gitee.com/sleepybear1113/taobaoVisitingVenues/raw/master/";
    let latestUrl = githubUrl + "version.json";

    let sdcardPath = "/sdcard/脚本/淘宝喵币/";
    let currentVersionUrl = sdcardPath + "version.txt";

    let updateFileInfoList = [
        [githubUrl + "script.js", sdcardPath + "script.js", 5000]
    ];

    update(latestUrl, currentVersionUrl, updateFileInfoList);
});

ui.about1.click(() => {
    let info = "" +
        "〇脚本分为实体界面和悬浮窗界面。启动实体界面不需要额外的操作，只需要同意基本权限即可。\n" +
        "〇脚本的实际操作需要悬浮窗进行，所以需要有悬浮窗权限申请。如果有其他悬浮球可能无法开启无障碍功能。\n" +
        "〇同时由于需要点击操作，这是通过无障碍功能实现的，也需要授予。（设置→辅助功能→无障碍→本APP，不同手机可能会不一样）\n" +
        "☆脚本启动后，除非停止了，请不要重复启动。我不想在判断是否重复启动上再写额外的代码了(也就是希望用户是友善的)。\n" +
        "☆每当更新 APP 后请执行清除本地脚本的操作，当然“获取新版本”当然不用啦（如果能获取的话）。";

    dialogs.confirm(info);
});

ui.about2.click(() => {
    let info = "" +
        "〇脚本更新操作是我如果空下来可能会改善脚本的运行的操作。当然不保证[有新脚本、新脚本能下载完整、新脚本能用等]。\n" +
        "〇若出现问题，请清除本地脚本，使用自带的初版脚本文件，或者清除后重试。\n" +
        "〇脚本保存位置：根目录→脚本→[应用名]。\n" +
        "〇GitHub。点击更新后，点击手机的“返回”进行脚本的退出，可以看到日志和访问的地址。\n" +
        "〇更新地址用了 Gitee 的 raw 地址，本来 GitHub 的会可能无法访问，现在不知道了。\n" +
        "〇 Author @ Sleepybear";
    dialogs.confirm(info);
});

ui.clear.click(() => {
    clearNewScript();
});

ui.open.click(() => {
    toastLog("切换到淘宝APP...");
    launch("com.taobao.taobao");
});

function removeFile(fileName) {
    if (files.exists(fileName)) {
        files.remove(fileName);
    }
}

function clearNewScript() {
    threads.start(function () {
        removeFile("/sdcard/脚本/淘宝喵币/script.js");
        removeFile("/sdcard/脚本/淘宝喵币/version.txt");
        toastLog("清除完成");
    });
}

toastLog("每当重新安装/更新APP的时候，请执行清除本地脚本");