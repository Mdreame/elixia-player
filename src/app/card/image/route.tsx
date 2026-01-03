import { NextRequest, NextResponse } from "next/server";
import { parseMusicUrl } from "@/lib/music-url";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const width = searchParams.get("width") || "1200";

    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const info = parseMusicUrl(url);
    if (!info) {
        return NextResponse.json({ error: "Invalid music URL" }, { status: 400 });
    }

    const targetUrl = new URL(`/card/${info.provider}/${info.id}/image`, request.url);
    targetUrl.searchParams.set("width", width);

    return NextResponse.redirect(targetUrl);
}
