export default interface BuildFinishInput {
    buildId: string,
    duration: number;
    success: boolean,
    buildLog: string
}
