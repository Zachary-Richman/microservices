import path from "node:path"
import { LoggerInterface } from "../logger/config"

export default class Logger{
    constructor(){}

    // pass in the error object
    public error(err: Error, message: string | void): LoggerInterface{
        const stack_trace = this.get_stack_trace(err);
        const {col, row} = this.get_col_row(err) ? this.get_col_row(err) : {col: -1, row: -1};
        const filename = this.get_filename()

        const log: LoggerInterface = {
            timestamp: new Date().toISOString(),
            level: "ERROR",
            message: message ? message : "No message provided",
            meta: err,
            fileName: filename,
            lineNumber: row,
            columnNumber: col,
            stackTrace: stack_trace
        }

        return log;
    }

    private get_filename(): string {return path.basename(__filename)}
    
    private get_col_row(err: Error): string | {col: number, row: number}{
        let lineNumber: number = -1;
        let columnNumber: number = -1;

        if(!err.stack) return "No stack trace available"
        
        const match = err.stack.match(/(\w+:\/\/[^\s]+|at [^\s]+ \()?(?:([^\s:]+):(\d+):(\d+)|<anonymous>:(\d+):(\d+))/);
        if (match) {
            lineNumber = Number(match[3] || match[5]); 
            columnNumber = Number(match[4] || match[6]); 
        }

        return {col: columnNumber, row: lineNumber}
    }
    
    private get_stack_trace(err: Error): string {return err.stack ? err.stack : "No stack trace available"}
}