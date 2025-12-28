import React, { useState } from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { AnimatedTooltipPreview } from "./AnimatedTooltipPreview";

export function BrandingShowcase() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="h-auto min-h-[10rem] md:min-h-[15rem] py-4 md:py-10 flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
            <p className={`text-sm md:text-base font-bold mb-2 text-center md:-translate-x-16 transition-all duration-300 ${isHovered ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-blue-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                The core team of RNS — two minds, one vision.
            </p>
            <div className="w-full md:-translate-x-16">
                <AnimatedTooltipPreview />
            </div>
            <div className="h-[10rem] md:h-[20rem] flex items-center justify-center w-full -mt-10 md:-mt-20">
                <TextHoverEffect text="RNS.." onHoverChange={setIsHovered} />
            </div>
        </div>
    );
}
