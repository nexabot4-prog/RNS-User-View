import React, { useState, useEffect } from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { reviewsAPI, projectsAPI } from "../utils/api";

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // 1. Get Top/Popular Projects first (to match Popular Projects section)
                const featuredProjects = await projectsAPI.getFeatured(12);

                let data = [];
                if (featuredProjects && featuredProjects.length > 0) {
                    const projectIds = featuredProjects.map(p => p.id);
                    // 2. Get reviews specifically for these projects
                    data = await reviewsAPI.getReviewsForProjects(projectIds);
                }

                // FALLBACK: If specific projects have no reviews, fetch ANY top reviews
                if (!data || data.length === 0) {
                    console.log("No reviews for popular projects, fetching global top reviews...");
                    data = await reviewsAPI.getTopReviews();
                }

                if (data && data.length > 0) {
                    // Define avatar images
                    const avatarImages = [
                        "/assets/avatars/boy1.png",
                        "/assets/avatars/boy2.png",
                        "/assets/avatars/boy3.png",
                        "/assets/avatars/boy4.png"
                    ];

                    // Map database reviews to AnimatedTestimonials format
                    // Expected format: { quote, name, designation, src }
                    const mappedReviews = data.map((review, idx) => ({
                        quote: review.comment,
                        name: review.user_name || "Verified Customer",
                        designation: "Verified Purchase",
                        src: avatarImages[idx % avatarImages.length]
                    }));
                    setReviews(mappedReviews);
                }
            } catch (error) {
                console.error("Error fetching reviews in CustomerReviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return null;

    return (
        <section className="py-20 w-full bg-white dark:bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-16 tracking-tight">
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Technophiles</span>
                </h2>
                {reviews.length > 0 ? (
                    <AnimatedTestimonials testimonials={reviews} autoplay={true} />
                ) : (
                    <p className="text-gray-500">Be the first to leave a review!</p>
                )}
            </div>
        </section>
    );
}

export default CustomerReviews;
