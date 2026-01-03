import { redirect } from "next/navigation";
import { parseMusicUrl } from "@/lib/music-url";

export default async function CardRootPage({
    searchParams,
}: {
    searchParams: Promise<{ url?: string }>;
}) {
    const { url } = await searchParams;

    if (url) {
        const info = parseMusicUrl(url);
        if (info) {
            redirect(`/card/${info.provider}/${info.id}`);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white font-sans">
            <h1 className="text-2xl font-bold mb-4">{url ? "无效的链接" : "歌曲卡片"}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md">
                {url
                    ? "抱歉，我们无法解析您提供的链接。请确保它是来自支持平台（网易云、QQ音乐、酷狗、酷我、百度）的有效歌曲链接。"
                    : "请在 URL 参数中提供歌曲链接，例如："}
            </p>
            <code className="mt-4 p-2 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 break-all text-sm">
                /card?url=https://music.163.com/song?id=610149
            </code>
        </div>
    );
}
