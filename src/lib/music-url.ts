import { Provider } from "@/components/provider-selector";

export interface MusicUrlInfo {
    provider: Provider;
    id: string;
}

export function parseMusicUrl(url: string): MusicUrlInfo | null {
    try {
        const u = new URL(url);

        // Netease
        if (u.hostname.includes("music.163.com")) {
            const id = u.searchParams.get("id");
            if (id) return { provider: "netease", id };
            if (u.hash) {
                const m = u.hash.match(/id=(\d+)/);
                if (m) return { provider: "netease", id: m[1] };
            }
        }

        // Tencent
        if (u.hostname.includes("y.qq.com")) {
            const path = u.pathname;
            const m = path.match(/songDetail\/(\w+)/);
            if (m) return { provider: "tencent", id: m[1] };
            const songmid = u.searchParams.get("songmid");
            if (songmid) return { provider: "tencent", id: songmid };
        }

        // Kugou
        if (u.hostname.includes("kugou.com")) {
            const hash = u.searchParams.get("hash");
            if (hash) return { provider: "kugou", id: hash };
        }

        // Kuwo
        if (u.hostname.includes("kuwo.cn")) {
            const m = u.pathname.match(/play_detail\/(\d+)/);
            if (m) return { provider: "kuwo", id: m[1] };
        }

        // Baidu
        if (u.hostname.includes("taihe.com")) {
            const m = u.pathname.match(/song\/(\d+)/);
            if (m) return { provider: "baidu", id: m[1] };
        }

        return null;
    } catch {
        return null;
    }
}
