toastLog("开始");

let deviceWidth = device.width;
let deviceHeight = device.height;
let addFlag = false;
let vipFlag = true;

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
    console.log("已打开任务中心");
    refresh();
    return 0;
}

function refresh() {
    clickItemInCenter(textContains("刷新").findOnce());
}

function goToFinish() {
    let all = getAll();
    let excludeWordsBase = ["邀请", "战队", "游戏", "新人"];
    if (addFlag !== true) {
        excludeWordsBase.push("加购");
    }
    if (vipFlag !== true) {
        excludeWordsBase.push("开通");
    }


    let goes = exclude(all, excludeWordsBase);
    if (goes == null || goes.length === 0) {
        console.log("队列为空");
        return 1;
    }

    browseChoice(goes[0]);
    return 0;
}

function browseChoice(go) {
    let item = go[0];
    let introItem = go[1];
    let introText = introItem.text();

    // 点击 甄选
    if (introText.indexOf("商品") !== -1) {
        console.log("点击浏览");
        if (introText.indexOf("加购") !== -1) {

        } else if (introText.indexOf("浏览") !== -1) {
            browseProducts(go);
        }
    } else if (introText.indexOf("开通") !== -1) {
        addVip(go);
    } else {
        console.log("普通浏览");
        browseNormal(go);
    }
}

function addVip(go) {
    let item = go[0];
    let introText = go[1].text();
    console.log(introText);
    clickItemInCenter(item);
    sleep(2000);

    let join;
    for (let i = 0; i < 5; i++) {
        join = textContains("加入").findOnce();
        if (join != null) {
            break;
        }
        sleep(500);
    }
    if (join == null) {
        console.log("失败");
        return;
    }
    clickItemInCenter(join);
    sleep(4000);
    join = textContains("授权").findOnce();

    if (join) {
        back();
    }
}

function browseProducts(go) {
    let item = go[0];
    let introText = go[1].text();
    console.log(introText);
    clickItemInCenter(item);
    sleep(2000);
    let w = true;
    for (let i = 0; i < 10; i++) {
        let e = textContains("浏览").findOnce();
        if (e) {
            w = false;
            break;
        }
    }
    sleep(2000);
    if (w) {
        console.log("未加载成功");
        return -1;
    }


    let times = 0;
    let browsedProducts = [];

    for (let m = 0; m < 5; m++) {
        let products = getProducts(browsedProducts);
        for (let i = 0; i < products.length; i++) {
            let item = products[i];
            browsedProducts.push(item.text());
            let re = browseProduct(item);
            times += re;
            if (++times >= 5) {
                myBack(2);
                return 0;
            }
        }

        console.log("下滑");
        swipe(parseInt(deviceWidth / 2), parseInt(deviceHeight * 0.8), parseInt(deviceWidth / 2), parseInt(deviceHeight * 0.2), 500);
        sleep(500);
    }

    myBack(2);
}

function getProducts(browsedProducts) {
    console.log("获取界面的商品");
    let products = textContains("¥").find();
    let names = [];

    for (let i = 0; i < products.length; i++) {
        let name = products[i].parent().child(0);
        let top = name.bounds().top;
        if (top + 10 <= deviceHeight) {
            if (!isRepeat(name, browsedProducts)) {
                names.push(name);
            }
        }
    }

    console.log("获取到商品数量：" + names.length);
    return names;
}

function isRepeat(product, browsedProducts) {
    if (browsedProducts == null || browsedProducts.length === 0) {
        return false;
    }

    for (let i = 0; i < browsedProducts.length; i++) {
        let name = browsedProducts[i];
        if (name === product.text()) {
            return true;
        }
    }
    return false;
}

function browseProduct(product) {
    console.log(product.text());
    clickItemInCenter(product);
    sleep(1500);
    let re = retry();
    back();
    sleep(1000);
    return re;
}

function retry() {
    let re;
    re = textContains("重试").findOnce();
    if (re) {
        clickItemInCenter(re);
        console.log("重试");
    }
    sleep(500);

    for (let i = 0; i < 3; i++) {
        re = textContains("重试").findOnce();
        if (re == null) {
            return 0;
        }
        clickItemInCenter(re);
        sleep(500);
    }

    console.log("重试失败");
    return -1;
}

function browseNormal(go) {
    let item = go[0];
    let introText = go[1].text();
    console.log(introText);
    if (item) {
        clickItemInCenter(item);
        timeCountDown();
        if (introText.indexOf("庆生") !== -1) {
            myBack(2);
        } else {
            myBack(1);
        }
    } else {
        console.log("为空");
    }
}

function timeCountDown() {
    sleep(1000);
    toastLog("请等待");
    let countDown;
    let finish;
    let beginTime = 10;
    let countDownTime = 20;
    let m = beginTime;

    for (let i = 0; i < m; i++) {
        sleep(500);

        // 这个是检查是否有 倒计时 0-8 秒的数字存在，格式为 1，1s，01，01s，1S，01S。
        if (m !== countDownTime) {
            let allTexts = find();
            for (let j = 0; j < allTexts.length; j++) {
                let item = allTexts[j];
                let text = item.text();
                if (text != null && text !== "") {
                    for (let k = 1; k <= 8; k++) {
                        if (text === (String(k)) ||
                            text === ("0" + String(k)) ||
                            text === (String(k) + "S") ||
                            text === ("0" + String(k) + "S") ||
                            text === (String(k) + "s") ||
                            text === ("0" + String(k)) ||
                            text === ("0" + String(k) + "s")) {
                            countDown = item;
                            if (countDown && countDown.bounds().left <= deviceWidth * 0.2) {
                                if (m === beginTime) {
                                    console.log("开始倒计时...");
                                    m = countDownTime;
                                    i = 0;
                                }
                                break;
                            }
                        }
                    }
                    if (m === countDownTime) {
                        break;
                    }
                }

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
}

function myBack(m) {
    console.log("返回");
    if (m === 1) {
        back();
        sleep(500);
    } else if (m === 2) {
        let backButton = desc("返回").findOnce();
        if (backButton) {
            clickItemInCenter(backButton);
        }
        sleep(500);
    }

    let leave = textContains("离开").findOnce();
    if (leave) {
        clickItemInCenter(leave);
        sleep(500);
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

function getMoney() {
    let get;
    let f = true;
    let m = 0;
    while (f) {
        toastLog(++m);
        console.log("寻找...")
        for (let i = 0; i < 20; i++) {
            f = false;
            get = idContains("goldElfin").findOnce();
            if (get) {
                console.log("找到了")
                break;
            }
            sleep(250);
        }

        sleep(1000);

        if (get) {
            console.log("循环点击")
            for (let j = 0; j < 20; j++) {
                clickItemInCenter(get, 10);
                sleep(40);
            }
            f = true;
            sleep(2000);
        }
    }
    alert("结束");
}

function getAll() {
    let goes = text("去完成").find();
    let all = [];
    for (let i = 0; i < goes.length; i++) {
        let item = goes[i];
        let p = item.parent().parent().parent();
        let introduction = p.child(0).child(1);
        all.push([item, introduction]);
    }
    return all;
}


function exclude(items, excludes) {
    let res = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let go = item[0];
        let intro = item[1];
        let flag = true;

        for (let j = 0; j < excludes.length; j++) {
            if (intro.text().indexOf(excludes[j]) !== -1) {
                flag = false;
                break;
            }
        }

        if (flag) {
            res.push(item);
        }
    }

    return res;
}

function runVip() {
    vipFlag = true;
    run();
}

// run();
module.exports = [run, getMoney, runVip];
