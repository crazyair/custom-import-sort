import * as j from "jscodeshift";

const code = `
import {
    abc,
    recast
} from "aaa";

import bbb from "bbb";
`;

const str = code.split("\n");
console.log("str", str);

const root = j(code);

const importDeclarations = root.find(j.ImportDeclaration, {
  type: "ImportDeclaration",
});
const list: any[] = [];
importDeclarations.replaceWith((item) => {
  if (item.node.loc) {
    const { start = { line: 0, column: 0 }, end = { line: 0, column: 0 } } =
      item.node.loc;
    let num = 0;
    let _str = str[start.line - 1];
    while (num < end.line - start.line) {
      _str = `${_str}\n${str[num + 2]}`;
      num += 1;
    }
    list.push({ path: item.node.source.value, value: _str });
  }
});

console.log(list[0]);
console.log(list[1]);
