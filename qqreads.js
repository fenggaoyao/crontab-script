/* ziye

本人github地址     https://github.com/ziye12/JavaScript
转载请备注个名字，谢谢

11.25 增加 阅读时长上传，阅读金币，阅读随机金币
11.25 修复翻倍宝箱不同时领取的问题.增加阅读金币判定
11.25 修复阅读时长问题，阅读金币问题，请重新获取时长cookie
11.26 随机金币只有一次，故去除，调整修复阅读金币问题，增加时长上传限制
11.26 增加领取周时长奖励
11.26 增加结束命令
11.27 调整通知为，成功开启宝箱再通知
11.28 修复错误
11.29 更新 支持action.默认每天21点到21点20通知
12.2 修复打卡问题
12.3 缩短运行时间，由于企鹅读书版本更新.请手动进去看一次书
12.3 调整推送时间为12点和24点左右
12.6 精简打印通知
12.7 解决1金币问题，

⚠️cookie获取方法：

进 https://m.q.qq.com/a/s/d3eacc70120b9a37e46bad408c0c4c2a  点我的   获取更新body

进一本书 看 10秒以下 然后退出，获取阅读时长cookie，看书一定不能超过10秒

可能某些页面会卡住，但是能获取到cookie，再注释cookie重写就行了！

⚠️宝箱奖励为20分钟一次，自己根据情况设置定时，建议设置11分钟一次

hostname=mqqapi.reader.qq.com

############## 圈x

#企鹅读书获取cookie
https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track url script-request-body https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

#企鹅读书获取时长cookie
https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? url script-request-header https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

############## loon

//企鹅读书获取cookie
http-request https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js,requires-body=true, tag=企鹅读书获取cookie

//企鹅读书获取时长cookie
http-request https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, requires-header=true, tag=企鹅读书获取时长cookie

############## surge

//企鹅读书获取cookie
企鹅读书 = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 

//企鹅读书获取时长cookie
企鹅读书 = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid?,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 


*/

const jsname = "企鹅读书";
const $ = Env(jsname);
const notify = $.isNode() ? require("./sendNotify") : "";

let tz = "";
let kz = "";
let task = "";
let config = "";
let K = 0;



let COOKIES_SPLIT = "\n"; // 自定义多cookie之间连接的分隔符，默认为\n换行分割，不熟悉的不要改动和配置，为了兼容本地node执行

const logs = 0; // 0为关闭日志，1为开启
const notifyInterval = 3;
// 0为关闭通知，1为所有通知，2为宝箱领取成功通知，3为宝箱每15次通知一次

const dd = 1; // 单次任务延迟,默认1秒
const TIME = 30; // 单次时长上传限制，默认5分钟
const maxtime = 12; // 每日上传时长限制，默认12小时
const wktimess = 1200; // 周奖励领取标准，默认1200分钟

const d = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);//GITHUB
const b = new Date(new Date().getTime());//手机


let qqreadbodyVal = "";

let qqreadtimeurlVal = "";

let qqreadtimeheaderVal = "";


// const qqreadbdArr = [
//  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.31.0","mpos_ver":"1.21.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"044C764583111D8C918398791CD44944","guid":702779275,"session":"ozvq20g8bnmh9wu5s5wv0jkngp5jfds5","scene":1131,"source":"wza0005wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookStore_newCI_unit_C","click2":"homeTab_click_C","route":"pages/book-detail/index","refer":"pages/index/index","options":{"bid":"147574"},"dis":1607316085008,"ext6":107,"eventID":"bookDetail_I","type":"shown","bid":"147574","bookStatus":1,"bookPay":1,"from":"1131_147574"}]}',
//  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.31.0","mpos_ver":"1.21.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"C8E5A408199C21B1E520F8EA97334014","guid":1924114809,"session":"voy24znar8vdt8rn5kqmeduio3m3209l","scene":1007,"source":"wza0005wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"push_limitYes_suc_C","click2":-1,"route":"pages/money/index","refer":-1,"options":{"fromGuid":"1907854737","shareType":"303303","source":"wza0005wzb0004"},"dis":1607318069001,"ext6":20,"eventID":"onHide_O","type":"others","ui_pos":2}]}',
//  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.31.0","mpos_ver":"1.21.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"ED2B73BDA9F7D308CACB600E2F7E2F2B","guid":983061506,"session":"leiw7441c2uxbpstdp6vnim1e7mjyy11","scene":1007,"source":"wza0005wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"push_limitYes_suc_C","click2":-1,"route":"pages/money/index","refer":-1,"options":{"fromGuid":"1907854737","shareType":"303303","source":"wza0005wzb0004"},"dis":1607318240693,"ext6":10,"eventID":"onHide_O","type":"others","ui_pos":2}]}',
//  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.4.17","os_ver":"iOS 14.2","mp_ver":"0.31.0","mpos_ver":"1.21.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"4E396B9FCFC1A224F97DB350AB85ECD1","guid":2535838714,"session":"s11e5wy951b3d821hx33dw597luknq4e","scene":1007,"source":"wza0005wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"push_limitYes_suc_C","click2":-1,"route":"pages/money/index","refer":-1,"options":{"fromGuid":"1907854737","shareType":"303303","source":"wza0005wzb0004"},"dis":1607318383466,"ext6":12,"eventID":"onHide_O","type":"others","ui_pos":2}]}'
// ];

