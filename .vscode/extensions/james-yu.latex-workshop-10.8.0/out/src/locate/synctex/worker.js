"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTeXToPDF = syncTeXToPDF;
exports.syncTeXToTeX = syncTeXToTeX;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const iconv = __importStar(require("iconv-lite"));
const path = __importStar(require("path"));
const zlib = __importStar(require("zlib"));
const lw_1 = require("../../lw");
const synctexjs_1 = require("./synctexjs");
const convertfilename_1 = require("../../utils/convertfilename");
const pathnormalize_1 = require("../../utils/pathnormalize");
const logger = lw_1.lw.log('SyncTeX');
class Rectangle {
    constructor({ top, bottom, left, right }) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
    include(rect) {
        return this.left <= rect.left && this.right >= rect.right && this.bottom >= rect.bottom && this.top <= rect.top;
    }
    distanceY(y) {
        return Math.min(Math.abs(this.bottom - y), Math.abs(this.top - y));
    }
    distanceXY(x, y) {
        return Math.sqrt(Math.pow(Math.min(Math.abs(this.bottom - y), Math.abs(this.top - y)), 2) + Math.pow(Math.min(Math.abs(this.left - x), Math.abs(this.right - x)), 2));
    }
    distanceFromCenter(x, y) {
        return Math.sqrt(Math.pow((this.left + this.right) / 2 - x, 2) + Math.pow((this.bottom + this.top) / 2 - y, 2));
    }
}
function getBlocks(linePageBlocks, lineNum) {
    const pageBlocks = linePageBlocks[lineNum];
    const pageNums = Object.keys(pageBlocks);
    if (pageNums.length === 0) {
        logger.log('No page number found.');
        return [];
    }
    const page = pageNums[0];
    return pageBlocks[Number(page)];
}
function toRect(blocks) {
    if (!Array.isArray(blocks)) {
        const block = blocks;
        const top = block.bottom - block.height;
        const bottom = block.bottom;
        const left = block.left;
        const right = block.width ? block.left + block.width : block.left;
        return new Rectangle({ top, bottom, left, right });
    }
    else {
        let cTop = 2e16;
        let cBottom = 0;
        let cLeft = 2e16;
        let cRight = 0;
        for (const b of blocks) {
            // Skip a block if they have boxes inside, or their type is kern or rule.
            // See also https://github.com/jlaurens/synctex/blob/2017/synctex_parser.c#L4655 for types.
            if (b.elements !== undefined || b.type === 'k' || b.type === 'r') {
                continue;
            }
            cBottom = Math.max(b.bottom, cBottom);
            const top = b.bottom - b.height;
            cTop = Math.min(top, cTop);
            cLeft = Math.min(b.left, cLeft);
            if (b.width !== undefined) {
                const right = b.left + b.width;
                cRight = Math.max(right, cRight);
            }
        }
        return new Rectangle({ top: cTop, bottom: cBottom, left: cLeft, right: cRight });
    }
}
async function parseSyncTexForPdf(pdfUri) {
    const filename = path.basename(pdfUri.fsPath, path.extname(pdfUri.fsPath));
    const dir = path.dirname(pdfUri.fsPath);
    const synctexUri = pdfUri.with({ path: path.resolve(dir, filename + '.synctex') });
    const synctexUriGz = synctexUri.with({ path: synctexUri.path + '.gz' });
    if (await lw_1.lw.file.exists(synctexUri)) {
        await vscode.workspace.fs.stat(synctexUri);
        try {
            logger.log(`Parsing .synctex ${synctexUri.toString(true)} .`);
            const s = await lw_1.lw.file.read(synctexUri);
            return (0, synctexjs_1.parseSyncTex)(s ?? '');
        }
        catch (e) {
            logger.logError(`Failed parsing .synctex ${synctexUri.toString(true)}:`, e);
        }
    }
    else if (await lw_1.lw.file.exists(synctexUriGz)) {
        try {
            logger.log(`Parsing .synctex.gz ${synctexUriGz.toString(true)} .`);
            const data = await vscode.workspace.fs.readFile(synctexUriGz);
            const b = zlib.gunzipSync(data);
            const s = b.toString('binary');
            return (0, synctexjs_1.parseSyncTex)(s);
        }
        catch (e) {
            logger.logError(`Failed parsing .synctex.gz ${synctexUriGz.toString(true)}:`, e);
        }
    }
    logger.log(`${synctexUri.toString(true)}, ${synctexUriGz.toString(true)} not found.`);
    return undefined;
}
function findInputFilePathForward(filePath, pdfSyncObject) {
    for (const inputFilePath in pdfSyncObject.blockNumberLine) {
        try {
            if ((0, pathnormalize_1.isSameRealPath)(inputFilePath, filePath)) {
                return inputFilePath;
            }
        }
        catch { }
    }
    for (const inputFilePath in pdfSyncObject.blockNumberLine) {
        for (const enc of convertfilename_1.iconvLiteSupportedEncodings) {
            let convertedInputFilePath = '';
            try {
                convertedInputFilePath = iconv.decode(Buffer.from(inputFilePath, 'binary'), enc);
                if ((0, pathnormalize_1.isSameRealPath)(convertedInputFilePath, filePath)) {
                    return inputFilePath;
                }
            }
            catch { }
        }
    }
    return;
}
async function syncTeXToPDF(line, filePath, pdfUri) {
    const pdfSyncObject = await parseSyncTexForPdf(pdfUri);
    if (!pdfSyncObject) {
        return undefined;
    }
    const inputFilePath = findInputFilePathForward(filePath, pdfSyncObject);
    if (inputFilePath === undefined) {
        logger.log('No relevant entries found.');
        return undefined;
    }
    const linePageBlocks = pdfSyncObject.blockNumberLine[inputFilePath];
    const lineNums = Object.keys(linePageBlocks).map(x => Number(x)).sort((a, b) => { return (a - b); });
    const i = lineNums.findIndex(x => x >= line);
    if (i === 0 || lineNums[i] === line) {
        const l = lineNums[i];
        const blocks = getBlocks(linePageBlocks, l);
        const c = toRect(blocks);
        return { page: blocks[0].page, x: c.left + pdfSyncObject.offset.x, y: c.bottom + pdfSyncObject.offset.y, indicator: true };
    }
    const line0 = lineNums[i - 1];
    const blocks0 = getBlocks(linePageBlocks, line0);
    const c0 = toRect(blocks0);
    const line1 = lineNums[i];
    const blocks1 = getBlocks(linePageBlocks, line1);
    const c1 = toRect(blocks1);
    let bottom;
    if (c0.bottom < c1.bottom) {
        bottom = c0.bottom * (line1 - line) / (line1 - line0) + c1.bottom * (line - line0) / (line1 - line0);
    }
    else {
        bottom = c1.bottom;
    }
    return { page: blocks1[0].page, x: c1.left + pdfSyncObject.offset.x, y: bottom + pdfSyncObject.offset.y, indicator: true };
}
async function syncTeXToTeX(page, x, y, pdfUri) {
    const pdfSyncObject = await parseSyncTexForPdf(pdfUri);
    if (!pdfSyncObject) {
        return undefined;
    }
    const y0 = y - pdfSyncObject.offset.y;
    const x0 = x - pdfSyncObject.offset.x;
    const fileNames = Object.keys(pdfSyncObject.blockNumberLine);
    if (fileNames.length === 0) {
        logger.log('No relevant entries found.');
        return undefined;
    }
    const record = {
        input: '',
        line: 0,
        distanceXY: 2e16,
        distanceFromCenter: 2e16,
        rect: new Rectangle({ top: 0, bottom: 2e16, left: 0, right: 2e16 })
    };
    for (const fileName of fileNames) {
        const linePageBlocks = pdfSyncObject.blockNumberLine[fileName];
        for (const lineNum in linePageBlocks) {
            const pageBlocks = linePageBlocks[Number(lineNum)];
            for (const pageNum in pageBlocks) {
                if (page !== Number(pageNum)) {
                    continue;
                }
                const blocks = pageBlocks[Number(pageNum)];
                for (const block of blocks) {
                    // Skip a block if they have boxes inside, or their type is kern or rule.
                    // See also https://github.com/jlaurens/synctex/blob/c11fe00dbdc6423a0e54d4e531563be645f78679/synctex_parser.c#L4706-L4727 for types.
                    if (block.elements !== undefined || block.type === 'k' || block.type === 'r') {
                        continue;
                    }
                    const rect = toRect(block);
                    const distFromCenter = rect.distanceFromCenter(x0, y0);
                    if (record.rect.include(rect) || (distFromCenter < record.distanceFromCenter && !rect.include(record.rect))) {
                        record.input = fileName;
                        record.line = Number(lineNum);
                        record.distanceFromCenter = distFromCenter;
                        record.rect = rect;
                    }
                }
            }
        }
    }
    if (record.input === '') {
        logger.log('Cannot find any line to jump to.');
        return undefined;
    }
    const input = convInputFilePath(record.input);
    return input ? { input, line: record.line, column: 0 } : undefined;
}
function convInputFilePath(inputFilePath) {
    if (fs.existsSync(inputFilePath)) {
        return inputFilePath;
    }
    for (const enc of convertfilename_1.iconvLiteSupportedEncodings) {
        try {
            const s = iconv.decode(Buffer.from(inputFilePath, 'binary'), enc);
            if (fs.existsSync(s)) {
                return s;
            }
        }
        catch { }
    }
    logger.log(`Non-existent file to jump to ${inputFilePath} .`);
    return undefined;
}
//# sourceMappingURL=worker.js.map