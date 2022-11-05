type ConfigType = {
  regex: string;
  regex2?: string;
  lineafter?: boolean;
};

const configArray: ConfigType[] = [
  { regex: "^react$" },
  { regex: "^[a-z]" },
  { regex: "^@[^/]", lineafter: true },
  { regex: "^@/", lineafter: true },
  { regex: ".", regex2: "\\.(less|css)$", lineafter: true },
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

const sortImports = (text: string) => {
  const list = text.split("\n").filter((x) => x);
  console.log("list", list);
  const cache: Record<string, any>[] = [];
  let isTag = false;
  list.forEach((item, index) => {
    if (isTag && getCount(item) === 1) {
      isTag = false;
    } else if (getCount(item) === 1) {
      isTag = true;
    }
    if (item.startsWith("import")) {
      if (isTag === false) {
        let path = item.split(/["']/)[1];
        cache.push({ index, item, path });
      }
    }
  });
  console.log(cache.sort((a, b) => a.path.localeCompare(b.path)));
  const list2: Record<string, any>[] = [];
  cache
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach((a) => {
      let _index: number | undefined = undefined;
      let _line: boolean | undefined = false;
      configArray.forEach((item, index) => {
        if (_index === undefined && RegExp(item.regex, "i").test(a.path)) {
          if (item.regex2) {
            if (!RegExp(item.regex2, "i").test(a.path)) {
              _index = index;
              _line = item.lineafter;
            }
          } else {
            _index = index;
            _line = item.lineafter;
          }
        }
      });
      const data: Record<string, any> = {
        sort: _index,
        index: a.index,
        item: a.item,
      };
      if (_line) {
        data.lineafter = true;
      }
      list2.push(data);
    });
  console.log("list2", list2);
  const list3 = list2.sort((a, b) => -(b.sort - a.sort));
  console.log(list3);

  console.log("list", list);
  let index2 = 0;
  const list4: string[] = [];
  list.forEach((item, index) => {
    const data = list3.find((item) => item.index === index);
    console.log(data, item);
    if (data) {
      const regexData = list3[index2];
      list4.push(regexData.item);
      if (regexData.lineafter) {
        const dd = list3.filter(
          (list3Item) => list3Item.sort === regexData.sort
        );
        if (dd[dd.length - 1].item === regexData.item) {
          if (list[index + 1]) {
            console.log(item, list[index + 1]);
            list4.push("");
          }
        }
      }
      index2 += 1;
    } else {
      list4.push(item);
    }
  });
  console.log("list4", list4);
  const result = list4.join("\n");
  console.log(result);
  return result;
};

const demo = `import react from "react";
import umi from "umi";
import { Button } from "@yzh/yzhd2";

import a from "@/yzh/yzhd";

import a from "./c";

const demo = \`import a from "react";
// 111
import b from "./1"; 
import c from "./c.less";
\`;
`;

const dd = sortImports(demo);
console.log(dd);
export { sortImports };
