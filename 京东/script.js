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

function openMenu() {
    console.log("打开任务中心ing...");
    let menu = textContains("做任务领金币").findOne(2000);
    if (menu == null) {
        return -1;
    }

    clickItemInCenter(menu);
    sleep(2000);
    return 0;
}

function isOpenMenu() {
    let menu = textContains("任务每日").findOne(1000);
    if (menu == null) {
        console.log("未打开任务中心");
        return -1;
    }
    console.log("已打开任务中心")
    return 0;
}

function goToFinish() {
    let goes = text("去完成").find();
    let excludes = excludeGo();
    let includes = includeGo();

    let go;
    go = exclude(goes, excludes);
    go = include(go, includes);
    if (go == null || go.length === 0) {
        console.log("队列为空");
        return 1;
    }

    clickItemInCenter(go[0]);
    sleep(1000);
    return 0;
}

function excludeGo() {
    let excludeWords = ["邀请好友", "加入一支战队", "甄选"];
    let excludeBounds = [];
    for (let i = 0; i < excludeWords.length; i++) {
        let word = excludeWords[i];
        let item = textContains(word).find();

        if (item != null && item.length > 0) {
            for (let j = 0; j < item.length; j++) {
                let b = item[j].bounds();
                excludeBounds.push([b.top, b.bottom]);
            }
        }
    }

    return excludeBounds;
}


function includeGo() {
    let includeWords = ["去逛", "浏览"];
    let excludeBounds = [];
    for (let i = 0; i < includeWords.length; i++) {
        let word = includeWords[i];
        let item = textContains(word).find();

        if (item != null && item.length > 0) {
            for (let j = 0; j < item.length; j++) {
                let b = item[j].bounds();
                excludeBounds.push([b.top, b.bottom]);
            }
        }
    }

    return excludeBounds;
}

function exclude(items, excludes) {
    let res = [];
    for (let i = 0; i < items.length; i++) {
        let y = items[i].bounds().centerY();
        let flag = true;

        for (let j = 0; j < excludes.length; j++) {
            let ex = excludes[j];
            if (ex[0] < y && ex[1] > y) {
                flag = false;
                break;
            }
        }

        if (flag) {
            res.push(items[i]);
        }
    }

    return res;
}

function include(items, includes) {
    let res = [];
    for (let i = 0; i < items.length; i++) {
        let y = items[i].bounds().centerY();
        let flag = false;

        for (let j = 0; j < includes.length; j++) {
            let ex = includes[j];
            if (ex[0] < y && ex[1] > y) {
                flag = true;
                break;
            }
        }

        if (flag) {
            res.push(items[i]);
        }
    }

    return res;
}

function timeCountDown() {
    toastLog("请等待");
    let countDown;
    let finish;
    let beginTime = 20;
    let countDownTime = 40;
    let m = beginTime;

    for (let i = 0; i < m; i++) {
        sleep(250);

        // 这个是检查是否有 倒计时 0-8 秒的数字存在。
        for (let j = 0; j <= 8; j++) {
            countDown = text(String(j)).findOnce();
            if (countDown == null) {
                countDown = text("0" + String(j)).findOnce();
            }

            if (countDown && countDown.bounds().left <= deviceWidth * 0.2) {
                if (m === beginTime) {
                    console.log("开始倒计时...");
                    m = countDownTime;
                    i = 0;
                }
                break;
            }
        }

        finish = textContains("完成").findOnce();
        if (finish && finish.bounds().left <= deviceWidth * 0.2) {
            console.log("浏览结束");
            m = countDownTime;
            break;
        }
    }

    if (m === beginTime) {
        console.log("超时返回");
    } else if (m > beginTime) {
        console.log("正常返回");
    }
    myBack();
}

function myBack() {
    back();
    sleep(1000);
    if (isOpenMenu() === -1) {
        let leave = textContains("离开").findOnce();
        if (leave) {
            clickItemInCenter(leave);
            sleep(1000);
        }
    }
    sleep(2000);
}

function run1() {
    let ok;

    let count = 0;
    while (true) {
        if (count++ > 50) {
            toastLog("循环次数到达50次，停止");
            break;
        }

        toastLog("运行次数：" + count);

        if (isOpenMenu() === -1) {
            ok = openMenu();
            if (ok === -1) {
                console.log("异常");
                return -1;
            }

            if (isOpenMenu() === -1) {
                toastLog("打开任务中心失败");
                return -1;
            }
        }

        ok = goToFinish();
        if (ok === 1) {
            console.log("结束");
            return 0;
        }
        timeCountDown();
    }
    return 0;
}

function run() {
    let m = run1();
    if (m === -1) {
        alert("结束（异常）");
    } else {
        alert("结束（正常）");
    }
}
module.exports = run;
