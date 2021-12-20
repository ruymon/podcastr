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
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
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

    const hasNext = (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext() {
        if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        };
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        };
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                isPlaying, 
                play, 
                togglePlay,
                playList, 
                playNext,
                hasNext,
                playPrevious,
                hasPrevious,
                setPlayingState,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}