"use client";

import { useParams } from "next/navigation";
import { SongCard } from "@/components/song-card";
import { useLyrics } from "@/hooks/use-api";
import { Provider } from "@/components/provider-selector";
import { Loader2 } from "lucide-react";

export default function CardPage() {
    const params = useParams();
    const provider = params.provider as Provider;
    const id = params.id as string;

    // We use useLyrics to get coverUrl and songInfo
    const { data: lyricsData, isLoading, error } = useLyrics(id, provider);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-transparent">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (error || !lyricsData) {
        const safeSongInfo = {
            name: "无法加载",
            artist: ["未知"],
            album: "",
        };
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent p-0">
                <SongCard
                    id={id}
                    provider={provider}
                    coverUrl=""
                    songInfo={safeSongInfo}
                />
            </div>
        );
    }

    const { coverUrl, songInfo } = lyricsData;

    // Fallback for songInfo if missing
    const safeSongInfo = songInfo || {
        name: "未知歌曲",
        artist: ["未知艺术家"],
        album: "未知专辑",
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-0">
            <SongCard
                id={id}
                provider={provider}
                coverUrl={coverUrl || ""}
                songInfo={safeSongInfo}
            />
        </div>
    );
}
