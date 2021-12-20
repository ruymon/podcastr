import { createContext, ReactNode, useState } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying : boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
};

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider ({ children } : PlayerContextProviderProps) {
    const [ episodeList, setEpisodeList ] = useState([]);
    const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
    const [ isPlaying, setIsPlaying ] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([ episode ]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    };

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    };

    function togglePlay() {
        setIsPlaying(!isPlaying);
    };

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    };

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                isPlaying, 
                play, 
                togglePlay,
                playList, 
                setPlayingState 
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
