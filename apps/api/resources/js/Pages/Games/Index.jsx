import AnimatedCard from '@/Components/AnimatedCard';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function GameIndex({ games }) {
    const deleteGame = (gameId) => {
        if (!window.confirm('Delete this game?')) {
            return;
        }

        router.delete(route('games.destroy', gameId));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Game Engine"
                    title="Game Sessions"
                    subtitle="Create rounds, configure multipliers, and orchestrate real-time gameplay from this control board."
                />
            }
        >
            <Head title="Games" />

            <AnimatedCard className="overflow-hidden">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-slate-900">Games</h2>
                    <Link
                        href={route('games.create')}
                        className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                        New Game
                    </Link>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="pb-2 font-medium">Title</th>
                                <th className="pb-2 font-medium">State</th>
                                <th className="pb-2 font-medium">Rounds</th>
                                <th className="pb-2 font-medium">Halls</th>
                                <th className="pb-2 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {games.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-5 text-slate-500">
                                        No games yet. Create a game to start.
                                    </td>
                                </tr>
                            ) : (
                                games.map((game) => (
                                    <tr key={game.id}>
                                        <td className="py-3 text-slate-800">
                                            {game.title}
                                        </td>
                                        <td className="py-3">
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                {game.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-slate-600">
                                            {game.rounds_count}
                                        </td>
                                        <td className="py-3 text-slate-600">
                                            {game.halls_count}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route(
                                                        'games.show',
                                                        game.id,
                                                    )}
                                                    className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    Open
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteGame(game.id)
                                                    }
                                                    className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </AnimatedCard>
        </AuthenticatedLayout>
    );
}
