export type ConfigType = {
  regex: string;
  regexNotEqual?: string;
  lineafter?: boolean;
};

const configArray: ConfigType[] = [
  { regex: "^react$" },
  { regex: "^[a-z]" },
  { regex: "^@[^/]", lineafter: true },
  { regex: "^@/", lineafter: true },
  { regex: ".", regexNotEqual: "\\.(less|css)$", lineafter: true },
  { regex: "\\.(less|css)$", lineafter: true },
];

export const getCount = (text = "") => {
  let count = 0;
  text.split("").forEach((item) => {
    if (item === "`") {
      count += 1;
    }
  });
  return count;
};

const sortImports = (text: string, configArray?: ConfigType[]) => {
  const list = text.split("\n").filter((x) => x);
  const cache: Record<string, any>[] = [];
  let isTag = false;
  list.forEach((text, index) => {
    if (isTag && getCount(text) === 1) {
      isTag = false;
    } else if (getCount(text) === 1) {
      isTag = true;
    }
    if (text.startsWith("import")) {
      if (isTag === false) {
        cache.push({ index, text, path: text.split(/["']/)[1] });
      }
    }
  });

  const list2: Record<string, any>[] = [];
  cache
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach((a) => {
      let sort = -1;
      let _line = false;
      configArray?.forEach(({ regex, regexNotEqual, lineafter }, index) => {
        if (sort === -1 && RegExp(regex, "i").test(a.path)) {
          if (regexNotEqual ? !RegExp(regexNotEqual, "i").test(a.path) : true) {
            sort = index;
            if (lineafter) {
              _line = true;
            }
          }
        }
      });
      list2.push({ sort, index: a.index, text: a.text, lineafter: _line });
    });
  const list3 = list2.sort((a, b) => -(b.sort - a.sort));

  const result: string[] = [];
  let cacheIndex = 0;
  list.forEach((text, index) => {
    const data = list3.find((item) => item.index === index);
    if (data) {
      const regexData = list3[cacheIndex];
      result.push(regexData.text);
      if (regexData.lineafter) {
        const dd = list3.filter((item) => item.sort === regexData.sort);
        if (dd[dd.length - 1].text === regexData.text) {
          result.push("");
        }
      }
      cacheIndex += 1;
    } else {
      result.push(text);
    }
  });
  return [...result, ""].join("\n");
};

const demo = `import a from "umi";

import a from "react";

import a from "ahooks";

import a from "@yzh/yzhd2";
import a from "@yzh/yzhd";
import a from "@/c";
// 1
import a from "@/a";
import a from "./c";
import a from "./b";
const demo = \`import a1 from "react";
import a1 from "./1"; 
import a1 from "./c.less";
\`;
`;

const dd = sortImports(demo, configArray);
console.log(dd);
export { sortImports };