// const qqreadtimeurlArr = [
//   'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1131&refer=-1&bid=31370119&readTime=2202&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%222%22%3A%7B%22readTime%22%3A2202%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
//   'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1132&refer=-1&bid=26134185&readTime=2307&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2307%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
//   'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=-1&bid=27996332&readTime=4376&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A4376%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
//   'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=-1&bid=21841831&readTime=3980&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A3980%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1'

// ];

// const qqreadtimehdArr = [
//   '{"Accept":"*/*","Content-Type":"application/json","ywsession":"2h1kzkug43ifp4554tbfpt31qii0snq0","Cookie":"ywguid=702779275;ywkey=ywSypQeTvohB;platform=ios;channel=mqqmina;mpVersion=0.30.0;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=044C764583111D8C918398791CD44944","mpversion":"0.30.0","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.30.0/page-frame.html","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-cn"}',
//   '{"Accept":"*/*","Content-Type":"application/json","ywsession":"ots34xdu7wtpdeqhe1mm68mr8evcuulj","Cookie":"ywguid=1924114809;ywkey=yw3tlz6fJDZS;platform=ios;channel=mqqmina;mpVersion=0.30.0;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=C8E5A408199C21B1E520F8EA97334014","mpversion":"0.30.0","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.30.0/page-frame.html","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-cn"}',
//   '{"Accept":"*/*","Content-Type":"application/json","ywsession":"xfufk71y9lpcpkxnym7l8hvspeoh23qn","Cookie":"ywguid=983061506;ywkey=ywvH5ClXFi5B;platform=ios;channel=mqqmina;mpVersion=0.30.0;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=ED2B73BDA9F7D308CACB600E2F7E2F2B","mpversion":"0.30.0","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.30.0/page-frame.html","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-cn"}',
//   '{"Accept":"*/*","Content-Type":"application/json","ywsession":"o887lxxeb72p37rjizhgu2zepx1ssvze","Cookie":"ywguid=2535838714;ywkey=ywrNl1n80Xmb;platform=ios;channel=mqqmina;mpVersion=0.31.0;qq_ver=8.4.17;os_ver=iOS 14.2;mpos_ver=1.21.0;platform=ios;openid=4E396B9FCFC1A224F97DB350AB85ECD1","mpversion":"0.31.0","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","User-Agent":"QQ/8.4.17.638 CFNetwork/1206 Darwin/20.1.0","Referer":"https://appservice.qq.com/1110657249/0.31.0/page-frame.html","Accept-Encoding":"gzip, deflate, br","Accept-Language":"zh-cn"}'
// ];


const qqreadtimeurlArr = [
  'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=3003&refer=-1&bid=122264&readTime=8563&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A8563%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
  'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1132&refer=-1&bid=122704&readTime=5342&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A5342%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
  'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1132&refer=-1&bid=122264&readTime=2165&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2165%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
  'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=-1&bid=25304258&readTime=2944&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2944%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1',
  'https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1132&refer=-1&bid=21058239&readTime=3770&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%223%22%3A%7B%22readTime%22%3A3770%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1'
];

