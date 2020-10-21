toastLog("开始");

let deviceWidth = device.width;
let deviceHeight = device.height;

function clickItemInCenter(item, time) {
    if (time == null) time = 50;
    if (item == null) return;
    let x = item.bounds().centerX();
    let y = item.bounds().centerY();
    press(x, y, time);
}

/**
 * 点击领喵币的按钮
 * @returns {number}
 */
function openBeginningBtnItem() {
    let o = textContains("赚喵币").findOnce();
    if (o == null) {
        return -1;
    }
    clickItemInCenter(o);
    sleep(1000);
    return 1;
}

/**
 * 判断是否打开领取中心
 * @returns {number}
 */
function isOpenBeginning() {
    let signIn = textContains("关闭").findOnce();
    if (signIn != null) {
        console.log("成功--打开领取中心");
        return 1;
    }
    return -1;
}

/**
 * 确保打开领取中心
 * @returns {number}
 */
function ensureOpenBeginning() {
    if (isOpenBeginning() === -1) {
        openBeginningBtnItem();
    }
    if (isOpenBeginning() === 1) return 1;
    sleep(2000);
    if (isOpenBeginning() === 1) return 1;

    console.error("失败--打开领取中心");
    toast("失败--打开领取中心");
    return -1;
}


function getBrowserButtons(exclude) {
    // 获取全部的“去浏览”/“去完成”的按钮
    let go = textMatches(/.*?去[浏完搜].*?/).find();

    // 浏览结束
    if (go == null || go.length === 0) {
        return 0;
    }

    let goes = [];
    for (let i = 0; i < go.length; i++) {
        let item = go[i];
        // 如果不在 exclude 中，那么添加到 goes 中。
        if (!checkInExclude(item, exclude)) {
            goes.push(item);
        }
    }

    return goes;
}

function checkInExclude(go, exclude) {
    if (exclude == null || exclude.length === 0) {
        return false;
    }

    // 获取包含按钮的整个横条布局
    let goParent = go.parent();
    // 判断是否包含
    return checkExcludeInChildren(goParent, exclude);
}

/**
 * 是否在 text 中包含 exclude。包含则返回 true。
 * @param text
 * @param exclude
 * @returns {boolean}
 */
function checkTextInExclude(text, exclude) {
    if (exclude == null || text == null || exclude.length === 0) {
        return false;
    }

    for (let i = 0; i < exclude.length; i++) {
        let item = exclude[i];
        if (text.indexOf(item) >= 0) {
            return true;
        }
    }
    return false;
}

/**
 * 一个递归，循环判断里面所有的元素是否包含 exclude 中的内容
 * @param parent
 * @param exclude
 * @returns {boolean}
 */
function checkExcludeInChildren(parent, exclude) {
    if (parent == null) {
        return false;
    }

    let children = parent.children();
    for (let i = 0; i < children.length; i++) {
        let item = children[i];

        if (item != null) {
            let text = item.text();
            let desc = item.desc();

            let b1 = checkTextInExclude(text, exclude);
            let b2 = checkTextInExclude(desc, exclude);

            // 如果有一个中包含了 exclude 中的，那么就返回 true，即包含了。
            if (b1 || b2) {
                return true;
            }

            let b = checkExcludeInChildren(item, exclude);
            if (b) {
                return b;
            }
        }
    }
    return false;
}

function getInnerText(item) {
    if (item == null) {
        return "";
    }

    let children = item.children();
    if (children == null || children.length === 0) {
        return "";
    }
    let txt = "";
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        txt += " " + child.text();
        txt += " " + getInnerText(child);
    }
    return txt;
}

/**
 * 跳过倒计时广告
 */
function clickSkip() {
    let skip = descMatches("^[0-6]\\d{0}s$").findOnce();
    if (skip != null) {
        console.log("滑动跳过广告");
        swipeUp(1);
        sleep(1000);
    }
}

/**
 * 向上滑动
 */
function swipeUp(n) {
    sleep(300);
    console.log("滑动屏幕");
    let x = parseInt(deviceWidth / 2);
    let duration = 500;
    let y = [parseInt(deviceHeight * 0.75), parseInt(deviceHeight * 0.25)];

    for (let i = 0; i < n; i++) {
        swipe(x, y[0], x, y[1], duration);
    }
}

function waiting(item, intro) {
    console.log(getInnerText(intro));
    clickItemInCenter(item);

    sleep(2000);

    let begin = 10;
    let end = 40;
    let m = begin;

    for (let i = 0; i < m; i++) {
        clickSkip();

        if (m === begin) {
            let wait = descContains("浏览").findOnce();
            if (wait == null) {
                wait = textContains("浏览").findOnce();
            }
            if (wait) {
                i = 0;
                m = end;
                sleep(500);
                swipeUp(1);
                console.log("等待读秒");
            }
        }


        let finish = descContains("完成").findOnce();
        if (finish == null) {
            finish = textContains("完成").findOnce();
        }
        if (finish) {
            console.log("浏览完成，返回");
            back();
            return 1;
        }


        sleep(500);
    }

    console.log("超时");
    back();
}

/**
 * 关闭领取中心再打开
 * @returns {number}
 */
function reopenAgain() {
    toastLog("重新打开（进行刷新界面）");
    let tbs = text("关闭").findOnce();
    if (tbs == null) return -1;
    console.log("关闭");
    clickItemInCenter(tbs);
    sleep(1000);
    return ensureOpenBeginning();
}

function run() {
    let exclude = ["撸猫", "蚂蚁", "特价", "茅台", "签到", "观看"];
    let maxTimes = 50;
    let finishCount = 0;

    for (let i = 0; i < maxTimes; i++) {
        toastLog((i + 1));
        ensureOpenBeginning();
        if (i % 5 === 4) {
            reopenAgain();
        }
        sleep(1000);

        let browserButtons = getBrowserButtons(exclude);
        if (browserButtons.length === 0) {
            if (++finishCount < 3) {
                reopenAgain();
                sleep(2000);
                continue;
            }
            toastLog("结束");
            break;
        }
        finishCount = 0;

        let button = browserButtons[0];
        if (button == null) {
            sleep(500);
            continue;
        }
        waiting(button, button.parent());
        sleep(2000);
    }
}

module.exports = [run];