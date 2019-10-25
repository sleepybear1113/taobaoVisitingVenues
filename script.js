//test something
let deviceWidth = device.width;
let deviceHeight = device.height;


function openBeginningBtnItem(delay) {
    let items = textStartsWith("gif;base64").depth(19).find();
    console.log("寻找--领喵币");
    if (items.length > 0) {
        let item = items[items.length - 1];
        console.log("点击-领喵币");
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
    if (isOpenBeginning() === -1) openBeginningBtnItem(waitDelay);
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

function runGoShopping() {
    let isSuccess;

    for (let i = 0; i < 20; i++) {
        isSuccess = ensureOpenBeginning(1000);
        if (isSuccess !== 1) break;
        isSuccess = goShopping();
        if (isSuccess !== 1) break;

        let swipeAppear = desc("滑动浏览得").findOne(7500);
        sleep(1000);

        if (swipeAppear != null) {
            console.log("开始滑动");
            swipeUp();
            console.log("等待15s");
            sleep(1000 * 15);
        } else {
            console.log("slow");
            console.log("等待20s");
            sleep(1000 * 20);
        }

        let shoppingFinish = desc("任务完成").findOne(7500);
        if (shoppingFinish != null) {
            console.log("逛完，准备返回");
            back();
            sleep(1000);
        } else {
            toastLog("未知逛完，返回");
            back();
            sleep(1000);
        }
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
    let browse = text("去浏览").findOne(500);
    if (browse != null) {
        console.log("点击--去浏览");
        clickItemInCenter(browse);
        return 1;
    }
    return -1;
}

function runGoBrowse() {
    let isSuccess = 1;
    isSuccess = ensureOpenBeginning(1000);

    if (isSuccess === 1) {
        isSuccess = clickGoBrowse();


        while (true) {
            if (isSuccess !== 1) {
                break;
            }


            let browseFinish = textContains("00喵币").findOne(2500);
            if (browseFinish != null) {
                console.log("逛完，准备返回");
                back();
                sleep(1000);
            } else {
                toastLog("未知逛完，返回");
                back();
                sleep(1000);
            }
        }
    }
}


function runChoose(n) {
    if (n === 0) {
        let status = runGoShopping();
        alert("结束");
    } else {
        alert("功能待完善，请先选择其他");
    }
}

module.exports = runChoose;
