// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let disposable = vscode.commands.registerCommand('tsvtohtml.covertToHtmlTable', () => {
        if (vscode.window.activeTextEditor?.selection.isEmpty ?? true) {
            vscode.window.showErrorMessage('Nothing is selected -- select the text to convert before running this command!');
            return;
        }

        let activeTextEditor = vscode.window.activeTextEditor!;
        let text = activeTextEditor.document.getText(activeTextEditor.selection);
        activeTextEditor.edit(callback => callback.replace(activeTextEditor.selection, substituteText(text)));
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function substituteText(text: string): string {
    
    let lines: string[] = text.split("\n");

    let accumulator: string = "<table>\n  <thead>\n";
    lines.forEach((value, index) => {
        accumulator += writeRow(value, index === 0, 4) + "\n";
        if (index === 0) {
            accumulator += "  </thead>\n  <tbody>\n";
        }
    });
    accumulator += "  </tbody>\n</table>";
    return accumulator;
}

function writeRow(textLine: string, isHeader: boolean = false, indent: number = 0, spacing: number = 2): string {
    const stringindent = " ".repeat(indent);
    const stringindenttd = " ".repeat(indent + spacing);
    const stringindentvalue = " ".repeat(indent + spacing + spacing);
    const td = isHeader ? "th" : "td";
    let accumulator = "";
    textLine.split("\t").forEach((value, index) => {
        let newline = index === 0 ? "" : "\n"; 
        let result = value.replace("<", "&lt;").replace(">", "&gt;");
        accumulator += `${newline}${stringindent}<tr>\n${stringindenttd}<${td}>\n${stringindentvalue}${result}\n${stringindenttd}</${td}>\n${stringindent}</tr>`;
    });
    return accumulator;
}