const qqreadtimehdArr = [
  '{"Accept":"*/*","Cookie": "ywguid=702779275;ywkey=ywYYFEdjFLAf;platform=android;channel=mqqmina;mpVersion=0.36.0;qq_ver=8.4.18.4945;os_ver=Android 10;mpos_ver=1.21.0;platform=android;openid=044C764583111D8C918398791CD44944","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","Referer": "https://appservice.qq.com/1110657249/0.36.0/page-frame.html","User-Agent": "Mozilla%2F5.0+%28Linux%3B+Android+10%3B+Redmi+Note+8+Pro+Build%2FQP1A.190711.020%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F83.0.4103.101+Mobile+Safari%2F537.36 QQ/8.4.18.4945 V1_AND_SQ_8.4.18_1558_YYB_D QQ/MiniApp","mpversion": "0.36.0","Content-Type": "application/json","ywsession": "j6vd8vwhqas86r0bd9tsuba0ug4x2oka","Accept-Encoding": "gzip","Accept-Language":"zh-cn"}',
  '{"Accept":"*/*","Cookie": "ywguid=1762371855;ywkey=ywhPf4sPzRBT;platform=ios;channel=mqqmina;mpVersion=0.36.0;qq_ver=8.5.0;os_ver=iOS 14.2;mpos_ver=1.23.0;platform=ios;openid=1762371855","Content-Type": "application/json","ywsession": "q8u2d6socs961z9fyeinb4ahpilex5tr","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","Referer": "https://appservice.qq.com/1110657249/0.36.0/page-frame.html","Accept-Encoding": "gzip, deflate, br","User-Agent": "QQ/8.5.0.635 CFNetwork/1206 Darwin/20.1.0","mpversion": "0.36.0","Accept-Language":"zh-cn"}',
  '{"Accept":"*/*","Cookie": "ywguid=1924114809;ywkey=ywC6NMnLhFf5;platform=ios;channel=mqqmina;mpVersion=0.36.0;qq_ver=8.5.0;os_ver=iOS 14.2;mpos_ver=1.23.0;platform=ios;openid=C8E5A408199C21B1E520F8EA97334014","Content-Type": "application/json","ywsession": "kxpsffi73j5zb809m2z6yzw0ly6uhul2","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","Referer": "https://appservice.qq.com/1110657249/0.36.0/page-frame.html","Accept-Encoding": "gzip, deflate, br","User-Agent": "QQ/8.5.0.635 CFNetwork/1206 Darwin/20.1.0","mpversion": "0.36.0","Accept-Language":"zh-cn"}',
  '{"Accept":"*/*","Cookie": "ywguid=2535838714;ywkey=ywrNl1n80Xmb;platform=ios;channel=mqqmina;mpVersion=0.36.0;qq_ver=8.5.0;os_ver=iOS 14.2;mpos_ver=1.23.0;platform=ios;openid=4E396B9FCFC1A224F97DB350AB85ECD1","Content-Type": "application/json","ywsession": "kjq0cwl9byyeu8fz2u2sg6vi9q68nrwj","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","Referer": "https://appservice.qq.com/1110657249/0.36.0/page-frame.html","Accept-Encoding": "gzip, deflate, br","User-Agent": "QQ/8.5.0.635 CFNetwork/1206 Darwin/20.1.0","mpversion": "0.36.0","Accept-Language":"zh-cn"}',
  '{"Accept":"*/*","Cookie": "ywguid=983061506;ywkey=ywvH5ClXFi5B;platform=ios;channel=mqqmina;mpVersion=0.36.0;qq_ver=8.5.0;os_ver=iOS 14.2;mpos_ver=1.23.0;platform=ios;openid=ED2B73BDA9F7D308CACB600E2F7E2F2B","Content-Type": "application/json","ywsession": "7a8uci3j6fdypxo5cwqvca7skpr5fz49","Connection":"keep-alive","Host":"mqqapi.reader.qq.com","Referer": "https://appservice.qq.com/1110657249/0.36.0/page-frame.html","Accept-Encoding": "gzip, deflate, br","User-Agent": "QQ/8.5.0.635 CFNetwork/1206 Darwin/20.1.0","mpversion": "0.36.0","Accept-Language":"zh-cn"}'
];

