import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        hasNext,
        hasPrevious,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious, 
    } = useContext(PlayerContext);

    useEffect(() => {
        if(!audioRef.current) return;
        
        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />

                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button 
                        type="button" 
                        onClick={playPrevious} 
                        disabled={!episode || !hasPrevious}
                    >
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        { isPlaying 
                            ? <img src="/pause.svg" alt="Pausar" />
                            : <img src="/play.svg" alt="Tocar" /> }
                    </button>

                    <button 
                        type="button" 
                        onClick={playNext}
                        disabled={!episode || !hasNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button> 

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repitir" />
                    </button>
                </div>
            </footer>
        </div>
    );
};