import { lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
// Lazy load Spline component
const Spline = lazy(() => import("@splinetool/react-spline"));
export default function SplineRobot() {
    const { theme } = useTheme();
    return (
        <div
            className="relative w-full h-[550px] sm:h-[600px] md:h-[550px] flex items-center justify-center overflow-visible -mx-4 sm:mx-0"
            style={{ touchAction: 'none' }}
        >
            <div
                className="w-full h-full scale-75 sm:scale-85 md:scale-100 origin-center"
                style={{ touchAction: 'none', pointerEvents: 'auto' }}
            >
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                            Loading 3D Model...
                        </div>
                    }
                >
                    <Spline
                        scene="https://prod.spline.design/p6PbWoZkUWP8-WWq/scene.splinecode"
                        style={{
                            width: "100%",
                            height: "100%",
                            touchAction: 'none',
                            pointerEvents: 'auto'
                        }}
                        onLoad={(spline) => {
                            setTimeout(() => {
                                const logo = document.querySelector('#spline-badge');
                                if (logo) logo.style.display = 'none';

                                // Fallback for newer Spline versions or different structures
                                const allLinks = document.querySelectorAll('a[href^="https://spline.design"]');
                                allLinks.forEach(link => {
                                    link.style.display = 'none';
                                });
                            }, 500); // Small delay to ensure render
                        }}
                    />
                </Suspense>
            </div>
        </div>
    );
}