const qqreadbdArr = [
  '{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.18.4945","os_ver":"Android 10","mp_ver":"0.36.0","mpos_ver":"1.21.0","brand":"Redmi","model":"Redmi Note 8 Pro","screenWidth":393,"screenHeight":835,"windowWidth":393,"windowHeight":781,"openid":"044C764583111D8C918398791CD44944","guid":702779275,"session":"j6vd8vwhqas86r0bd9tsuba0ug4x2oka","scene":3003,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"522130","cid":"1"},"dis":1608567867241,"ext6":85,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"522130","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"3003_522130"}]}',
  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.5.0","os_ver":"iOS 14.2","mp_ver":"0.36.0","mpos_ver":"1.23.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"1762371855","guid":1762371855,"session":"q8u2d6socs961z9fyeinb4ahpilex5tr","scene":1132,"source":"wza0005wzb0003","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"122704","cid":"1"},"dis":1608529024800,"ext6":115,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"122704","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1132_122704"}]}',
  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.5.0","os_ver":"iOS 14.2","mp_ver":"0.36.0","mpos_ver":"1.23.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"C8E5A408199C21B1E520F8EA97334014","guid":1924114809,"session":"kxpsffi73j5zb809m2z6yzw0ly6uhul2","scene":1132,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"914366","cid":"1"},"dis":1608530444072,"ext6":31,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"914366","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1132_914366"}]}',
  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.5.0","os_ver":"iOS 14.2","mp_ver":"0.36.0","mpos_ver":"1.23.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"4E396B9FCFC1A224F97DB350AB85ECD1","guid":2535838714,"session":"u49chxposv1wmfup5qkhy7trydn3m7f6","scene":1132,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"push_limitYes_suc_C","click2":-1,"route":"pages/book-read/index","refer":-1,"options":{"bid":"25304258"},"dis":1608521887597,"ext6":3,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"25304258","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1132_25304258"}]}',
  '{"common":{"appid":1450024394,"areaid":5,"qq_ver":"8.5.0","os_ver":"iOS 14.2","mp_ver":"0.36.0","mpos_ver":"1.23.0","brand":"iPhone","model":"iPad 6 (WiFi)<iPad7,5>","screenWidth":768,"screenHeight":1024,"windowWidth":768,"windowHeight":974,"openid":"ED2B73BDA9F7D308CACB600E2F7E2F2B","guid":983061506,"session":"7a8uci3j6fdypxo5cwqvca7skpr5fz49","scene":1132,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"push_limitYes_suc_C","click2":-1,"route":"pages/book-read/index","refer":-1,"options":{"bid":"21058239"},"dis":1608522040803,"ext6":3,"eventID":"bookRead_show_I","type":"shown","ccid":3,"bid":"21058239","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"1132_21058239"}]}'

];


all();
function all() {
  qqreadbodyVal = qqreadbdArr[K];
  qqreadtimeurlVal = qqreadtimeurlArr[K];
  qqreadtimeheaderVal = qqreadtimehdArr[K];
  for (let i = 0; i < 13; i++) {
    (function (i) {
      setTimeout(
        function () {
          if (i == 0) 
              qqreadinfo(); // 用户名
          if (i == 1) {
              qqreadwktime(); // 周时长查询
              qqreadconfig(); // 时长查询
              qqreadtrack();//更新
   } else if (i == 2){
        qqreadtask();// 任务列表
          if (config.data &&config.data.pageParams.todayReadSeconds / 3600 <= maxtime)qqreadtime();   // 上传时长
}     
     else if (i == 3 ){
              qqreadpick();// 领周时长奖励
    if (task.data && task.data.taskList[0].doneFlag == 0)
        qqreaddayread();// 阅读任务
          if (task.data && task.data.taskList[1].doneFlag == 0)
              qqreadssr1();// 阅读金币1
          if (task.data && task.data.taskList[2].doneFlag == 0) {
              qqreadsign(); // 金币签到
              qqreadtake(); // 阅豆签到
}    
          if (task.data && task.data.taskList[3].doneFlag == 0)
              qqreadvideo();// 视频任务 
}
     else if (i == 7 ){
       if (task.data && task.data.treasureBox.doneFlag == 0)
              qqreadbox();// 宝箱
          if (task.data && task.data.taskList[1].doneFlag == 0)
              qqreadssr2();// 阅读金币2
          if (task.data && task.data.taskList[2].doneFlag == 0)
              qqreadsign2();// 签到翻倍
}    
     else if (i == 8&&task.data && 
task.data.user.amount >= 100000){
          if ($.isNode()&&d.getHours() == 23)
              qqreadwithdraw();//现金提现
     else if (b.getHours() == 23)
              qqreadwithdraw();//现金提现
}

     else if (i == 9){
          if ($.isNode()&&d.getHours() == 23 && d.getMinutes() >= 40)
              qqreadtrans();//今日收益累计
    else  if (b.getHours() == 23 && b.getMinutes() >= 40)
              qqreadtrans();//今日收益累计
}
     else if (i == 11 ){   
          if (task.data && task.data.treasureBox.videoDoneFlag == 0)
              qqreadbox2();// 宝箱翻倍
    if (task.data && task.data.taskList[1].doneFlag == 0)
              qqreadssr3();// 阅读金币3
}    
     else if (i == 12){  
       if ( K < qqreadbdArr.length - 1) {
              K += 1;
              all();
}    else if (K == qqreadbdArr.length - 1) {
              showmsg(); // 通知
              $.done();
  }
 }
},

        (i + 1) * dd * 1000
      );
    })(i);
  }
}



