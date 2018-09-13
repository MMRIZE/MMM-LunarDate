# MMM-LunarDate
MagicMirror Module - Lunar date of today (Chinese Zodiac)

## Screenshot
![Screenshot](https://github.com/eouia/MMM-LunarDate/blob/master/screenshot.png?raw=true)

## Information
- This module will display Asian(of Korea or China) Lunar Calendar date and details.
- This Lunar Calendar is based on result of Korean astronomical observation, so it could be slightly different with that of Chinese. (But almost same, so I believe it will be compatible.)
- You can get the color, Wuxing, zodiac for the day, month and year.(in English)
- Output could be customized with Template tags.
- For more information of Asian Lunar Calendar, See these;
  - https://en.wikipedia.org/wiki/Lunar_calendar
  - https://en.wikipedia.org/wiki/Sexagenary_cycle
  - https://en.wikipedia.org/wiki/Heavenly_Stems
  - https://en.wikipedia.org/wiki/Earthly_Branches




## Installation
```shell
cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-LunarDate
cd MMM-LunarDate
npm install
```

## Configuration
```javascript
{
  module: "MMM-LunarDate",
  position: "top_right",
  config: {
    template: `
      <p>
        <br/>%LUNAR_YEAR_S60_C%年 %LUNAR_MONTH_S60_C%月(%LUNAR_LEAPMONTH_K%%LUNAR_MONTH_K%) %LUNAR_DAY_S60_C%日(%LUNAR_DAY_K%)
        <br/>Day of %LUNAR_DAY_STEM_COLOR% %LUNAR_DAY_BRANCH_ZODIAC%
        <br/>Month of %LUNAR_MONTH_STEM_COLOR% %LUNAR_MONTH_BRANCH_ZODIAC%
        <br/>Year of %LUNAR_YEAR_STEM_COLOR% %LUNAR_YEAR_BRANCH_ZODIAC%
      </p>
    `,
  }
},
```

### Template Tags
`Gregorian 13th September, 2018` will be converted to `3rd August` in Lunar Calendar.
There could be many detailed information in Lunar Calendar, so you can use Template tags for displaying specific infos.



|Tag   |Output Example   |Memo   |
|---|---|---|
|%SOLAR_YEAR%   |`2018`   |Year of Gregorian calendar of today   |   
|%SOLAR_MONTH%   |`09`   |Month of Gregorian calendar of today   |   
|%SOLAR_DAY%   |`13`   |Day of Gregorian calendar of today   |   
|%LUNAR_YEAR%  |`2018`   |Year of Lunar calendar of today   |   
|%LUNAR_MONTH%  |`08`   |Month of Lunar calendar of today   |   
|%LUNAR_DAY%  |`04`   |Day of Lunar calendar of today  |   
|%LUNAR_MONTH_K%  |`팔월`   |Korean month name of Lunar calendar of today   |   
|%LUNAR_DAY_K%  |`초나흘`   |Korean day name of Lunar calendar of today   |   
|%LUNAR_MONTH_C%   |`桂月`   |Chinese month name of Lunar calendar of today   |   
|%LUNAR_DAY_C%  |`初三`   |Korean day name of Lunar calendar of today   |
|%LUNAR_LEAPMONTH%  |`Leap` or null   |If this Lunar month is leapmonth, `Leap` will be displayed   |   
|%LUNAR_LEAPMONTH_K%  |`윤` or null   |Korean Leapmonth distinguisher   |   
|%LUNAR_LEAPMONTH_C%  |`閏` or null   |Chinese Leapmonth distinguisher   |   
|%LUNAR_YEAR_STEM_K%  |`무`   |10 Celestial Stems system name of this year in Korea   |   
|%LUNAR_YEAR_BRANCH_K%  |`술`   |12 Terrestrial Branches system name of this year in Korea   |   
|%LUNAR_YEAR_S60_K%  |`무술`   |60 Sexagenary cycle - combination of stem and branch name of this year in Korea   |   
|%LUNAR_YEAR_STEM_C%  |`戊`   |10 Celestial Stems system name of this year in China   |   
|%LUNAR_YEAR_BRANCH_C%   |`戌`   |12 Terrestrial Branches system name of this year in China   |   
|%LUNAR_YEAR_S60_C%  |`戊戌`  | 60 Sexagenary cycle - combination of stem and branch name of this year in China |   
|%LUNAR_YEAR_STEM_COLOR%  |`Yellow`   |Color of this year   |   
|%LUNAR_YEAR_STEM_DIRECTION%  |`Middle`   |Direction of this year   |   
|%LUNAR_YEAR_STEM_WUXING%  |`Earth`   |Element(Wuxing) of this year   |   
|%LUNAR_YEAR_BRANCH_ZODIAC%  |`Dog`   |Zodiac of this year   |
|%LUNAR_MONTH_STEM_K%  |   |See the Year part   |   
|%LUNAR_MONTH_BRANCH_K%  |   |   |   
|%LUNAR_MONTH_S60_K%  |   |   |   
|%LUNAR_MONTH_STEM_C%  |   |   |   
|%LUNAR_MONTH_BRANCH_C%   |   |   |   
|%LUNAR_MONTH_S60_C%  |   |   |   
|%LUNAR_MONTH_STEM_COLOR%  |   |   |   
|%LUNAR_MONTH_STEM_DIRECTION%  |   |   |   
|%LUNAR_MONTH_STEM_WUXING%  |   |   |   
|%LUNAR_MONTH_BRANCH_ZODIAC%  |   |   |
|%LUNAR_DAY_STEM_K%  |   |   |   
|%LUNAR_DAY_BRANCH_K%  |   |   |   
|%LUNAR_DAY_S60_K%  |   |   |   
|%LUNAR_DAY_STEM_C%  |   |   |   
|%LUNAR_DAY_BRANCH_C%   |   |   |   
|%LUNAR_DAY_S60_C%  |   |   |   
|%LUNAR_DAY_STEM_COLOR%  |   |   |   
|%LUNAR_DAY_STEM_DIRECTION%  |   |   |   
|%LUNAR_DAY_STEM_WUXING%  |   |   |   
|%LUNAR_DAY_BRANCH_ZODIAC%  |   |   |  
