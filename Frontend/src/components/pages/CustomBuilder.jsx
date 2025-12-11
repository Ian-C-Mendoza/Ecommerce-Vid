import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus } from "lucide-react";

export function CustomBuilder({ onBuild }) {
  return (
    <Card
      className="
        cursor-pointer relative flex flex-col h-full 
        transition-all duration-300 
        surface-elevated border border-white/20 
        rounded-xl
        hover:scale-105 hover:shadow-xl
      "
    >
      <CardHeader className="text-center pb-4 flex-shrink-0">
        <div className="mx-auto mb-4">
          <div
            className="
              w-16 h-16 flex items-center justify-center 
              rounded-lg bg-white/10 
              border border-white/20
              shadow-sm
            "
          >
            <Plus className="w-8 h-8 text-primary" />
          </div>
        </div>

        <CardTitle className="text-lg sm:text-xl">
          Create Custom Package
        </CardTitle>

        <p className="text-muted-foreground text-xs sm:text-sm h-10 flex items-center justify-center">
          Build your own plan with full flexibility
        </p>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="text-xs text-muted-foreground leading-tight text-center px-4">
          Choose number of videos, duration, add-ons, and delivery preferences.
        </div>

        <button
          onClick={onBuild} // Trigger the form
          className="
            w-full mt-4 transition-all duration-300 
            btn-hover-secondary border border-white/20 rounded-md py-2
          "
        >
          Get Started
        </button>

        <div className="text-center pt-2 border-t border-white/20 mt-3">
          <p className="text-xs text-muted-foreground">✓ Fully customizable</p>
        </div>
      </CardContent>
    </Card>
  );
}
