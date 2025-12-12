import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // or your own navigation

export function CustomPackageBuilder({ onBack, onSelectService }) {
  const [videoCount, setVideoCount] = useState("");
  const [duration, setDuration] = useState("");
  const [plan, setPlan] = useState("one-time");

  const durationOptions = [
    { label: "30 sec – 1 min", price: 55 },
    { label: "1 min – 1:30", price: 60 },
    { label: "1 min – 2 min", price: 70 },
    { label: "2 min – 3 min", price: 85 },
    { label: "3 min – 5 min", price: 110 },
  ];

  const selectedDuration = durationOptions.find((d) => d.label === duration);

  const totalPrice =
    videoCount && selectedDuration
      ? Number(videoCount) * selectedDuration.price
      : 0;

  const handleContinue = () => {
    if (!videoCount || !duration) return;

    const customService = {
      id: `custom-${Date.now()}`, // unique ID
      key: "custom-package",
      title: "Custom Video Package",
      description:
        "A fully personalized package tailored to your content needs.",
      plan, // 'one-time' or 'monthly'
      price: totalPrice,
      duration: selectedDuration.label,
      features: [
        `${videoCount} videos per ${plan === "monthly" ? "month" : "order"}`,
        `Video duration: ${selectedDuration.label}`,
        "Fully customized content package",
        "Professional editing",
      ],
      videos: [
        //CORE
        "/core/copy_A16D6D2D-5182-4F56-A501-E0A9B7FF7B40.mp4",
        "/core/DITL 3 LOCO.mp4",
        "/core/Get up trend.mp4",
        "/core/HELEN CLOSING.mp4",
        //PLUS
        "/assets/CLOSING 2.mp4",
        "/plus/BUYER VS REALTOR.mp4",
        "/plus/REAL ESTATE MYTHS.mp4",
        "/assets/PROPERTY TOUR 2 (2).mp4",
        //PRO
        "/assets/CLOSING 1.mp4",
        "/pro/copy_99F97E53-770F-49C0-8F89-D254E182CBAE.mp4",
        "/pro/copy_A019C072-F8F5-4D1A-9ADB-EA5D770D41B8.mp4",
        "/pro/copy_BAE8B05A-A0A6-41DC-982B-88086669495B.mp4",
        "/assets/PROPERTY TOUR 1.mp4",
        //ELITE
        "/assets/COMPANY EDIT.mp4",
        "/elite/copy_2C207727-1080-4757-8D8A-DCB1BA4BFC2C.mp4",
        "/elite/copy_43EEC12D-13C5-4A72-8B59-C3489EB1BD3C.mp4",
        "/elite/Vacation Introductory VO.mp4",
      ],
      thumbnail: "/custom-package.png",
      addons: [],

      // Stripe integration
      stripeMonthlyPriceId: null, // optional

      // Custom package details for backend & Stripe
      customPackage: {
        title: "Custom Video Package",
        price: totalPrice,
        duration: selectedDuration.label,
        videoCount: Number(videoCount),
        videos: [
          // same video array as above (optional)
        ],
      },
    };

    onSelectService(customService);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Button>

      <Card className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Build Your Custom Package
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* STEP 1 */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              1. How many videos do you need?
            </h3>
            <Input
              type="number"
              value={videoCount}
              min="1"
              onChange={(e) => setVideoCount(e.target.value)}
              placeholder="Example: 20"
            />
          </div>

          {/* STEP 2 */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              2. What is the average duration of your videos?
            </h3>

            <select
              className="w-full p-3 rounded-xl border border-white/10 bg-white/30 dark:bg-black/40"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">Select duration...</option>
              {durationOptions.map((d) => (
                <option key={d.label} value={d.label}>
                  {d.label} — ${d.price}/video
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          {videoCount && duration && (
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-primary/20">
              <h3 className="text-xl font-semibold mb-3">Pricing Summary</h3>
              <p className="text-lg">
                {videoCount} videos × ${selectedDuration?.price} each
              </p>
              <p className="text-2xl font-bold mt-2">Total: ${totalPrice}</p>
            </Card>
          )}

          {/* Continue Button */}
          <Button
            className="w-full bg-gradient-primary text-white mt-6"
            size="lg"
            onClick={handleContinue}
            disabled={!videoCount || !duration}
          >
            Continue to Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
