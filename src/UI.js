"ui";
let deviceWidth = device.width;
let deviceHeight = device.height;

let margin = parseInt(deviceWidth * 0.05);
let buttonWidth = parseInt(deviceWidth * 0.30);

let rootPath = "/sdcard/脚本/Internet/淘宝京东/";

ui.layout(
    <vertical>
        <appbar>
            <toolbar id={"toolbar"} title="脚本"/>
        </appbar>

        <horizontal margin={margin + "px"}>
            <button id={"about1"} text={"关于简易使用"} width={buttonWidth + "px"}/>
            <button id={"about2"} text={"关于本脚本"} width={buttonWidth + "px"}/>
            <button id={"about3"} text={"关于旧版"} width={buttonWidth + "px"}/>
        </horizontal>


        <horizontal margin={margin + "px"}>
            <vertical>
                <button id={"showFloatingTB"} text={"加载悬浮窗(淘宝)"} width={buttonWidth + "px"}/>
                <button id={"updateTB"} text={"获取新版本(淘宝)"} width={buttonWidth + "px"}/>
            </vertical>
            <vertical>
                <button id={"clearTB"} text={"清除本地脚本(淘宝)"} width={buttonWidth + "px"}/>
                <button id={"openTB"} text={"转到淘宝"} width={buttonWidth + "px"}/>
            </vertical>
        </horizontal>

        <horizontal margin={margin + "px"}>
            <vertical>
                <button id={"showFloatingJD"} text={"加载悬浮窗(京东)"} width={buttonWidth + "px"}/>
                <button id={"updateJD"} text={"获取新版本(京东)"} width={buttonWidth + "px"}/>
            </vertical>
            <vertical>
                <button id={"clearJD"} text={"清除本地脚本(京东)"} width={buttonWidth + "px"}/>
                <button id={"openJD"} text={"转到京东"} width={buttonWidth + "px"}/>
            </vertical>
        </horizontal>

    </vertical>
);

activity.setSupportActionBar(ui.toolbar);

ui.emitter.on("create_options_menu", menu => {
    menu.add("日志");

});

ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "日志":
            app.startActivity("console");
            break;
    }
    e.consumed = true;
});

ui.about1.click(() => {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }
    let info = "" +
        "〇脚本分为实体界面和悬浮窗界面。启动实体界面不需要额外的操作，只需要同意基本权限即可。\n" +
        "〇关于权限问题，该脚本基于auto.js编写，启动时默认会请求[电话权限](听说不给也能运行)；储存权限是必须的，要请求网络获取最新脚本。\n" +
        "〇脚本的实际操作需要悬浮窗进行，所以需要有[悬浮窗权限]申请。如果有其他悬浮球可能无法开启无障碍功能。\n" +
        "〇同时由于需要点击操作，这是通过[无障碍]功能实现的，也需要授予。（设置→辅助功能→无障碍→本APP，不同手机可能会不一样）\n" +
        "☆脚本启动后，除非停止了，请不要重复启动。我不想在判断是否重复启动上再写额外的代码了(也就是希望用户是友善的)。";
    dialogs.confirm("关于简易使用", info);
});

ui.about2.click(() => {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }
    let info = "" +
        "〇该脚本为业余开发，不保证更新效率和频率。\n" +
        "〇脚本保存位置：手机储存/脚本/Internet/[应用名]。\n" +
        "〇本项目放于GitHub与Gitee，点击右上角可再日志中查看。\n" +
        "〇为了访问体验，更新地址用了 Gitee 的 raw 地址。\n" +
        "〇 Author @ Sleepybear1113";
    dialogs.confirm("关于本脚本", info);
});

ui.about3.click(() => {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }
    let info = "" +
        "〇若使用过旧版app，可能在[手机储存/脚本/淘宝喵币]文件夹有旧版脚本(这里不提供删除操作了)，大约占用内存不到20KB，特此说明。\n"
    dialogs.confirm("关于旧版", info);
});

ui.showFloatingTB.click(() => {
    let floatingFile = rootPath + "淘宝/floating.js";
    if (!ensure(floatingFile)) {
        return;
    }
    engines.execScriptFile(floatingFile);
});

ui.showFloatingJD.click(() => {
    let floatingFile = rootPath + "京东/floating.js";
    if (!ensure(floatingFile)) {
        return;
    }
    engines.execScriptFile(floatingFile);
});

let update = require("./update/update.js");

ui.updateTB.click(() => {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }
    // let githubUrl = "https://raw.githubusercontent.com/sleepybear1113/taobaoVisitingVenues/master/";
    threads.start(function () {
        let url = "https://gitee.com/sleepybear1113/taobaoVisitingVenues/raw/master/";
        update(url + "淘宝/", rootPath + "淘宝/", "version.json");
    });
});

ui.updateJD.click(() => {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }// let githubUrl = "https://raw.githubusercontent.com/sleepybear1113/taobaoVisitingVenues/master/";
    threads.start(function () {
        let url = "https://gitee.com/sleepybear1113/taobaoVisitingVenues/raw/master/";
        update(url + "京东/", rootPath + "京东/", "version.json");
    });

});

ui.clearTB.click(() => {
    clearScriptTB();
});

ui.clearJD.click(() => {
    clearScriptJD();
});

ui.openTB.click(() => {
    toastLog("切换到淘宝APP...");
    launch("com.taobao.taobao");
});

ui.openJD.click(() => {
    toastLog("切换到京东APP...");
    launch("com.jingdong.app.mall");
});

function removeFile(fileName) {
    if (files.exists(fileName)) {
        files.remove(fileName);
    }
}

function clearScriptTB() {
    threads.start(function () {
        files.removeDir(rootPath + "/淘宝");
        toastLog("清除完成(淘宝)");
    });
}

function clearScriptJD() {
    threads.start(function () {
        files.removeDir(rootPath + "/京东");
        toastLog("清除完成(京东)");
    });
}

function ensure(fileName) {
    let exists = files.exists(fileName);
    if (!exists) {
        dialogs.alert("脚本不存在，请获取最新版本");
    }
    return exists;
}

function getFloatPermission() {
    engines.execScript("请求悬浮窗权限", "console.show();console.hide();");
}

function checkFloatPermission() {
    let checkPermission = floaty.checkPermission();
    if (!checkPermission) {
        floaty.requestPermission();
        return;
    }
}