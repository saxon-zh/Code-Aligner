// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const alignSelected = vscode.commands.registerCommand('codeAligner.alignSelected', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
			// const langId = editor.document.languageId;
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            const langId = document.languageId;
            let alignChars = vscode.workspace
                .getConfiguration('codeAligner')
                .get<string[]>(`rules.${langId}`);

			console.log(langId, alignChars);
            
            if (alignChars) {
				const alignedText = alignCode(selectedText, alignChars);
				editor.edit((editBuilder) => {
					editBuilder.replace(selection, alignedText);
				});
			}
        } else {
			vscode.window.showWarningMessage('No active text editor found');
		}
    });

    context.subscriptions.push(alignSelected);

	const onWillSave = vscode.workspace.onWillSaveTextDocument((e) => {
		const autoFormatOnSave = vscode.workspace.getConfiguration('codeAligner').get('autoFormatOnSave');

		if (autoFormatOnSave) {
			const document = e.document;
			const langId = document.languageId;
			const alignChars = vscode.workspace
				.getConfiguration('codeAligner')
				.get<string[]>(`rules.${langId}`);
			
			if (alignChars) {
				const text = document.getText();
				const formattedText = alignCode(text, alignChars);

				e.waitUntil(
					Promise.resolve(new vscode.WorkspaceEdit()).then(() => {
						const edit = new vscode.WorkspaceEdit();
						const fullRange = new vscode.Range(
							document.positionAt(0),
							document.positionAt(text.length)
						);
						edit.replace(document.uri, fullRange, formattedText);
						return vscode.workspace.applyEdit(edit);
					})
				);
			}
		}
	});

	context.subscriptions.push(onWillSave);
}

function alignCode(text: string, alignChars: string[]): string {
	const lines = text.split('\n');
	alignChars = alignChars.sort((a, b) => b.length - a.length);
	const groups: { lines: string[], alignChar: string }[] = [];
	let currentGroup: { lines: string[], alignChar: string } = {
		lines: [],
		alignChar: '',
	};
	let prevFindChar = '';
	let lineIndex = 0;

    lines.forEach((line) => {
		let needAlign = false;
		let currentFindChar = '';

		try {
			alignChars.forEach((char) => {
				if (line.includes(char)) {
					currentFindChar = char;
					needAlign = true;
					throw new Error('break');
				}
			});
		} catch (e) {
		}

		if (lineIndex > 0 && currentFindChar !== prevFindChar && currentGroup.lines.length > 0) {
			groups.push(currentGroup);
			currentGroup = {
				lines: [],
				alignChar: '',
			};
		}

		currentGroup.lines.push(line);
		currentGroup.alignChar = currentFindChar;
		prevFindChar = currentFindChar;
		lineIndex++;
    });

    if (currentGroup.lines.length > 0) {
        groups.push(currentGroup);
    }

    const alignedLines: string[] = [];
    groups.forEach((group) => {
		const alignChar = group.alignChar;

		if (alignChar === '') {
			alignedLines.push(...group.lines.map((line) => line.trimEnd()));
		} else {
			const maxLength = Math.max(
				...group.lines.map((line) => {
					return line.substring(0, line.indexOf(alignChar)).trimEnd().length;
				})
			);

			group.lines.forEach((line) => {
				const index = line.indexOf(alignChar);
				if (index !== -1) {
					const leftPart = line.substring(0, index).trimEnd();
					const rightPart = line.substring(index + alignChar.length).trim();
					line = `${leftPart.padEnd(maxLength)} ${alignChar} ${rightPart}`;
				}
				alignedLines.push(line);
			});
		}
    });

    return alignedLines.join('\n');
}


// This method is called when your extension is deactivated
export function deactivate() {}
