import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ptBR from 'date-fns/locale/pt-BR';

import { usePlayer } from '../../contexts/PlayerContext';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    publishedAt: string;
    description: string;
    url: string;
};

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { } = usePlayer;

    return (
        <div className={styles.episodeWrapper}>
            <div className={styles.episode}>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>

                    <Image
                        width={700}
                        height={160}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />

                    <button type="button">
                        <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>

                <div 
                    className={styles.description} 
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                />
            </div>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('/episodes', {
        params: {
            _limit: 2,
            _sort: 'publishedAt',
            _order: 'desc',
        }
    });

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id,
            }
        }
    });

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        description: data.description,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy' , { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
      };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // 24 Hours
    };
};