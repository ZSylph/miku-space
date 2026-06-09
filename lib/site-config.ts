/** 站点全局配置 */

export const siteConfig = {
  title: "Miku Space",
  description: "A dreamy personal space inspired by Hatsune Miku",
  url: (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  language: "zh-CN",
  author: "玖驻zsxy",
  ogImage: "/og.png",
  twitterHandle: "@ZSylph",

  /** 社交链接 */
  social: {
    github: "https://github.com/ZSylph",
    bilibili: "https://space.bilibili.com/277755137",
    email: "1004076966@qq.com",
  },

  /** 萌 ICP 备案号 */
  icpNumber: "萌ICP备 2026XXXX号",
};
