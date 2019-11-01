let deviceWidth = device.width;
let deviceHeight = device.height;

/**
 * 点击领喵币的按钮
 * @param delay 点击之后延迟多久进行下一个函数
 * @returns {number}
 */
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


    if (items.length === 0) {
        let go = text("领喵币").findOne(1000);
        if (go != null) {
            console.log("点击--领喵币");
            clickItemInCenter(go);
            sleep(delay);
            return 1;
        }
    }
    return -1;
}

/**
 * 判断是否打开领取中心
 * @returns {number}
 */
function isOpenBeginning() {
    let signIn = textContains("签到").findOnce();
    if (signIn != null) {
        console.log("成功--打开领取中心");
        return 1;
    }
    return -1;
}

/**
 * 确保打开领取中心
 * @param waitDelay
 * @returns {number}
 */
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

/**
 * 向上滑动
 */
function swipeUp() {
    let x = parseInt(deviceWidth / 2);
    let duration = 500;
    let y = [parseInt(deviceHeight * 0.75), parseInt(deviceHeight * 0.25)];
    swipe(x, y[0], x, y[1], duration);
    swipe(x, y[0], x, y[1], duration);
}

/**
 * 逛店有没有满
 * @returns {number}
 */
function isFull() {
    for (let i = 0; i < 10; i++) {
        if (descContains("已达上限").findOnce() || textContains("已达上限").findOnce()) {
            console.log("今日已达上限");
            return 1;
        }
        sleep(1000);
    }
    return 0
}

/**
 * 执行浏览结束的判断操作
 * @returns {number}
 */
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

/**
 * 判断进入浏览的时候是否需要滑动
 * @returns {number}
 */
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

/**
 * 关闭领取中心再打开
 * @returns {number}
 */
function reopenAgain() {
    console.log("reopen");
    let tbs = id("taskBottomSheet").findOnce();
    if (tbs == null) return -1;
    let close = tbs.child(1);
    if (close != null) {
        console.log("关闭");
        clickItemInCenter(close);
        sleep(1000);
        return ensureOpenBeginning(2000);
    }
    return -1;
}

/**
 * 点击-去浏览 按钮
 * @returns {number}
 */
function clickGoBrowse() {
    let browse = text("去浏览").findOne(1000);
    if (browse != null) {
        let guessYouLike = textContains("猜你喜欢").findOnce();
        if (guessYouLike != null) {
            console.log("出现猜你喜欢");
            let pp = browse.parent().bounds().top;
            let ppp = guessYouLike.parent().parent().bounds().top;
            if (ppp === pp) {
                console.log("跳过--猜你喜欢");
                let allBrowse = text("去浏览").find();
                for (let i = 0; i < allBrowse.length; i++) {
                    let item = allBrowse[i];
                    if (item.bounds().top !== browse.bounds().top) {
                        browse = item;
                    }
                }
            }
        }

        console.log("点击--去浏览");
        clickItemInCenter(browse);
        return 1;
    }
    return -1;
}

/**
 * 循环执行浏览操作
 */
function runGoBrowse() {
    let isSuccess = 1;

    // 进行循环浏览
    for (let i = 0; i < 50; i++) {
        isSuccess = ensureOpenBeginning(2000); // 打开领取中心
        if (isSuccess !== 1) break; //打开失败就 -1

        // 每 5 次重新开关领取中心进行刷新
        if (i % 5 === 0) {
            reopenAgain();
        }

        // 点击去浏览，如果没找到 去浏览 的按钮，那就关闭领取中心再打开，三次
        for (let j = 0; j < 3; j++) {
            isSuccess = clickGoBrowse();
            if (isSuccess !== 1) {
                reopenAgain();
            } else break;
        }

        if (isSuccess === -1) break; //如果 3 次之后还是不行，那就 -1

        let jw = judgeWay(); //去浏览之后，判断是不是滑动浏览。这里最多延时 7s

        sleep(1000);

        if (jw === 0) swipeUp(); //进行滑动
        else if (jw === -1) { //如果没有滑动浏览，那就可能不需要，或者浏览到上限了
            if (isFull() === 1) {
                console.log("已达上限");
                back();
                sleep(2000);
                reopenAgain();
                continue;
            }
        }

        // 这里等待 15s 的浏览时间
        console.log("15s");
        sleep(1000 * 15);


        let isF = browseFinish(); //右下角是否出现浏览完成类似的字样。最多延时 2.5s
        if (isF === 0) {
            console.log("浏览结束，返回");
        } else if (isF === -1) {
            console.log("浏览未正常结束，返回");
        }

        backToBefore();
    }
}

/**
 * 可能存在需要两次返回的情况
 */
function backToBefore() {
    back();
    sleep(2000);

    let isGoingTo = text("正在前往会场").findOnce();
    if (isGoingTo != null) {
        back();
        sleep(2000);
    } else {
        isGoingTo = desc("正在前往会场").findOnce();
        if (isGoingTo != null) {
            back();
            sleep(2000);
        }
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

function runRun() {
    sleep(500);

    let statue = runGoBrowse();
    toastLog("去浏览--浏览结束");
    alert("结束");
}

function moveFloating(n) {
    let i = -1;
    dialogs.confirm("由于需要，请将悬浮窗移动至靠左。", "点击确认表示已完成，直接运行脚本。\n点击取消则手动前去调整。\n", function (clear) {
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

function oldVersionWarning(v) {
    let items = ["依旧尝试继续", "清除本地下载的新脚本，使用默认脚本", "新APP"];

    let choice = -10;

    dialogs.select("当前新版本可能不适用于此旧APP，请更新到新APP。", items, function (index) {
        choice = index;
    });

    while (choice === -10) {
        sleep(100);
    }

    if (choice === -1) {
        toastLog("未选择！");
    } else if (choice === 0) {
        if (v <= 6) {
            console.log(v);
            moveFloating();
        }
        runRun();

    } else if (choice === 1) {
        clearNewScript();
    } else if (choice === 3) {
        alert("暂没有开放下载新 APP 的功能，请自行下载");
    }
}

function versionChoice(v) {
    let vv = parseInt(v);
    let minSuitVersion = 10;
    console.log("适合运行的最低版本" + minSuitVersion);
    if (vv < minSuitVersion) {
        oldVersionWarning(vv);
    } else {
        runRun();
    }
}

function runChoose() {
    let currentVersion = app.versionCode;
    console.log("当前版本：" + currentVersion);
    versionChoice(currentVersion);
}

module.exports = runChoose;
