export type ConfigType = {
  regex: string[];
  regexNotEqual?: string;
};

const configArray: ConfigType[] = [
  { regex: ["^react$", "^[a-z]", "^@[^/]"] },
  { regex: ["^@/"] },
  { regex: ["."], regexNotEqual: "\\.(less|css)$" },
  { regex: ["\\.(less|css)$"] },
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
  const list = text.split("\n");
  const cache: Record<string, any>[] = [];
  let isTag = false;
  let lastIndex = 0;
  list.forEach((text, index) => {
    console.log(1, text, getCount(text));
    if (isTag && getCount(text) === 1) {
      isTag = false;
    } else if (getCount(text) === 1) {
      isTag = true;
    }
    if (text.startsWith("import")) {
      if (isTag === false) {
        let path = text.split(/["']/)[1];
        if (path) {
          cache.push({ index, text, path });
          lastIndex = index;
        } else {
          let i = index;
          let line = text;
          const indexList = [];
          while (!path) {
            i++;
            indexList.push(i);
            path = list[i].split(/["']/)[1];
            line += `\n${list[i]}`;
          }
          lastIndex = i;
          cache.push({ index, indexList, text: line, path });
        }
      }
    }
  });
  console.log(cache);
  if (cache.length === 0) {
    return text;
  }
  // import 数据
  // const _list = list.slice(0, lastIndex + 1);
  const _list = list.slice(0, cache[cache.length - 1].index + 1);
  // 正文数据
  const _list2 = list.slice(lastIndex + 1, list.length);
  console.log("_list", _list);
  console.log("_list2", _list2);

  const list2: Record<string, any>[] = [];
  cache
    .sort((a, b) => a.path?.localeCompare(b.path))
    .forEach((a) => {
      let sort = -1;
      let sort2 = -1;
      let _indexList: number[] = [];
      configArray?.forEach(({ regex = [], regexNotEqual }, index) => {
        regex.forEach((_regex, _index) => {
          if (sort === -1 && RegExp(_regex, "i").test(a.path)) {
            if (
              regexNotEqual ? !RegExp(regexNotEqual, "i").test(a.path) : true
            ) {
              sort = index;
              sort2 = _index;
              _indexList = a.indexList;
            }
          }
        });
      });
      list2.push({
        sort,
        sort2,
        index: a.index,
        text: a.text,
        indexList: _indexList,
      });
    });
  let list3 = list2.sort((a, b) => -(b.sort2 - a.sort2));
  list3 = list2.sort((a, b) => -(b.sort - a.sort));
  console.log(list3);

  const result: string[] = [];
  let cacheIndex = 0;
  _list.forEach((text, index) => {
    const data = list3.find((item) => item.index === index);
    if (data) {
      const regexData = list3[cacheIndex];
      console.log(regexData.text);
      result.push(regexData.text);
      const dd = list3.filter((item) => item.sort === regexData.sort);
      if (dd[dd.length - 1].text === regexData.text) {
        result.push("");
      }
      cacheIndex += 1;
    } else {
      const data2 = list3.find((item) => item.indexList?.includes(index));
      if (text && !data2) {
        result.push(text);
      }
    }
  });
  console.log("result", result);
  let _result = result;
  // 如果正文第一行为空行，则删掉 import 的最后换行
  if (_list2[0] === "") {
    _result = _result.slice(0, _result.length - 1);
  }
  console.log("_result", _result);
  console.log("_list2", _list2);
  return [..._result, ..._list2].join("\n");
};

// const demo = `import a from "umi";

// import a from "react";

// import a from "ahooks";

// import a from "@yzh/yzhd2";

// import a from "@yzh/yzhd";

// import a from "@/c";
// // 1
// import a from "@/a";

// import a from "./c";

// import a from "./b";

// const demo2 = () => {
//   const demo = 1;

//   const demo2 = 2;

//   return { demo: 1 };
// };

// const demo = \`import a1 from "react";
// import a1 from "./1";
// import a1 from "./c.less";
// \`;
// `;

// const demo = `import a from "react";

// import a from "umi";
// import a from "@yzh/yzhd";
// import {
//   FollowCustomerInfo,
//   postCrmPlatformUserTagBind,
// } from "@/services/crm";
// // aaa
// import a from './aa'

// const demo = () => {
//   return "1122";
// };
// `;

const demo = `export type ConfigType = {
  regex: string[];
  regexNotEqual?: string;
};

export const getCount = (text = "") => {
  text.split("").forEach((item) => {
    if (item === "\`") {
    }
  });
};

const demo = \`import a from "react";
import a from "@yzh/yzhd";
\`;
`;
const dd = sortImports(demo, configArray);
console.log(dd);
export { sortImports };
