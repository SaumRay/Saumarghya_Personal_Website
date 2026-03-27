import { useEffect, useState, useRef } from "react";
import { API_BASE } from "@/hooks/use-admin-auth";
import { Play, Pause, Music2, Video, ChevronLeft, ChevronRight } from "lucide-react";

interface MusicVideo {
  _id: string;
  title: string;
  description: string;
  instagramUrl: string;
  order: number;
}

interface AudioTrack {
  _id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
}

function InstagramEmbed({ url }: { url: string }) {
  const getPostId = (url: string) => {
    const match = url.match(/\/(p|reel|tv)\/([^/?]+)/);
    return match ? match[2] : null;
  };

  const postId = getPostId(url);
  if (!postId) return <div className="text-white/40 text-sm p-4">Invalid URL</div>;

  return (
    <div className="w-full flex justify-center">
      <iframe
        src={`https://www.instagram.com/p/${postId}/embed/`}
        className="rounded-xl border border-white/10"
        style={{ width: "100%", maxWidth: 400, minHeight: 480, background: "transparent" }}
        frameBorder="0"
        scrolling="no"
        allowTransparency
      />
    </div>
  );
}

function AudioPlayer({ track, isActive, onPlay }: {
  track: AudioTrack;
  isActive: boolean;
  onPlay: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (!isActive && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [isActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      onPlay();
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setProgress(dur ? (cur / dur) * 100 : 0);
    setCurrentTime(formatTime(cur));
    setDuration(formatTime(dur));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isActive
        ? "border-primary/50 bg-primary/5"
        : "border-white/10 bg-white/5 hover:bg-white/8"
    }`}>
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            playing
              ? "bg-primary text-background"
              : "bg-white/10 text-white hover:bg-primary/20"
          }`}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{track.title}</p>
          {track.description && (
            <p className="text-white/50 text-xs truncate mt-0.5">{track.description}</p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <div
              className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/40 text-xs tabular-nums">
              {currentTime} / {duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Music() {
  const [tab, setTab] = useState<"videos" | "audio">("videos");
  const [videos, setVideos] = useState<MusicVideo[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/api/music/videos`).then(r => r.json()),
      fetch(`${API_BASE}/api/music/audio`).then(r => r.json()),
    ]).then(([vd, ad]) => {
      if (vd.success) setVideos(vd.data || []);
      if (ad.success) setTracks(ad.data || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">Vocal Music</h1>
          <p className="text-foreground/50 text-sm">Original recordings & performances</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setTab("videos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              tab === "videos"
                ? "bg-primary text-background font-medium"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" /> Videos
          </button>
          <button
            onClick={() => setTab("audio")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              tab === "audio"
                ? "bg-primary text-background font-medium"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Music2 className="w-4 h-4" /> Audio
          </button>
        </div>

        {loading && <div className="text-foreground/40 text-sm">Loading...</div>}

        {/* Videos Tab */}
        {!loading && tab === "videos" && (
          <div>
            {videos.length === 0 ? (
              <div className="text-foreground/40 text-sm p-8 text-center border border-white/10 rounded-2xl">
                No videos added yet.
              </div>
            ) : (
              <div>
                <InstagramEmbed url={videos[videoIndex].instagramUrl} />
                <div className="mt-4">
                  <h2 className="text-white font-semibold">{videos[videoIndex].title}</h2>
                  {videos[videoIndex].description && (
                    <p className="text-white/50 text-sm mt-1">{videos[videoIndex].description}</p>
                  )}
                </div>

                {videos.length > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setVideoIndex(i => Math.max(0, i - 1))}
                      disabled={videoIndex === 0}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-white/30 text-xs">{videoIndex + 1} / {videos.length}</span>
                    <button
                      onClick={() => setVideoIndex(i => Math.min(videos.length - 1, i + 1))}
                      disabled={videoIndex === videos.length - 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Thumbnails */}
                {videos.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                    {videos.map((v, i) => (
                      <button
                        key={v._id}
                        onClick={() => setVideoIndex(i)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          i === videoIndex
                            ? "border-primary/50 text-primary bg-primary/10"
                            : "border-white/10 text-white/40 hover:text-white"
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Audio Tab */}
        {!loading && tab === "audio" && (
          <div className="space-y-3">
            {tracks.length === 0 ? (
              <div className="text-foreground/40 text-sm p-8 text-center border border-white/10 rounded-2xl">
                No audio tracks added yet.
              </div>
            ) : (
              tracks.map(track => (
                <AudioPlayer
                  key={track._id}
                  track={track}
                  isActive={activeTrack === track._id}
                  onPlay={() => setActiveTrack(track._id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}