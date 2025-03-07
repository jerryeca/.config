"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("./commands");
const commands = new commands_1.Commands();
function activate(context) {
    const run = vscode.commands.registerCommand("verilog.run", (fileUri) => {
        commands.executeCommand(fileUri);
    });
    const stop = vscode.commands.registerCommand("verilog.stop", () => {
        commands.stopCommand();
    });
    context.subscriptions.push(run);
    context.subscriptions.push(commands);
}
exports.activate = activate;
function deactivate() {
    commands.stopCommand();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map