// 任务列表
function qqreadtask() {
  return new Promise((resolve, reject) => {
    const toqqreadtaskurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/page?fromGuid=",
      headers: JSON.parse(qqreadtimeheaderVal),

      timeout: 60000,
    };
    $.get(toqqreadtaskurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 任务列表: ${data}`);
      task = JSON.parse(data);
      kz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【已开宝箱】:${task.data.treasureBox.count}个\n`;

      tz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【第${task.data.invite.issue}期】:时间${task.data.invite.dayRange}\n` +
        ` 已邀请${task.data.invite.inviteCount}人，再邀请${task.data.invite.nextInviteConfig.count}人获得${task.data.invite.nextInviteConfig.amount}金币\n` +
        `【${task.data.taskList[0].title}】:${task.data.taskList[0].amount}金币,${task.data.taskList[0].actionText}\n` +
        `【${task.data.taskList[1].title}】:${task.data.taskList[1].amount}金币,${task.data.taskList[1].actionText}\n` +
        `【${task.data.taskList[2].title}】:${task.data.taskList[2].amount}金币,${task.data.taskList[2].actionText}\n` +
        `【${task.data.taskList[3].title}】:${task.data.taskList[3].amount}金币,${task.data.taskList[3].actionText}\n` +
        `【宝箱任务${task.data.treasureBox.count + 1}】:${
          task.data.treasureBox.tipText
        }\n` +
        `【${task.data.fans.title}】:${task.data.fans.fansCount}个好友,${task.data.fans.todayAmount}金币\n`;

      resolve();
    });
  });
}







// 金币统计
function qqreadtrans() {
  return new Promise((resolve, reject) => {  
for(var y=1;y<9;y++){
     let day=0;
    const toqqreadtransurl = { 
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/trans/list?pn="+y, 
      headers: JSON.parse(qqreadtimeheaderVal), 
      timeout: 60000, 
    };
    $.get(toqqreadtransurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 今日收益: ${data}`);
      trans = JSON.parse(data);
    for(var i=0;i<20;i++){
if(trans.data.list[i].createTime>=daytime)
  day+=trans.data.list[i].amount;
}
tz+="【今日收益】:获得"+day+'\n'	    
resolve();
      });
     }
  });
}



// 更新
function qqreadtrack() {
  return new Promise((resolve, reject) => {
    const body = qqreadbodyVal.replace(new RegExp(/"dis":[0-9]{13}/),`"dis":${new Date().getTime()}`) 
    const toqqreadtrackurl = { 
      url: "https://mqqapi.reader.qq.com/log/v4/mqq/track", 
      headers: JSON.parse(qqreadtimeheaderVal), 
   body: body,       
      timeout: 60000, 
    };
    $.post(toqqreadtrackurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 更新: ${data}`);
      track = JSON.parse(data);
	 tz += `【数据更新】:更新${track.msg}\n`;
      resolve();
    });
  });
}


//提现
function qqreadwithdraw() {
  return new Promise((resolve, reject) => {
    const toqqreadwithdrawurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/withdraw?amount=100000",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.post(toqqreadwithdrawurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 提现: ${data}`);
      withdraw = JSON.parse(data);
if(withdraw.data.code==0)
      tz += `【现金提现】:成功提现10元\n`;
      kz += `【现金提现】:成功提现10元\n`;
      resolve();
    });
  });
}




