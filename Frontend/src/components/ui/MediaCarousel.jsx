import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

export function MediaCarousel({ items = [] }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  const [isMuted, setIsMuted] = useState({});

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      const selected = api.selectedScrollSnap();
      setCurrent(selected);

      const videos = document.querySelectorAll("video");
      videos.forEach((video) => video.pause());

      const currentVideo = document.getElementById(`video-${selected}`);
      if (currentVideo) {
        currentVideo.play();
        setIsPlaying({ [selected]: true });
        currentVideo.muted = true;
        setIsMuted({ [selected]: true });
      }
    };

    api.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const togglePlay = (index) => {
    const video = document.getElementById(`video-${index}`);
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying({ ...isPlaying, [index]: true });
    } else {
      video.pause();
      setIsPlaying({ ...isPlaying, [index]: false });
    }
  };

  const toggleMute = (index) => {
    const video = document.getElementById(`video-${index}`);
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted({ ...isMuted, [index]: video.muted });
  };

  return (
    <div className="relative w-full group">
      <Carousel
        setApi={setApi}
        className="w-full h-[400px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
        opts={{ loop: true, duration: 30 }}
      >
        <CarouselContent className="-ml-4 h-full">
          {items.map((item, index) => (
            <CarouselItem key={index} className="pl-4 h-full relative">
              {/* Main media wrapper */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg bg-black">
                {item.type === "image" ? (
                  <ImageWithFallback
                    src={item.src}
                    alt={item.alt || `Slide ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                ) : (
                  /* 📌 FIXED VIDEO CONTAINER FOR 9:16 RATIO */
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      id={`video-${index}`}
                      className="w-full h-full object-cover rounded-2xl"
                      loop
                      playsInline
                      muted
                      autoPlay
                      poster={item.thumbnail}
                      onError={(e) => console.error("Video failed:", e)}
                    >
                      <source src={item.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Play / Pause */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <Button
                    size="lg"
                    onClick={() => togglePlay(index)}
                    className="bg-white/90 text-black rounded-full w-16 h-16 p-0 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 ease-out"
                  >
                    {isPlaying[index] ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Mute Button */}
                <Button
                  size="icon"
                  onClick={() => toggleMute(index)}
                  className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-10 h-10 p-0 backdrop-blur-sm shadow-md hover:bg-black/80 hover:scale-110 transition-all duration-300 ease-out"
                >
                  {isMuted[index] ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                {/* Left Arrow */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => api?.scrollPrev()}
                  disabled={!api?.canScrollPrev()}
                  className={cn(
                    "absolute top-1/2 left-4 -translate-y-1/2 z-20",
                    "bg-white/90 text-black rounded-full w-12 h-12 shadow-lg backdrop-blur-sm",
                    "opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:scale-110"
                  )}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                {/* Right Arrow */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => api?.scrollNext()}
                  disabled={!api?.canScrollNext()}
                  className={cn(
                    "absolute top-1/2 right-4 -translate-y-1/2 z-20",
                    "bg-white/90 text-black rounded-full w-12 h-12 shadow-lg backdrop-blur-sm",
                    "opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:scale-110"
                  )}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20 pointer-events-auto">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "rounded-full transition-all duration-300 ease-out hover:scale-125",
              current === index
                ? "w-8 h-2 bg-gradient-primary shadow-md"
                : "w-2 h-2 bg-gray-400 dark:bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  );
}
