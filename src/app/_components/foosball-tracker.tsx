"use client";

import { useState } from "react";
import { Trophy, AlertCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function FoosballTracker() {
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [score1, setScore1] = useState("");
    const [score2, setScore2] = useState("");
    const [error, setError] = useState("");

    const utils = api.useUtils();


    const { data: matches } = api.match.getAll.useQuery(undefined, {
        refetchOnMount: false, // Since we're prefetching on the server
    });

    const { data: playerStats } = api.match.getStats.useQuery(undefined, {
        refetchOnMount: false,
    });

    const createMatch = api.match.create.useMutation({
        onSuccess: async () => {
            setPlayer1("");
            setPlayer2("");
            setScore1("");
            setScore2("");
            setError("");
            await utils.match.getAll.invalidate();
            await utils.match.getStats.invalidate();
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleSubmit = () => {
        if (!player1 || !player2 || !score1 || !score2) return;

        createMatch.mutate({
            player1,
            player2,
            score1: parseInt(score1),
            score2: parseInt(score2),
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6" />
                        Foosball Score Tracker
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <Input
                                placeholder="Player 1 Name"
                                value={player1}
                                onChange={(e) => setPlayer1(e.target.value)}
                                className="mb-2"
                                disabled={createMatch.isLoading}
                            />
                            <Input
                                type="number"
                                placeholder="Score"
                                value={score1}
                                onChange={(e) => setScore1(e.target.value)}
                                min="0"
                                disabled={createMatch.isLoading}
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Player 2 Name"
                                value={player2}
                                onChange={(e) => setPlayer2(e.target.value)}
                                className="mb-2"
                                disabled={createMatch.isLoading}
                            />
                            <Input
                                type="number"
                                placeholder="Score"
                                value={score2}
                                onChange={(e) => setScore2(e.target.value)}
                                min="0"
                                disabled={createMatch.isLoading}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={
                            createMatch.isLoading || !player1 || !player2 || !score1 || !score2
                        }
                    >
                        {createMatch.isLoading ? "Recording..." : "Record Match"}
                    </Button>
                </CardContent>
            </Card>

            {/* Player Stats */}
            {playerStats?.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Player Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {playerStats.map((stats) => (
                                <div key={stats.player} className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-lg mb-2">{stats.player}</h3>
                                    <p>Matches: {stats.matches}</p>
                                    <p>Wins: {stats.wins}</p>
                                    <p>Win Rate: {stats.winRate.toFixed(1)}%</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Match History */}
            {matches?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Match History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {matches.map((match) => (
                                <div key={match.id} className="p-4 border rounded-lg">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="font-bold">{match.player1}</div>
                                        <div className="text-lg font-bold">
                                            {match.score1} - {match.score2}
                                        </div>
                                        <div className="font-bold">{match.player2}</div>
                                    </div>
                                    <div className="text-sm text-gray-500 text-center mt-2">
                                        {match.timestamp.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
