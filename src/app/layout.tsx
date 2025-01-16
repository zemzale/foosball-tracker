import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
    title: "Foosball Tracker",
    description: "Track your foosball matches and statistics",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <TRPCReactProvider>
                    {children}
                </TRPCReactProvider>
            </body>
        </html>
    );
}
