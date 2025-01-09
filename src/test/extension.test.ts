import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.");

    test("Align Selected Command", async () => {
      // Create a new text document
      const document = await vscode.workspace.openTextDocument({
        content: "a = 1\nbb = 22\nccc = 333",
      });
      const editor = await vscode.window.showTextDocument(document);

      // Select the entire document
      const selection = new vscode.Selection(0, 0, document.lineCount, 0);
      editor.selection = selection;

      // Execute the alignSelected command
      await vscode.commands.executeCommand("codeAligner.alignSelected");

      // Get the updated text
      await editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(0, 0, document.lineCount, 0),
          document.getText()
        );
      });
      const updatedText = editor.document.getText();

      console.log(updatedText);

      // Expected aligned text
      const expectedText = "a   = 1\nbb  = 22\nccc = 333";

      // Assert the text is aligned correctly
      assert.strictEqual(updatedText, expectedText);
    });
  });
});
