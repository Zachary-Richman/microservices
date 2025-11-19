export interface LoggerInterface{
    timestamp: string;
    level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";
    message: string;
    meta: any;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    stackTrace: string;
}

export const LoggerConfig = {
    export: "",
    api_route: "#"
    
}