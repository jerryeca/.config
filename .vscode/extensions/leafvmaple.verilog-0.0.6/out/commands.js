"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode = require("vscode");
class Commands {
    constructor() {
        this.LANGUAGE_NAME = "Verilog";
        this.EXTENTSION_NAME = "verilog";
        this.COMPILE_COMMANDS = "iverilog -o {fileName}.out {fileName}";
        this.EXECUTE_COMMANDS = "vvp {fileName}.out";
        this.outputChannel = vscode.window.createOutputChannel(this.LANGUAGE_NAME);
        this.terminal = vscode.window.createTerminal(this.LANGUAGE_NAME);
    }
    executeCommand(fileUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                vscode.window.showInformationMessage("Code is already running!");
                return;
            }
            const editor = vscode.window.activeTextEditor;
            if (fileUri && editor && fileUri.fsPath !== editor.document.uri.fsPath) {
                this.document = yield vscode.workspace.openTextDocument(fileUri);
            }
            else if (editor) {
                this.document = editor.document;
            }
            else {
                vscode.window.showInformationMessage("No code found or selected.");
                return;
            }
            const fileName = path_1.basename(this.document.fileName);
            this.cwd = path_1.dirname(this.document.fileName);
            this.config = vscode.workspace.getConfiguration(this.EXTENTSION_NAME);
            const runInTerminal = this.config.get("runInTerminal");
            const clearPreviousOutput = this.config.get("clearPreviousOutput");
            const preserveFocus = this.config.get("preserveFocus");
            if (runInTerminal) {
                this.executeCommandInTerminal(fileName, clearPreviousOutput, preserveFocus);
            }
            else {
                this.executeCommandInOutputChannel(fileName, clearPreviousOutput, preserveFocus);
            }
        });
    }
    executeCommandInTerminal(fileName, clearPreviousOutput, preserveFocus) {
        if (clearPreviousOutput) {
            vscode.commands.executeCommand("workbench.action.terminal.clear");
        }
        this.terminal.show(preserveFocus);
        this.terminal.sendText(`cd "${this.cwd}"`);
        this.terminal.sendText(this.COMPILE_COMMANDS.replace(/{fileName}/g, fileName));
        this.terminal.sendText(this.EXECUTE_COMMANDS.replace(/{fileName}/g, fileName));
    }
    executeCommandInOutputChannel(fileName, clearPreviousOutput, preserveFocus) {
        if (clearPreviousOutput) {
            this.outputChannel.clear();
        }
        this.isRunning = true;
        this.isCompiling = true;
        this.isSuccess = true;
        this.outputChannel.show(preserveFocus);
        this.outputChannel.appendLine(`[Running] ${path_1.basename(fileName)}`);
        const exec = require("child_process").exec;
        const startTime = new Date();
        this.compileProcess = exec(this.COMPILE_COMMANDS.replace(/{fileName}/g, fileName), { cwd: this.cwd });
        this.compileProcess.stdout.on("data", (data) => {
            this.outputChannel.append(data);
            if (data.match("I give up.")) {
                this.isSuccess = false;
            }
        });
        this.compileProcess.stderr.on("data", (data) => {
            this.outputChannel.append(data);
            this.isSuccess = false;
        });
        this.compileProcess.on("close", (compileCode) => {
            this.isCompiling = false;
            if (this.isSuccess) {
                this.executeProcess = exec(this.EXECUTE_COMMANDS.replace(/{fileName}/g, fileName), { cwd: this.cwd });
                this.executeProcess.stdout.on("data", (data) => {
                    this.outputChannel.append(data);
                });
                this.executeProcess.stderr.on("data", (data) => {
                    this.outputChannel.append(data);
                });
                this.executeProcess.on("close", (executeCode) => {
                    this.isRunning = false;
                    const endTime = new Date();
                    const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
                    this.outputChannel.appendLine(`[Done] exit with code=${executeCode} in ${elapsedTime} seconds`);
                    this.outputChannel.appendLine("");
                });
            }
            else {
                this.isRunning = false;
                this.outputChannel.appendLine(`[Compile Failed]`);
                this.outputChannel.appendLine("");
            }
        });
    }
    stopCommand() {
        if (this.isRunning) {
            this.isRunning = false;
            const kill = require("tree-kill");
            if (this.isCompiling) {
                this.isCompiling = false;
                kill(this.compileProcess.pid);
            }
            else {
                kill(this.executeProcess.pid);
            }
        }
    }
    dispose() {
        this.stopCommand();
    }
}
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map