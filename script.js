let deviceWidth = device.width;
let deviceHeight = device.height;

function openBeginningBtnItem(delay) {
    let items = textStartsWith("gif;base64").depth(19).find();
    console.log("寻找--领喵币");
    if (items.length > 0) {
        let item = items[items.length - 1];
        console.log("点击--领喵币");
        clickItemInCenter(item);
        sleep(delay);
        return 1;
    }
    return -1;
}

function isOpenBeginning() {
    let signIn = textContains("签到").findOnce();
    if (signIn != null) {
        console.log("成功--打开领取中心");
        return 1;
    }
    return -1;
}

function ensureOpenBeginning(waitDelay) {
    if (isOpenBeginning() === -1) {
        openBeginningBtnItem(waitDelay);
    }
    if (isOpenBeginning() === 1) return 1;

    console.error("失败--打开领取中心");
    toast("失败--打开领取中心");
    return -1;
}

function clickItemInCenter(item, time) {
    if (time == null) time = 50;
    if (item == null) return;
    let x = item.bounds().centerX();
    let y = item.bounds().centerY();
    press(x, y, time);
}

function goShopping() {
    let finished = textContains("20/20").findOne(1000);
    if (finished) {
        toastLog("结束--次数逛完");
        return 0;
    }

    let shopping = text("去进店").findOne(1000);
    if (shopping == null) {
        let finished = textContains("20/20").findOne(1000);
        if (finished) {
            toastLog("结束--次数逛完");
            return 0;
        } else {
            toastLog("结束--未知问题");
            return -1;
        }
    }
    console.log("开始浏览...");
    clickItemInCenter(shopping);
    return 1;
}

function swipeUp() {
    let x = parseInt(deviceWidth / 2);
    let duration = 500;
    let y = [parseInt(deviceHeight * 0.75), parseInt(deviceHeight * 0.25)];
    swipe(x, y[0], x, y[1], duration);
    swipe(x, y[0], x, y[1], duration);
}

function isFull() {
    for (let i = 0; i < 10; i++) {
        if (descStartsWith("今日已达上限").findOnce() || textStartsWith("今日已达上限").findOnce()) {
            console.log("今日已达上限");
            return 0;
        }
        sleep(1000);
    }
}


function waitSwipe() {
    let swipeAppear;
    let shoppingFull;
    for (let i = 0; i < 3; i++) {
        swipeAppear = desc("滑动浏览得").findOne(1000);
        if (swipeAppear != null) break;
        shoppingFull = desc("今日已达上限").findOne(1000);
        if (shoppingFull != null) return 0;
        console.log("i" + i);
    }

    sleep(1000);

    if (swipeAppear != null) {
        console.log("开始滑动");
        swipeUp();
        console.log("等待15s");
        sleep(1000 * 16);
    } else {
        console.log("slow");
        console.log("等待20s");
        sleep(1000 * 20);
    }

    let shoppingFinish = desc("任务完成").findOne(2000);
    if (shoppingFinish != null) {
        console.log("逛完，准备返回");
    } else {
        toastLog("未知逛完，返回");
    }

    return 1;
}

function browseFinish() {
    for (let i = 0; i < 10; i++) {
        let normalFinishDesc = descContains("已获得").findOnce();
        let normalFinishText = textContains("已获得").findOnce();
        let swipeFinish = desc("任务完成").findOnce();

        if (normalFinishDesc != null || swipeFinish != null || normalFinishText != null) {
            console.log("浏览结束");
            return 0;
        }
        sleep(250);
    }

    console.log("浏览未知");
    return -1;
}

function judgeWay() {
    let timeOut = 1000 * 7;
    let delay = 250;
    let loops = parseInt(timeOut / delay);
    for (let i = 0; i < loops; i++) {
        let swipeAppearDesc = descContains("滑动浏览得").findOnce();
        let swipeAppearText = textContains("滑动浏览得").findOnce();
        if (swipeAppearDesc != null || swipeAppearText != null) {
            console.log("已获取到滑动浏览模式");
            return 0;
        }

        let directBrowseDesc = desc("浏览").findOnce();
        let directBrowseText = text("浏览").findOnce();
        if (directBrowseDesc != null || directBrowseText != null) {
            if (descContains("00喵币").findOnce() != null || textContains("00喵币").findOnce() != null) {
                console.log("已获取到正常浏览模式");
                return 1;
            }
        }

        sleep(delay);
    }

    console.log("超时");
    return -1;
}

function runGoShopping() {
    let isSuccess;

    for (let i = 0; i < 20; i++) {
        isSuccess = ensureOpenBeginning(1000);
        if (isSuccess !== 1) break;
        isSuccess = goShopping();
        if (isSuccess !== 1) break;

        let st = waitSwipe();
        if (st === 0) {
            toastLog("已达上限，结束脚本");
            return 0;
        }

        back();
        sleep(1000);
    }


    if (isSuccess === 0) {
        toastLog("正常结束");
        return 0;
    } else if (isSuccess === -1) {
        toastLog("异常结束");
        return 1;
    }
}


function clickGoBrowse() {
    let browse = text("去浏览").findOne(1000);
    if (browse != null) {
        console.log("点击--去浏览");
        clickItemInCenter(browse);
        return 1;
    }
    return -1;
}

function runGoBrowse() {
    let isSuccess = 1;

    for (let i = 0; i < 20; i++) {
        isSuccess = ensureOpenBeginning(1000);
        if (isSuccess !== 1) break;
        isSuccess = clickGoBrowse();
        if (isSuccess !== 1) break;

        let jw = judgeWay();

        sleep(1000);
        if (jw === 0) swipeUp();
        else if (jw === -1) {
            if (isFull()) {
                console.log("已达上限");
                back();
                sleep(2000);
                continue;
            }
            console.log("4s");
            sleep(1000 * 4);
        }
        console.log("15s");
        sleep(1000 * 15);


        let isF = browseFinish();
        if (isF === 0) {
            console.log("浏览结束，返回");
        } else if (isF === -1) {
            console.log("浏览未正常结束，返回");
        }

        back();
        sleep(2000);

    }
}

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


function warning(n) {
    let items = ["不更新，但还是试试新脚本（不保证能用）", "清除本地下载的新脚本，使用默认脚本", "点击这里下载新APP"];

    let ch = dialogs.select("当前新版本不适用于此旧APP，请更新到新APP。", items, function (index) {

        if (index >= 0) {

            if (index === 0) {

                threads.start(function () {
                    sleep(1000);
                    runRun(n);
                });

            } else if (index === 1) {
                clearNewScript();
            } else if (index === 2) {
                alert("哪里下载的旧APP就去哪里下载新APP，我可没心思发布");
            }
        }
    });
}

function runRun(n) {
    if (n === 0) {
        let status = runGoShopping();
        toastLog("去逛店--浏览结束");
        alert("结束");
    } else {
        let statue = runGoBrowse();
        toastLog("去浏览--浏览结束");
        status = runGoShopping();
        toastLog("去逛店--浏览结束");
        alert("结束");
    }
}

function runChoose(n) {
    let currentVersion = app.versionCode;
    if (currentVersion === 1) {
        warning(n);
    } else {
        runRun(n);
    }


}

module.exports = runChoose;
