importClass("java.io.FileOutputStream");
importClass("java.io.InputStream");
importClass("java.net.URL");
importClass("java.net.URLConnection");
// importClass("java.utils.ArrayList");

function download(url, path, possibleSize) {
    let isOk = true;
    files.ensureDir(path);
    let fs = new FileOutputStream(path);
    let conn = new URL(url).openConnection();
    let isOver = false;
    let inStream;
    try {
        inStream = conn.getInputStream();

        let buffer = util.java.array("byte", 1024);
        let contentLength = conn.getContentLength();

        if (contentLength > 0) {
            toastLog("开始下载，文件总大小：" + unitConvert(contentLength));
        } else if (possibleSize > 0) {
            toastLog("开始下载，文件大小未知\n预计大小：" + unitConvert(possibleSize));
        } else {
            toastLog("开始下载，文件大小未知");

        }

        let currentLength = 0;

        threads.start(
            function() {
                while (true) {
                    sleep(3000);
                    if (isOver) {
                        break;
                    }
                    let perStr = "";
                    if (contentLength > 0) {
                        let percent = currentLength / contentLength * 100;
                        perStr = percent.toFixed(2);
                        toastLog("已下载" + perStr + "%\n大小：" + unitConvert(currentLength));
                    } else if (possibleSize > 0) {
                        let percent = currentLength / possibleSize * 100;
                        perStr = percent.toFixed(2);
                        toastLog("大约已下载" + perStr + "%(不准确)\n大小：" + unitConvert(currentLength));
                    } else {
                        toastLog("已下载大小：" + unitConvert(currentLength));
                    }
                }
            }
        );

        while (true) {
            let length = inStream.read(buffer);
            if (length === -1) {
                toastLog("下载完成！");
                break;
            }
            currentLength += length;
            fs.write(buffer, 0, length);
        }
        fs.close();
    } catch (e) {
        isOk = false;
        toastLog("下载发生错误\n" + e);
        fs.close();
        files.remove(path)
    }
    isOver = true;
    return isOk;
}


function unitConvert(length) {
    if (length < 1024) {
        return length + " B";
    } else if (length < 1024 * 1024) {
        return (length / 1024).toFixed(2) + " KB";
    } else {
        return (length / 1024 / 1024).toFixed(2) + " MB";
    }
}

module.exports = download;