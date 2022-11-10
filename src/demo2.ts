import * as j from "jscodeshift";

const code = `
import {
    abc,
    recast
} from "bbb";
// 1

const demo = 1;
`;

// const dd = j(code)
//   .find(j.Identifier)
//   .forEach((path) => {
//     console.log(path.node.name);
//     j(path).replaceWith(
//       j.identifier(path.node.name.split("").reverse().join(""))
//     );
//   })
//   .toSource();

// console.log(dd);

// const root = j(code);

// const trackConstantsImportDeclarations = root.find(j.ImportDeclaration, {
//   //   source: { value: "bbb" },
//   type: "ImportDeclaration",
// });

// const keyIds = ["aaa", "bbb"].map((key) =>
//   j.importSpecifier(j.identifier(key))
// );
// // 替换原来的 import 语句
// trackConstantsImportDeclarations
//   .at(0)
//   .replaceWith(() => j.importDeclaration(keyIds, j.literal("demo")));

// console.log("1", root.toSource());

const root = j(code);

const trackConstantsImportDeclarations = root.find(j.ImportDeclaration, {
  //   source: { value: "bbb" },
  type: "ImportDeclaration",
});

trackConstantsImportDeclarations.forEach((item) => {
  console.log(item.node.source);
});
// const keyIds = ["aaa", "bbb"].map((key) =>
//   j.importSpecifier(j.identifier(key))
// );
// // 替换原来的 import 语句
// trackConstantsImportDeclarations
//   .at(0)
//   .replaceWith(() => j.importDeclaration(keyIds, j.literal("demo")));

// console.log("1", root.toSource());
