var moment = require("moment")
var request = require('request')
var parser = require('xml2json-light')

var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.config = null
    this.lastQuery = null
    this.lastResponse = null
    this.timer = null
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "INIT") {
      this.config = payload
      this.timer = setInterval(()=>{
        this.responseLunarDate()
      }, 1000 * 60)
    } else if (noti == "GET_LUNARDATE") {
      this.responseLunarDate(true)
    }
  },

  responseLunarDate: function(force = false) {
    var now = new moment()
    if (this.lastQuery && now.format("YYYY-MM-DD") == this.lastQuery && this.lastResponse && force !== true) {
      // do nothing
      //this.sendSocketNotification("LUNARDATE", this.lastResponse)
    } else {
      this.lastQuery = now.format("YYYY-MM-DD")
      this.getLunarDateFromAPI(now)
    }
  },

  getLunarDateFromAPI: function(m) {
    var solYear = m.format("YYYY")
    var solMonth = m.format("MM")
    var solDay = m.format("DD")

    var url = 'http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo'
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + this.config.apiKey
    queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent(solYear) /* 연 */
    queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent(solMonth); /* 월 */
    queryParams += '&' + encodeURIComponent('solDay') + '=' + encodeURIComponent(solDay); /* 일 */

    var self = this
    request({
        url: url + queryParams,
        method: 'GET'
    }, (error, response, body) => {
        var item = {}
        //console.log('Headers', JSON.stringify(response.headers));
        //console.log('Reponse received', body);
        if (error) {
          console.log ("[LUNARDATE] Error:", error)
          this.sendSocketNotification("ERROR", result.response.header.resultMsg)
          return
        }
        console.log("[LUNARDATE] Data received from API.")
        var result = parser.xml2json(body)
        if (response.statusCode !== 200 || result.response.header.resultCode !== "00") {
          console.log ("[LUNARDATE] Error in received data.")
          this.sendSocketNotification("ERROR", result.response.header.resultMsg)
        } else {
          console.log("[LUNARDATE] Data received from API.")
          this.sendSocketNotification("LUNARDATE", this.parse(result.response.body.items.item))
        }
    })
  },

  parse: function(obj) {
    const dayMap = {
      k : [
        "초하루", "초이틀", "초사흘", "초나흘", "초닷새", "초엿새", "초이레", "초여드레", "초아흐레", "초열흘",
        "열하루", "열이틀", "열사흘", "열나흘", "보름", "열엿새", "열이레", "열여드레", "열아흐레", "스무날",
        "스무하루", "스무이틀", "스무사흘", "스무나흘", "스무닷새", "스무엿새", "스무이레", "스무여드레", "스무아흐레", "서른날",
        "서른하루"
      ],
      c : [
        "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
        "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
        "三十一"
      ],
    }

    const monthMap = {
      k : [
        "정월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "동짓달", "섣달"
      ],
      c : [
        "正月", "杏月", "桃月", "槐月", "蒲月", "荷月", "巧月", "桂月", "菊月", "阳月", "冬月", "腊月"
      ]
    }

    const stem10 = {
      k : [
        "갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"
      ],
      c : [
        "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
      ],
      wuxing : [
        "Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"
      ],
      color: [
        "Blue", "Blue", "Red", "Red", "Yellow", "Yellow", "White", "White", "Black", "Black"
      ],
      direction: [
        "East", "East", "South", "South", "Center", "Center", "West", "West", "North", "North"
      ]
    }

    const branch12 = {
      k : [
        "자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"
      ],
      c : [
        "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
      ],
      zodiac : [
        "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
      ]
    }

    var ret = this.config.template
    ret = ret.replace("%SOLAR_YEAR%", obj.solYear)
    ret = ret.replace("%SOLAR_MONTH%", obj.solMonth)
    ret = ret.replace("%SOLAR_DAY%", obj.solDay)
    ret = ret.replace("%LUNAR_YEAR%", obj.lunYear)
    ret = ret.replace("%LUNAR_MONTH%", obj.lunMonth)
    ret = ret.replace("%LUNAR_DAY%", obj.lunDay)

    var mIndex = parseInt(obj.lunMonth) - 1
    var dIndex = parseInt(obj.lunDay) - 1
    var isLastDay = (obj.lunday == obj.lunNday) ?  true : false
    ret = ret.replace("%LUNAR_MONTH_K%", monthMap.k[mIndex])
    ret = ret.replace("%LUNAR_MONTH_C%", monthMap.c[mIndex])
    ret = ret.replace("%LUNAR_DAY_C%", dayMap.c[dIndex])
    ret = (isLastDay) ? ret.replace("%LUNAR_DAY_K%", "그믐") : ret.replace("%LUNAR_DAY_K%", dayMap.k[dIndex])

    var isLeapMonth = (obj.lunLeapmonth == "윤") ? true : false

    ret = (isLeapMonth) ? ret.replace("%LUNAR_LEAPMONTH_K%", "윤") : ret.replace("%LUNAR_LEAPMONTH_K%", "")
    ret = (isLeapMonth) ? ret.replace("%LUNAR_LEAPMONTH_C%", "閏") : ret.replace("%LUNAR_LEAPMONTH_C%", "")
    ret = (isLeapMonth) ? ret.replace("%LUNAR_LEAPMONTH%", "Leap") : ret.replace("%LUNAR_LEAPMONTH%", "")

    var y = obj.lunSecha.split('')
    var sIndex = stem10.k.indexOf(y[0])
    var bIndex = branch12.k.indexOf(y[1])
    ret = ret.replace("%LUNAR_YEAR_STEM_K%", stem10.k[sIndex])
    ret = ret.replace("%LUNAR_YEAR_BRANCH_K%", branch12.k[bIndex])
    ret = ret.replace("%LUNAR_YEAR_S60_K%", stem10.k[sIndex] + branch12.k[bIndex])
    ret = ret.replace("%LUNAR_YEAR_STEM_C%", stem10.c[sIndex])
    ret = ret.replace("%LUNAR_YEAR_BRANCH_C%", branch12.c[bIndex])
    ret = ret.replace("%LUNAR_YEAR_S60_C%", stem10.c[sIndex] + branch12.c[bIndex])
    ret = ret.replace("%LUNAR_YEAR_STEM_COLOR%", stem10.color[sIndex])
    ret = ret.replace("%LUNAR_YEAR_STEM_DIRECTION%", stem10.direction[sIndex])
    ret = ret.replace("%LUNAR_YEAR_STEM_WUXING%", stem10.wuxing[sIndex])
    ret = ret.replace("%LUNAR_YEAR_BRANCH_ZODIAC%", branch12.zodiac[bIndex])

    y = obj.lunWolgeon.split('')
    sIndex = stem10.k.indexOf(y[0])
    bIndex = branch12.k.indexOf(y[1])
    ret = ret.replace("%LUNAR_MONTH_STEM_K%", stem10.k[sIndex])
    ret = ret.replace("%LUNAR_MONTH_BRANCH_K%", branch12.k[bIndex])
    ret = ret.replace("%LUNAR_MONTH_S60_K%", stem10.k[sIndex] + branch12.k[bIndex])
    ret = ret.replace("%LUNAR_MONTH_STEM_C%", stem10.c[sIndex])
    ret = ret.replace("%LUNAR_MONTH_BRANCH_C%", branch12.c[bIndex])
    ret = ret.replace("%LUNAR_MONTH_S60_C%", stem10.c[sIndex] + branch12.c[bIndex])
    ret = ret.replace("%LUNAR_MONTH_STEM_COLOR%", stem10.color[sIndex])
    ret = ret.replace("%LUNAR_MONTH_STEM_DIRECTION%", stem10.direction[sIndex])
    ret = ret.replace("%LUNAR_MONTH_STEM_WUXING%", stem10.wuxing[sIndex])
    ret = ret.replace("%LUNAR_MONTH_BRANCH_ZODIAC%", branch12.zodiac[bIndex])

    y = obj.lunIljin.split('')
    sIndex = stem10.k.indexOf(y[0])
    bIndex = branch12.k.indexOf(y[1])
    ret = ret.replace("%LUNAR_DAY_STEM_K%", stem10.k[sIndex])
    ret = ret.replace("%LUNAR_DAY_BRANCH_K%", branch12.k[bIndex])
    ret = ret.replace("%LUNAR_DAY_S60_K%", stem10.k[sIndex] + branch12.k[bIndex])
    ret = ret.replace("%LUNAR_DAY_STEM_C%", stem10.c[sIndex])
    ret = ret.replace("%LUNAR_DAY_BRANCH_C%", branch12.c[bIndex])
    ret = ret.replace("%LUNAR_DAY_S60_C%", stem10.c[sIndex] + branch12.c[bIndex])
    ret = ret.replace("%LUNAR_DAY_STEM_COLOR%", stem10.color[sIndex])
    ret = ret.replace("%LUNAR_DAY_STEM_DIRECTION%", stem10.direction[sIndex])
    ret = ret.replace("%LUNAR_DAY_STEM_WUXING%", stem10.wuxing[sIndex])
    ret = ret.replace("%LUNAR_DAY_BRANCH_ZODIAC%", branch12.zodiac[bIndex])

    this.lastResponse = ret
    return ret

  }
})
