"use client"
import { useEffect, useState, useRef, Suspense, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"

import LyricsRenderer from "@/components/lyrics-renderer"
import { parseLrc, type Lyrics } from "@/lib/lyrics"
import { analyzePrompt } from "@/prompts/analyze"
import { languageLearningPrompt } from "@/prompts/language-learning"
import { AIAnalysis } from "@/components/ai-analysis"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NavMenu } from "@/components/nav-menu"
import { Provider } from "@/components/provider-selector"
import { useLyrics } from "@/hooks/use-api"
import { Player, type PlayerRef } from "@/components/player"
import { Button } from "@/components/ui/button"
import { Copy, Download, ExternalLink } from "lucide-react"

function formatTime(t: number) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [provider, setProvider] = useState<Provider>("tencent")
  const [inputValue, setInputValue] = useState("")
  const [currentTime, setCurrentTime] = useState(0)
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4o-mini")
  const [copiedPlayer, setCopiedPlayer] = useState(false)
  const [copiedCard, setCopiedCard] = useState(false)
  const [copiedImage, setCopiedImage] = useState(false)
  const playerRef = useRef<PlayerRef>(null)

  // URL Params -> Hook Params
  const urlProvider = (searchParams.get("provider") as Provider)
  const urlId = searchParams.get("id")

  // The hook should drive the data
  // Only query if both are present in URL (or we want to trigger from input too? Design decision: URL drives query to allow sharing)
  // Actually original code synced local state with URL.

  // Use a separate state to "trigger" the query?
  // Or just use the URL params as the source of truth for the Query.
  // The input value is local state for editing.

  const { data: lyricsData, isLoading: loading, error: lyricErrorObject } = useLyrics(urlId || "", urlProvider || "tencent")
  const lyricError = lyricErrorObject ? (lyricErrorObject as Error).message : ""

  const lyrics: Lyrics | null = useMemo(() => {
    if (!lyricsData) return null
    return parseLrc(lyricsData.lrc || "", lyricsData.tlyric || "")
  }, [lyricsData])

  const coverUrl = lyricsData?.coverUrl || ""
  const songInfo = lyricsData?.songInfo || {
    name: '',
    artist: [],
    album: ''
  }

  // Sync local state with URL params
  useEffect(() => {
    if (urlProvider) setProvider(urlProvider)
    if (urlId) setInputValue(urlId)
  }, [urlProvider, urlId])

  // Load AI settings from localStorage
  useEffect(() => {
    const u = localStorage.getItem("ai_base_url")
    const k = localStorage.getItem("ai_api_key")
    const m = localStorage.getItem("ai_model")
    if (u) setBaseUrl(u)
    if (k) setApiKey(k)
    if (m) setModel(m)
  }, [])



  const plainText = useMemo(() => {
    if (!lyrics) return ""
    return lyrics.lines.map((l) => {
      const timeStr = l.time != null ? `[${formatTime(l.time)}]` : ""
      return `${timeStr}${l.text}`
    }).join("\n")
  }, [lyrics])


  // Wrapped fetchLyrics is no longer needed as a standalone async function for data fetching
  // But we need a handler for the "Get Lyrics" button
  function handleFetchLyrics() {
    // Just push to URL, the hook detects change and fetches
    if (!inputValue) return
    const params = new URLSearchParams(searchParams)
    params.set("id", inputValue)
    params.set("provider", provider)
    router.push(`/?${params.toString()}`)
  }

  // Handler for copying player embed code
  function handleCopyPlayer() {
    if (!urlId || !urlProvider) return
    const embedCode = `<iframe height="81px" width="100%" src="${window.location.origin}/embed/${urlProvider}/${urlId}"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setCopiedPlayer(true)
    setTimeout(() => setCopiedPlayer(false), 2000)
  }

  // Handler for copying card embed code
  function handleCopyCard() {
    if (!urlId || !urlProvider) return
    const embedCode = `<iframe height="81px" width="100%" src="${window.location.origin}/card/${urlProvider}/${urlId}"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setCopiedCard(true)
    setTimeout(() => setCopiedCard(false), 2000)
  }

  // Handler for copying image URL
  function handleCopyImageUrl() {
    if (!urlId || !urlProvider) return
    const imageUrl = `${window.location.origin}/card/${urlProvider}/${urlId}/image`
    navigator.clipboard.writeText(imageUrl)
    setCopiedImage(true)
    setTimeout(() => setCopiedImage(false), 2000)
  }

  // Handler for downloading image
  async function handleDownloadImage() {
    if (!urlId || !urlProvider) return
    const imageUrl = `${window.location.origin}/card/${urlProvider}/${urlId}/image`
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${songInfo.name || 'song'}-card.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }


  return (
    <div className="flex h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-4xl h-full py-6 md:py-10 px-4 md:px-6">
        <NavMenu />

        <PageHeader
          title="播放器"
          provider={provider}
          setProvider={setProvider}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder="输入歌曲链接或 ID..."
          actionLabel="加载歌曲"
          onAction={handleFetchLyrics}
          loading={loading}
        />
        {lyricError && (
          <p className="mt-2 text-sm text-red-600 mb-4">{lyricError}</p>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Card Actions */}
          {urlId && urlProvider && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPlayer}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedPlayer ? "已复制播放器代码" : "复制播放器代码"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedCard ? "已复制卡片代码" : "复制卡片代码"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyImageUrl}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {copiedImage ? "已复制图片链接" : "复制图片链接"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadImage}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载卡片图片
              </Button>
            </div>
          )}

          {lyrics && (
            <div className="grid grid-cols-1 gap-6 mt-6">
              <div className="space-y-4">
                {/* {coverUrl && songInfo && ( */}
                <Player
                  ref={playerRef}
                  id={urlId || inputValue}
                  provider={provider}
                  coverUrl={coverUrl}
                  songInfo={songInfo}
                  onTimeUpdate={setCurrentTime}
                />
                {/* )} */}

                <LyricsRenderer
                  lyrics={lyrics}
                  currentTime={currentTime}
                  showTimestamp={false}
                  coverUrl={coverUrl}
                  onSeek={(time) => playerRef.current?.seek(time)}
                />
              </div>
              <div>
                <Tabs defaultValue="appreciation" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="appreciation">AI 赏析</TabsTrigger>
                    <TabsTrigger value="learning">语言学习</TabsTrigger>
                  </TabsList>
                  <TabsContent value="appreciation" className="mt-4">
                    <AIAnalysis
                      lyrics={lyrics}
                      plainText={plainText}
                      songInfo={songInfo}
                      urlId={urlId || inputValue}
                      urlProvider={urlProvider || provider}
                      provider={provider}
                      model={model}
                      baseUrl={baseUrl}
                      apiKey={apiKey}
                      title="音乐赏析"
                      promptGenerator={analyzePrompt}
                      cacheKeyPrefix="analysis"
                      systemPrompt="你是一位资深乐评人"
                    />
                  </TabsContent>
                  <TabsContent value="learning" className="mt-4">
                    <AIAnalysis
                      lyrics={lyrics}
                      plainText={plainText}
                      songInfo={songInfo}
                      urlId={urlId || inputValue}
                      urlProvider={urlProvider || provider}
                      provider={provider}
                      model={model}
                      baseUrl={baseUrl}
                      apiKey={apiKey}
                      title="语言学习分析"
                      promptGenerator={languageLearningPrompt}
                      cacheKeyPrefix="language_learning"
                      systemPrompt="你是一位资深的语言学习专家"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {!lyrics && (
            <p className="mt-6 text-sm text-zinc-600">请输入歌曲链接或 ID，然后点击获取歌词。</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
