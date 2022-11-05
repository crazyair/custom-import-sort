// const demo = `import a from "./c.less";
// import a from "umi";
// import a from "@yzh/yzhd2";
// import a from "@yzh/yzhd";

// const demo = `import a from "./bb";
// import a from "./aa";
// import a from "@yzh/yzhd";
// import a from "@/a";
// import a from "@/b";
// import a from "umi";
// import a from "react";`;

const demo = `import a from "./bb";
// aaa
import a from "./aa";
import a from "react";`;

const getCount = (text = "") => {
  let count = 0;
  text.split("").forEach((item) => {
    if (item === "`") {
      count += 1;
    }
  });
  return count;
};

const configArray = [
  { regex: "^react$" },
  { regex: "^[a-z]" },
  { regex: "^@[^/]", lineafter: true },
  { regex: "^@/", lineafter: true },
  { regex: ".", regex2: "\\.(less|css)$", lineafter: true },
  { regex: "\\.(less|css)$", lineafter: true },
];
const list = demo.split("\n");
console.log("list", list);
const cache = [];
list.forEach((item, index) => {
  if (item.startsWith("import")) {
    let path = item.split(/["']/)[1];
    cache.push({ index, item, path });
  }
});

const list2 = [];
cache
  .sort((a, b) => a.path.localeCompare(b.path))
  .forEach((a) => {
    let _index = undefined;
    let _line = false;
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
    const data = { sort: _index, index: a.index, item: a.item };
    if (_line) {
      data.lineafter = true;
    }
    list2.push(data);
  });
console.log("list2", list2);
const list3 = list2.sort((a, b) => -(b.sort - a.sort));
console.log(list3);

let index2 = 0;
const list4 = [];
list.forEach((item, index) => {
  const data = list3.find((item) => item.index === index);
  if (data) {
    const regexData = list3[index2];
    list4.push(regexData.item);
    if (regexData.lineafter) {
      const dd = list3.filter((list3Item) => list3Item.sort === regexData.sort);
      if (dd[dd.length - 1].item === regexData.item) {
        list4.push("");
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
