import * as vscode from "vscode";

import { ConfigType, sortImports } from "./format3";

import * as recast from "recast";

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
        const code = `import recast from "recast";`;
        const ast = recast.parse(code);
        console.log("ast", ast);
        vscode.commands.executeCommand("importSort.sortImports");
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
