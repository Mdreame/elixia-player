"use client";

import { Provider } from "@/components/provider-selector";
import { ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";

interface SongCardProps {
    id: string;
    provider: Provider;
    coverUrl: string;
    songInfo: {
        name: string;
        artist: string[];
        album: string;
    };
}

export function SongCard({ id, provider, coverUrl, songInfo }: SongCardProps) {
    // Construct the destination URL
    // Assuming the main app is hosted at the root or we use a relative path
    const href = `/?provider=${provider}&id=${id}`;

    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full overflow-hidden rounded-xl bg-zinc-900 border border-white/10 shadow-xl font-sans text-white group select-none hover:border-white/20 transition-all duration-300 hover:shadow-2xl"
        >
            {/* Dynamic Background */}
            <div
                className="absolute inset-0 opacity-30 bg-cover bg-center blur-xl transition-all duration-700 group-hover:opacity-40"
                style={{ backgroundImage: `url(${coverUrl || "/placeholder.svg"})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative p-3 flex items-center gap-4 h-20 md:h-24">

                {/* Cover Art */}
                <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={coverUrl || "/placeholder.svg"}
                        alt={songInfo.name}
                        className="w-full h-full object-cover rounded-lg shadow-lg ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="w-8 h-8 text-white/90 drop-shadow-md" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 pr-2">
                            <h3 className="font-bold text-base md:text-lg truncate leading-tight group-hover:text-amber-100 transition-colors" title={songInfo.name}>
                                {songInfo.name}
                            </h3>
                            <p className="text-xs md:text-sm text-white/60 truncate group-hover:text-white/80 transition-colors" title={songInfo.artist.join(" / ")}>
                                {songInfo.artist.join(" / ")}
                            </p>
                            <p className="text-xs text-white/40 truncate mt-0.5" title={songInfo.album}>
                                {songInfo.album}
                            </p>
                        </div>

                        <div className="shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
                            <ExternalLink className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Helper text overlay on hover ?? Maybe too cluttered. Let's keep it clean. */}
        </Link>
    );
}
