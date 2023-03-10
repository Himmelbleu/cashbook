import { Rule, UserShortcuts } from "unocss";

const rules = <Rule<any>[]>[
  // 字体
  [/^fsz-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ "font-size": `${d}rem !important` })],
  // 间距
  [/^lts-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ "letter-spacing": `${d}rem !important` })],
  // 行高
  [/^leh-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ "line-height": `${d} !important` })],
  // overflow
  [/^ofw-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // 文本颜色
  [/^(pri|sec|thr)-color$/, ([, d]) => ({ color: `var(--${d}-text-color) !important` })],
  // 背景颜色
  [/^bg$/, ([, d]) => ({ "background-color": `var(--bg-color) !important` })]
];

const shortcuts = <UserShortcuts>[
  [
    /^f-((c|s|e)(-(c|s|e|b))*)$/,
    ([, g1, g2, g3, g4]) => {
      const matches = [
        { prefix: "c", value: "center" },
        { prefix: "s", value: "start" },
        { prefix: "e", value: "end" },
        { prefix: "b", value: "between" }
      ];

      let style = ``;

      let corr = matches.find(ele => ele.prefix === g2);
      style += `flex items-${corr.value} content-${corr.value}`;

      if (g4) {
        corr = matches.find(ele => ele.prefix === g4);
        style += ` justify-${corr.value}`;
      }
      return style;
    }
  ]
];

export { rules, shortcuts };
