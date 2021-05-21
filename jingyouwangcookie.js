var appName = '菁优网'
var jingyouwang = init()
var URL = jingyouwang.getdata("UrlJYW")
var KEY = jingyouwang.getdata("CookieJYW")

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   getcookie()
} else {
   sign()
}

function getcookie() {
  var url = $request.url;
  if (url) {
     var UrlKeyJYW = "UrlJYW";
     var UrlValueJYW = url;
     if (jingyouwang.getdata(UrlKeyJYW) != (undefined || null)) {
        if (jingyouwang.getdata(UrlKeyJYW) != UrlValueJYW) {
           var url = jingyouwang.setdata(UrlValueJYW, UrlKeyJYW);
           if (!url) {
              jingyouwang.msg("更新" + appName + "Url失败‼️", "", "");
              } else {
              jingyouwang.msg("更新" + appName + "Url成功🎉", "", "");
              }
           } else {
           jingyouwang.msg(appName + "Url未变化❗️", "", "");
           }
        } else {
        var url = jingyouwang.setdata(UrlValueJYW, UrlKeyJYW);
        if (!url) {
           jingyouwang.msg("首次写入" + appName + "Url失败‼️", "", "");
           } else {
           jingyouwang.msg("首次写入" + appName + "Url成功🎉", "", "");
           }
        }
     } else {
     jingyouwang.msg("写入" + appName + "Url失败‼️", "", "配置错误, 无法读取URL, ");
     }
  if ($request.headers) {
     var CookieKeyJYW = "CookieJYW";
     var CookieValueJYW = JSON.stringify($request.headers);
     if (jingyouwang.getdata(CookieKeyJYW) != (undefined || null)) {
        if (jingyouwang.getdata(CookieKeyJYW) != CookieValueJYW) {
           var cookie = jingyouwang.setdata(CookieValueJYW, CookieKeyJYW);
           if (!cookie) {
              jingyouwang.msg("更新" + appName + "Cookie失败‼️", "", "");
              } else {
              jingyouwang.msg("更新" + appName + "Cookie成功🎉", "", "");
              }
           } else {
           jingyouwang.msg(appName + "Cookie未变化❗️", "", "");
           }
        } else {
        var cookie = jingyouwang.setdata(CookieValueJYW, CookieKeyJYW);
        if (!cookie) {
           jingyouwang.msg("首次写入" + appName + "Cookie失败‼️", "", "");
           } else {
           jingyouwang.msg("首次写入" + appName + "Cookie成功🎉", "", "");
           }
        }
     } else {
     jingyouwang.msg("写入" + appName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
     }
  jingyouwang.done()
}
   
function sign() {
  var t1 = new Date().getTime()
  var t2 = t1 + 1
  URL = 'https://api.jyeoo.com/Profile/GetSignRulesNew'
  const url = { url: URL, headers: JSON.parse(KEY) }
  jingyouwang.get(url, (error, response, data) => {
    jingyouwang.log(`${appName}, data: ${data}`)
    const title = `${appName}`
    let subTitle = ''
    let detail = ''
    const result = JSON.parse(data)
    if (result.S == 2) {
      subTitle = `${result.Msg}`
      detail = `已经连续签到: ${result.D.SignCountToDay}天，账户总积分：${result.D.UserScores}积分`
    } else if(result.S == 1) {
      subTitle = `${result.Msg}`
      detail = `已经连续签到: ${result.D.SignCountToDay}天，账户总积分：${result.D.UserScores}积分`
    }
    jingyouwang.msg(title, subTitle, detail)
    jingyouwang.done()
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  put = (url, cb) => {
    if (isSurge()) {
      $httpClient.put(url, cb)
    }
    if (isQuanX()) {
      url.method = 'PUT'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, put, done }
}