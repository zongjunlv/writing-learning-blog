const fallbackMap: Record<string, string> = {
  全职法师: "quanzhi-fashi",
  长生界: "changshengjie",
  吞噬星空: "tunshi-xingkong",
  神墓: "shenmu",
  莽荒纪: "manghuangji",
  仙逆: "xianni",
  我师兄实在太稳健了: "wo-shixiong-wenjian",
  雪鹰领主: "xueying-lingzhu",
  不朽凡人: "buxiu-fanren",
  大主宰: "da-zhuzai",
  玄界之门: "xuanjie-zhimen",
  星辰变: "xingchenbian",
  斗罗大陆: "douluo-dalu",
  飞剑问道: "feijian-wendao",
  圣墟: "shengxu",
  全球高武: "quanqiu-gaowu",
  武动乾坤: "wudong-qiankun",
  凡人修仙传: "fanren-xiuxian-zhuan",
  牧神记: "mushenji",
  一念永恒: "yinian-yongheng",
  完美世界: "wanmei-shijie",
  斗破苍穹: "doupo-cangqiong",
  遮天: "zhetian",
  元尊: "yuanzun",
  九域凡仙: "jiuyu-fanxian",
  黎明之剑: "liming-zhijian",
  诡秘之主: "guimi-zhizhu",
  盘龙: "panlong",
  万古神帝: "wangu-shendi",
};

export function createPostSlug(date: string, sampleTitle: string): string {
  const normalizedDate = date.trim();
  const known = fallbackMap[sampleTitle.trim()];
  if (known) {
    return `${normalizedDate}-${known}`;
  }

  const ascii = sampleTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedDate}-${ascii || "daily-learning"}`;
}
