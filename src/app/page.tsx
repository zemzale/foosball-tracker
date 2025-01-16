import { FoosballTracker } from "~/app/_components/foosball-tracker";
import { api } from "~/trpc/server";

export default async function Home() {
    // Pre-fetch data on the server
    await api.match.getAll.prefetch();
    await api.match.getStats.prefetch();

    return (
        <main className="min-h-screen p-4">
            <FoosballTracker />
        </main>
    );
}