// 用户名
function qqreadinfo() {
  return new Promise((resolve, reject) => {
    const toqqreadinfourl = {
      url: "https://mqqapi.reader.qq.com/mqq/user/init",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadinfourl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 用户名: ${data}`);
      info = JSON.parse(data);
      kz += `\n========== 【${info.data.user.nickName}】 ==========\n`;
      tz += `\n========== 【${info.data.user.nickName}】 ==========\n`;

      resolve();
    });
  });
}

// 阅豆签到
function qqreadtake() {
  return new Promise((resolve, reject) => {
    const toqqreadtakeurl = {
      url: "https://mqqapi.reader.qq.com/mqq/sign_in/user",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.post(toqqreadtakeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅豆签到: ${data}`);
      take = JSON.parse(data);
      if (take.data.takeTicket > 0) {
        tz += `【阅豆签到】:获得${take.data.takeTicket}豆\n`;
      }

      resolve();
    });
  });
}

// 阅读时长任务
function qqreadconfig() {
  return new Promise((resolve, reject) => {
    const toqqreadconfigurl = {
      url:
        "https://mqqapi.reader.qq.com/mqq/page/config?router=%2Fpages%2Fbook-read%2Findex&options=",
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadconfigurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长查询: ${data}`);
      config = JSON.parse(data);
      if (config.code == 0)
        tz += `【时长查询】:今日阅读${(
          config.data.pageParams.todayReadSeconds / 60
        ).toFixed(0)}分钟\n`;

      resolve();
    });
  });
}

// 阅读时长
function qqreadtime() {
  return new Promise((resolve, reject) => {
    const toqqreadtimeurl = {
      url: qqreadtimeurlVal.replace(/readTime=/g, `readTime=${TIME}`),
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadtimeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长: ${data}`);
      time = JSON.parse(data);
      if (time.code == 0) tz += `【阅读时长】:上传${TIME / 6}分钟\n`;

      resolve();
    });
  });
}

