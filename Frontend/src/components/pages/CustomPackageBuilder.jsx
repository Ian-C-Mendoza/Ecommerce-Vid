import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  ArrowLeft,
  Video,
  Clock,
  CheckCircle2,
  Sparkles,
  Calculator,
} from "lucide-react";

export function CustomPackageBuilder({ onBack, onSelectService }) {
  const [videoCount, setVideoCount] = useState("");
  const [duration, setDuration] = useState("");
  const [plan, setPlan] = useState("one-time");
  const MIN_VIDEOS = 16;

  const durationOptions = [
    { label: "30 sec – 1 min", price: 55, icon: "" },
    { label: "1 min – 1:30", price: 60, icon: "" },
    { label: "1 min – 2 min", price: 70, icon: "" },
    { label: "2 min – 3 min", price: 85, icon: "" },
    { label: "3 min – 5 min", price: 110, icon: "" },
  ];

  const selectedDuration = durationOptions.find((d) => d.label === duration);
  const totalPrice =
    videoCount && selectedDuration
      ? Number(videoCount) * selectedDuration.price
      : 0;

  const allVideos = [
    "/core/copy_A16D6D2D-5182-4F56-A501-E0A9B7FF7B40.mp4",
    "/core/DITL 3 LOCO.mp4",
    "/core/Get up trend.mp4",
    "/core/HELEN CLOSING.mp4",
    "/assets/CLOSING 2.mp4",
    "/plus/BUYER VS REALTOR.mp4",
    "/plus/REAL ESTATE MYTHS.mp4",
    "/assets/PROPERTY TOUR 2 (2).mp4",
    "/assets/CLOSING 1.mp4",
    "/pro/copy_99F97E53-770F-49C0-8F89-D254E182CBAE.mp4",
    "/pro/copy_A019C072-F8F5-4D1A-9ADB-EA5D770D41B8.mp4",
    "/pro/copy_BAE8B05A-A0A6-41DC-982B-88086669495B.mp4",
    "/assets/PROPERTY TOUR 1.mp4",
    "/assets/COMPANY EDIT.mp4",
    "/elite/copy_2C207727-1080-4757-8D8A-DCB1BA4BFC2C.mp4",
    "/elite/copy_43EEC12D-13C5-4A72-8B59-C3489EB1BD3C.mp4",
    "/elite/Vacation Introductory VO.mp4",
  ];

  const handleContinue = () => {
    if (!videoCount || !duration) return;

    const customService = {
      id: `custom-${Date.now()}`,
      key: "custom-package",
      title: "Custom Video Package",
      description:
        "A fully personalized package tailored to your content needs.",
      plan,
      price: totalPrice,
      duration: selectedDuration.label,
      features: [
        `${videoCount} videos per ${plan === "monthly" ? "month" : "order"}`,
        `Video duration: ${selectedDuration.label}`,
        "Fully customized content package",
        "Professional editing",
      ],
      videos: allVideos,
      thumbnail: "/custom-package.png",
      addons: [],
      stripeMonthlyPriceId: null,
      customPackage: {
        title: "Custom Video Package",
        price: totalPrice,
        duration: selectedDuration.label,
        videoCount: Number(videoCount),
        videos: allVideos,
      },
    };

    onSelectService(customService);
  };

  return (
    <div className="relative min-h-screen bg-transparent dark:bg-gray-900">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#FAF7F0] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-gray-900" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:bg-gradient-to-r dark:from-purple-700/20 dark:to-blue-700/20 rounded-full border border-gray-300 dark:border-gray-600">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            <span className="text-sm text-gray-800 dark:text-gray-200">
              Custom Package Builder
            </span>
          </div>
          <h1 className="text-4xl mb-3 text-foreground dark:text-white">
            Create Your Perfect Package
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Design a video package that fits your exact needs. Choose your video
            count and duration for a personalized quote.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Video Count */}
          <Card className="border border-gray-300/50 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground dark:text-white">
                  Number of Videos
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
                  How many videos do you need?
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor="video-count"
                  className="text-base text-foreground dark:text-white"
                >
                  Video Count
                </Label>

                <Input
                  id="video-count"
                  type="number"
                  value={videoCount}
                  min={MIN_VIDEOS}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (Number.isNaN(value)) {
                      setVideoCount("");
                      return;
                    }

                    setVideoCount(value);
                  }}
                  placeholder="Minimum of 16 videos"
                  className="h-12 text-lg border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder-gray-400 focus:ring-2 focus:ring-primary/50"
                />

                {/* Validation message */}
                {videoCount !== "" && videoCount < MIN_VIDEOS && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2">
                    <span>⚠️</span>
                    Minimum of {MIN_VIDEOS} videos or Higher is required.
                  </p>
                )}

                {/* Success message */}
                {videoCount >= MIN_VIDEOS && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {videoCount} videos selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Duration */}
          <Card className="border border-gray-300/50 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground dark:text-white">
                  Video Duration
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
                  Select the average length of each video
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setDuration(option.label)}
                    className={`p-4 rounded-xl border-2 transition-all text-left shadow-sm ${
                      duration === option.label
                        ? "border-blue-500 bg-blue-50 dark:bg-gray-700 text-foreground dark:text-white shadow-md"
                        : "border-gray-300/50 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md text-foreground dark:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            ${option.price} per video
                          </p>
                        </div>
                      </div>
                      {duration === option.label && (
                        <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border border-gray-300/50 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-xl shadow-lg overflow-hidden">
            <CardHeader className="relative">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground dark:text-white">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                Package Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              {!videoCount || !duration ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                  </div>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Fill in the details to see your custom pricing
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {videoCount && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 dark:bg-gray-700 shadow-sm border border-gray-300/50 dark:border-gray-600">
                        <Video className="w-5 h-5 text-blue-600 dark:text-blue-300 mt-0.5" />
                        <div className="flex-1 text-foreground dark:text-white">
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            Videos
                          </p>
                          <p className="font-semibold">
                            {videoCount} videos
                            {plan === "monthly" && " / month"}
                          </p>
                        </div>
                      </div>
                    )}
                    {duration && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10 dark:bg-gray-700 shadow-sm border border-gray-300/50 dark:border-gray-600">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-300 mt-0.5" />
                        <div className="flex-1 text-foreground dark:text-white">
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            Duration
                          </p>
                          <p className="font-semibold">{duration}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            ${selectedDuration?.price} per video
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total Price */}
                  <div className="pt-4 border-t border-gray-300/50 dark:border-gray-600">
                    <div className="space-y-2 mb-4 flex justify-between text-sm text-foreground dark:text-white">
                      <span className="text-muted-foreground dark:text-gray-300">
                        Calculation
                      </span>
                      <span>
                        {videoCount} × ${selectedDuration?.price}
                      </span>
                    </div>

                    {/* Total Price Card */}
                    <div className="p-4 rounded-xl shadow-md bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-700 dark:to-purple-700 text-foreground dark:text-white">
                      <p className="text-sm opacity-90 mb-1">
                        {plan === "monthly" ? "Monthly Total" : "Total Price"}
                      </p>
                      <p className="text-3xl font-bold">
                        ${totalPrice.toLocaleString()}
                      </p>
                      {plan === "monthly" && (
                        <p className="text-xs opacity-75 mt-1">
                          Billed monthly
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-gradient-primary hover:from-blue-700 btn-hover-primary text-white shadow-lg"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!duration || Number(videoCount) < 16}
                  >
                    Continue to Review
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
