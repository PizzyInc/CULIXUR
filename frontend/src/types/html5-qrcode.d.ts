declare module 'html5-qrcode' {
    export class Html5QrcodeScanner {
        constructor(elementId: string, config: any, verbose: boolean);
        render(onSuccess: (decodedText: string, result: any) => void, onFailure: (error: any) => void): void;
        clear(): Promise<void>;
    }
    export class Html5Qrcode {
        constructor(elementId: string, verbose?: boolean);
        start(
            cameraIdOrConfig: any,
            configuration: any,
            qrCodeSuccessCallback: (decodedText: string, result: any) => void,
            qrCodeErrorCallback: (error: any) => void
        ): Promise<void>;
        stop(): Promise<void>;
        clear(): void;
    }
}
