"use client";

import { useParams } from "next/navigation";
import { IframePlayer } from "@/components/iframe-player";
import { useLyrics } from "@/hooks/use-api";
import { Provider } from "@/components/provider-selector";
import { Loader2 } from "lucide-react";

export default function EmbedPage() {
    const params = useParams();
    const provider = params.provider as Provider;
    const id = params.id as string;

    // We use useLyrics to get coverUrl and songInfo
    const { data: lyricsData, isLoading, error } = useLyrics(id, provider);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black/95 text-white">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
            </div>
        );
    }

    if (error || !lyricsData) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-red-400 p-4 text-center text-sm font-medium">
                <p>无法加载歌曲信息</p>
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
            <IframePlayer
                id={id}
                provider={provider}
                coverUrl={coverUrl || ""}
                songInfo={safeSongInfo}
            />
        </div>
    );
}
