import React from "react";
import { Metadata } from "next";
import LobbyingClient from "./LobbyingClient";

export const metadata: Metadata = {
    title: "Kashmir Legislative Lobbying | KHCRF",
    description:
        "Join KHCRF in shaping artisan futures. Our legislative lobby works to implement policies that protect Kashmir's heritage and secure sustainable livelihoods for artisans.",
};

export default function LobbyingPage() {
    return <LobbyingClient />;
}
