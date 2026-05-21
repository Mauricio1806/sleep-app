declare module 'react-native-sound' {
  class Sound {
    static setCategory(category: string, mixWithOthers?: boolean): void;
    static MAIN_BUNDLE: string;
    static DOCUMENT: string;
    static LIBRARY: string;
    static CACHES: string;
    constructor(
      filename: string,
      basePath: string,
      onLoad?: (error: Error | null) => void,
    );
    play(onEnd?: (success: boolean) => void): void;
    pause(cb?: () => void): void;
    stop(cb?: () => void): void;
    release(): void;
    setNumberOfLoops(loops: number): void;
    setVolume(value: number): void;
    isLoaded(): boolean;
    isPlaying(): boolean;
    getDuration(): number;
  }
  export default Sound;
}
