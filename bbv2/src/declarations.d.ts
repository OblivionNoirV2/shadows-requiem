//makes the audio files work
declare module "*.wav" {
    const src: string;
    export default src;
}


declare module "*.mp3" {
    const src: string;
    export default src;
}