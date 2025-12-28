import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const people = [
    {
        id: 1,
        name: "Sharan Kumar Reddy",
        designation: "Founder",
        image:
            "/assets/avatars/team_member_1.png",
    },
    {
        id: 2,
        name: "Nithin Reddy",
        designation: "Founder",
        image:
            "/assets/avatars/team_member_2.png",
    },
    {
        id: 3,
        name: "S",
        designation: "Core Team",
        image:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 4,
        name: "Emily Davis",
        designation: "UX Designer",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
        id: 5,
        name: "Tyler Durden",
        designation: "Soap Developer",
        image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
        id: 6,
        name: "Dora",
        designation: "The Explorer",
        image:
            "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
];

export function AnimatedTooltipPreview() {
    return (
        <div className="flex flex-row items-center justify-center w-full z-20">
            <AnimatedTooltip items={people.slice(0, 2)} />
        </div>
    );
}
