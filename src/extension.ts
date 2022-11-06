import * as vscode from "vscode";

import { ConfigType, sortImports } from "./format3";
// "import a from \"react\";\nimport a from \"ahooks\";\nimport a from \"umi\";\n// 111\nimport a from \"@yzh/yzhd\";\nimport a from \"@yzh/yzhd2\";\n\n\nimport a from \"@/a\";\n// 1\n// 1\nimport a from \"@/c\";\n\n\nimport a from \"./b\";\nimport a from \"./c\";\n\n\nconst demo = `import a1 from \"react\";\nimport a1 from \"./1\"; \nimport a1 from \"./c.less\";1\n`;\nconst demo2 = () => {\n  const demo = 1231;\n\n  const demo2 = 2;\n  return { demo: 1 };\n};\n"
// "import a from \"react\";\nimport a from \"ahooks\";\nimport a from \"umi\";\n// 111\nimport a from \"@yzh/yzhd\";\nimport a from \"@yzh/yzhd2\";\n\nimport a from \"@/a\";\n// 1\n// 1\nimport a from \"@/c\";\n\nimport a from \"./b\";\nimport a from \"./c\";\n\nconst demo = `import a1 from \"react\";\nimport a1 from \"./1\"; \nimport a1 from \"./c.less\";1\n`;\nconst demo2 = () => {\n  const demo = 1231;\n\n  const demo2 = 2;\n  return { demo: 1 };\n};\n"

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("importSort.sortImports", () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const fileName = document.fileName;
        const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (/^[jt]sx?$/.test(extension)) {
          const baseConfig = vscode.workspace
            .getConfiguration("importSort")
            .get<ConfigType[]>("sortingSettings");
          const text = document.getText();
          const sortedText = sortImports(text, baseConfig);
          if (text !== sortedText) {
            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Range(
                  new vscode.Position(0, 0),
                  new vscode.Position(document.lineCount, 0)
                ),
                sortedText
              );
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message);
      }
    }
  });

  // run importSort.sortImports on save if enabled
  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument(() => {
      const sortOnSave = vscode.workspace
        .getConfiguration("importSort")
        .get("sortOnSave");
      if (sortOnSave) {
        vscode.commands.executeCommand("importSort.sortImports");
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
