//makes the audio files work
declare module "*.wav" {
    const src: string;
    export default src;
}


declare module "*.mp3" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const value: any;
    export = value;
}

declare module "*.jpg" {
    const value: any;
    export = value;
}

declare module "*.gif" {
    const value: any;
    export = value;
}

// And so on for any other file types...
declare module "*.png" {
    const value: any;
    export = value;
}
