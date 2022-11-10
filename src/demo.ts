import * as recast from "recast";

const code = `
import recast from "recast";
// 1
`;
const ast = recast.parse(code);
// console.log("ast", ast.loc.start.line);
// console.log("ast", ast.loc.end.line);
// console.log("comments", ast.program.body[0].type);
// console.log("comments", ast.program.body[0].trailingComments);
