import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const matchRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.match.findMany({
            orderBy: { timestamp: "desc" },
        });
    }),

    create: publicProcedure
        .input(
            z.object({
                player1: z.string().min(1),
                player2: z.string().min(1),
                score1: z.number().min(0),
                score2: z.number().min(0),
                team1: z.enum(["red", "blue"]),
                team2: z.enum(["red", "blue"]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.match.create({
                data: input,
            });
        }),

    getStats: publicProcedure.query(async ({ ctx }) => {
        const matches = await ctx.db.match.findMany();

        const playerStats = new Map<
            string,
            { matches: number; wins: number; winRate: number }
        >();

        matches.forEach((match) => {
            // Process player1
            const player1Stats = playerStats.get(match.player1) ?? {
                matches: 0,
                wins: 0,
                winRate: 0,
            };
            player1Stats.matches++;
            if (match.score1 > match.score2) player1Stats.wins++;
            player1Stats.winRate = (player1Stats.wins / player1Stats.matches) * 100;
            playerStats.set(match.player1, player1Stats);

            // Process player2
            const player2Stats = playerStats.get(match.player2) ?? {
                matches: 0,
                wins: 0,
                winRate: 0,
            };
            player2Stats.matches++;
            if (match.score2 > match.score1) player2Stats.wins++;
            player2Stats.winRate = (player2Stats.wins / player2Stats.matches) * 100;
            playerStats.set(match.player2, player2Stats);
        });

        return Array.from(playerStats.entries()).map(([player, stats]) => ({
            player,
            ...stats,
        }));
    }),
});
