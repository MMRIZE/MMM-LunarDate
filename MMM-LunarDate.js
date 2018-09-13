Module.register("MMM-LunarDate", {
  defaults: {
    template: `
      <p>
        <br/>%LUNAR_YEAR_S60_C%年 %LUNAR_MONTH_S60_C%月(%LUNAR_LEAPMONTH_K%%LUNAR_MONTH_K%) %LUNAR_DAY_S60_C%日(%LUNAR_DAY_K%)
        <br/>Day of %LUNAR_DAY_STEM_COLOR% %LUNAR_DAY_BRANCH_ZODIAC%
        <br/>Month of %LUNAR_MONTH_STEM_COLOR% %LUNAR_MONTH_BRANCH_ZODIAC%
        <br/>Year of %LUNAR_YEAR_STEM_COLOR% %LUNAR_YEAR_BRANCH_ZODIAC%
      </p>
    `, //This is ES6 Style. If you use ES5 Style, modify it.

    apiKey : "9qwEEJZunbv%2BuXNPlIThdHrl6%2Bkr8Csx%2BBzknlYwJCq%2FL2bPhpYdd5gPRy0nvKBrmoVSCmR15z3B0G5s1DbqTg%3D%3D",
  },
  start: function() {
    this.sendSocketNotification("INIT", this.config)
  },

  getDom: function() {
    var wrapper = document.createElement("div")
    wrapper.id = "LUNARDATE"
    wrapper.innerHTML = ""

    return wrapper
  },

  notificationReceived: function(noti, payload) {
    if (noti == "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("GET_LUNARDATE")
    }
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "LUNARDATE") {
      document.getElementById("LUNARDATE").innerHTML = payload
    }
  }
})
