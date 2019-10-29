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
    let shopping = text("去浏览").findOne(1000);
    if (shopping == null) {
        toastLog("结束--未知问题");
        return -1;

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
        if (descContains("已达上限").findOnce() || textContains("已达上限").findOnce()) {
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
        shoppingFull = descContains("已达上限").findOne(1000);
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

function reopenAgain() {
    let tbs = id("taskBottomSheet").findOnce();
    if (tbs == null) return -1;
    let close = tbs.child(1);
    if (close != null) {
        console.log("关闭");
        clickItemInCenter(close);
        sleep(1000);
        return ensureOpenBeginning(1000);
    }
    return -1;
}

function runGoShopping() {
    let isSuccess;

    for (let i = 0; i < 20; i++) {
        isSuccess = ensureOpenBeginning(1000);
        if (isSuccess !== 1) break;
        isSuccess = goShopping();

        let count = 0;
        while (isSuccess !== 1) {
            if (reopenAgain() === 1) {
                isSuccess = 1;
                break;
            }
            if (count++ >= 2) break;
        }

        if (isSuccess === -1) break;

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

    for (let i = 0; i < 40; i++) {
        isSuccess = ensureOpenBeginning(1000);
        if (isSuccess !== 1) break;

        for (let j = 0; j < 3; j++) {
            isSuccess = clickGoBrowse();
            if (isSuccess !== 1) {
                reopenAgain();
            } else break;
        }

        if (isSuccess === -1) break;

        let jw = judgeWay();

        sleep(1000);
        if (jw === 0) swipeUp();
        else if (jw === -1) {
            if (isFull()) {
                console.log("已达上限");
                back();
                sleep(2000);
                reopenAgain();
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
    sleep(500);

    let statue = runGoBrowse();
    toastLog("去浏览--浏览结束");
    alert("结束");
}

function moveFloating(n) {
    let i = -1;
    dialogs.confirm("由于需要，请将悬浮窗移动至靠左。", "点击确认表示已完成，直接运行脚本。\n点击取消则手动前去调整。\n" +
        "(中间浏览过程中可能会跳转到淘宝首页进行浏览，此时需要手动再次切回猫铺。)", function (clear) {
        if (clear) {
            console.log("直接运行");
            i = 1;
        } else {
            toastLog("请将悬浮窗移动至靠左");
            i = 0;
        }
    });


    while (i === -1) {
        slepp(100);
    }
    if (i === 1) {
        runRun(n);
    }
}

function runChoose(n) {
    let currentVersion = app.versionCode;
    if (currentVersion === 1) {
        warning(n);
    } else {
        moveFloating(n);
    }
}

module.exports = runChoose;
