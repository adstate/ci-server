export default interface Agent {
    host: string;
    port: number;
    status: string;
    processingBuildId: string | null;
    lastNotify: Date;
}