// 阅读金币1
function qqreadssr1() {
  return new Promise((resolve, reject) => {
    const toqqreadssr1url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=30`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 1) {
      $.get(toqqreadssr1url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励1: ${data}`);
        ssr1 = JSON.parse(data);
        if (ssr1.data.amount > 0)
          tz += `【阅读金币1】获得${ssr1.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 阅读金币2
function qqreadssr2() {
  return new Promise((resolve, reject) => {
    const toqqreadssr2url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=300`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 5) {
      $.get(toqqreadssr2url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励2: ${data}`);
        ssr2 = JSON.parse(data);
        if (ssr2.data.amount > 0)
          tz += `【阅读金币2】获得${ssr2.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 阅读金币3
function qqreadssr3() {
  return new Promise((resolve, reject) => {
    const toqqreadssr3url = {
      url: `https://mqqapi.reader.qq.com/mqq/red_packet/user/read_time?seconds=1800`,
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    if (config.data && config.data.pageParams.todayReadSeconds / 60 >= 30) {
      $.get(toqqreadssr3url, (error, response, data) => {
        if (logs) $.log(`${jsname}, 金币奖励3: ${data}`);
        ssr3 = JSON.parse(data);
        if (ssr3.data.amount > 0)
          tz += `【阅读金币3】获得${ssr3.data.amount}金币\n`;

        resolve();
      });
    }
  });
}

// 金币签到
function qqreadsign() {
  return new Promise((resolve, reject) => {
    const toqqreadsignurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in/page",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsignurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 金币签到: ${data}`);
      sign = JSON.parse(data);
      if (sign.data.videoDoneFlag) {
        tz += `【金币签到】:获得${sign.data.todayAmount}金币\n`;
      }
      resolve();
    });
  });
}

// 金币签到翻倍
function qqreadsign2() {
  return new Promise((resolve, reject) => {
    const toqqreadsign2url = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/clock_in_video",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadsign2url, (error, response, data) => {
      if (logs) $.log(`${jsname}, 金币签到翻倍: ${data}`);
      sign2 = JSON.parse(data);
      if (sign2.code == 0) {
        tz += `【签到翻倍】:获得${sign2.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 每日阅读
function qqreaddayread() {
  return new Promise((resolve, reject) => {
    const toqqreaddayreadurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/read_book",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreaddayreadurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 每日阅读: ${data}`);
      dayread = JSON.parse(data);
      if (dayread.code == 0) {
        tz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 视频奖励
function qqreadvideo() {
  return new Promise((resolve, reject) => {
    const toqqreadvideourl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/watch_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadvideourl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 视频奖励: ${data}`);
      video = JSON.parse(data);
      if (video.code == 0) {
        tz += `【视频奖励】:获得${video.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 宝箱奖励
function qqreadbox() {
  return new Promise((resolve, reject) => {
    const toqqreadboxurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadboxurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励: ${data}`);
      box = JSON.parse(data);
      if (box.data.count >= 0) {
        tz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 宝箱奖励翻倍
function qqreadbox2() {
  return new Promise((resolve, reject) => {
    const toqqreadbox2url = {
      url:
        "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box_video",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadbox2url, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励翻倍: ${data}`);
      box2 = JSON.parse(data);
      if (box2.code == 0) {
        tz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
      }

      resolve();
    });
  });
}

// 本周阅读时长
function qqreadwktime() {
  return new Promise((resolve, reject) => {
    const toqqreadwktimeurl = {
      url: `https://mqqapi.reader.qq.com/mqq/v1/bookShelfInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    $.get(toqqreadwktimeurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 阅读时长: ${data}`);
      wktime = JSON.parse(data);
      if (wktime.code == 0)
        tz += `【本周阅读时长】:${wktime.data.readTime}分钟\n`;

      resolve();
    });
  });
}

// 本周阅读时长奖励任务
function qqreadpick() {
  return new Promise((resolve, reject) => {
    const toqqreadpickurl = {
      url: `https://mqqapi.reader.qq.com/mqq/pickPackageInit`,
      headers: JSON.parse(qqreadtimeheaderVal),
    };
    if (wktime.data.readTime >= wktimess && wktime.data.readTime <= 1250) {
      $.get(toqqreadpickurl, (error, response, data) => {
        if (logs) $.log(`${jsname},周阅读时长奖励任务: ${data}`);
        pick = JSON.parse(data);
        if (pick.data[7].isPick == true) tz += "【周时长奖励】:已全部领取\n";

        for (let i = 0; i < pick.data.length; i++) {
          setTimeout(() => {
            const pickid = pick.data[i].readTime;
            const Packageid = [
              "10",
              "10",
              "20",
              "30",
              "50",
              "80",
              "100",
              "120",
            ];
            const toqqreadPackageurl = {
              url: `https://mqqapi.reader.qq.com/mqq/pickPackage?readTime=${pickid}`,
              headers: JSON.parse(qqreadtimeheaderVal),
              timeout: 60000,
            };
            $.get(toqqreadPackageurl, (error, response, data) => {
              if (logs) $.log(`${jsname}, 领周阅读时长: ${data}`);
              Package = JSON.parse(data);
              if (Package.code == 0)
                tz += `【周时长奖励${i + 1}】:领取${Packageid[i]}阅豆\n`;
            });
          }, i * 100);
        }
      });
      resolve();
    }
  });
}

function showmsg() {
	
	if ($.isNode()) {
  tz += `\n\n========= 脚本执行-北京时间(UTC+8)：${new Date(
    new Date().getTime() + 8 * 60 * 60 * 1000
  ).toLocaleString()} \n\n`;
}else tz += `\n\n========= 脚本执行-北京时间(UTC+8)：${new Date(
    new Date().getTime()
  ).toLocaleString()} \n\n`;
  
  // if (
  //   (d.getHours() == 12 && d.getMinutes() <= 20) ||
  //   (d.getHours() == 23 && d.getMinutes() >= 40)
  // ) {
  //   notify.sendNotify(jsname, kz);
  // }

  if (notifyInterval != 1) console.log(tz); // 无通知时，打印通知

  if (notifyInterval == 1) $.msg(jsname, "", tz);
  // 显示所有通知
  else if (
    notifyInterval == 2 &&
    task.data &&
    task.data.treasureBox.doneFlag == 0
  )
    $.msg(jsname, "", tz);
  // 宝箱领取成功通知
  else if (
    (notifyInterval == 3 && task.data && task.data.treasureBox.count == 0) ||
    task.data.treasureBox.count == 15 ||
    task.data.treasureBox.count == 30 ||
    task.data.treasureBox.count == 45 ||
    task.data.treasureBox.count == 60
  )
    $.msg(jsname, "", tz); // 宝箱每15次通知一次




}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
