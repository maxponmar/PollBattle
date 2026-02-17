import AnimatedCard from '@/Components/AnimatedCard';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function HallShow({ hall }) {
    const resetBuzz = () => {
        router.post(route('halls.buzz.reset', hall.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Hall System"
                    title={`Hall ${hall.unique_slug}`}
                    subtitle="Monitor teams, active players, and buzz events in real time."
                />
            }
        >
            <Head title={`Hall ${hall.unique_slug}`} />

            <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <AnimatedCard>
                    <h2 className="font-display text-lg text-slate-900">
                        Hall Details
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="panel-muted p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Join URL
                            </p>
                            <p className="mt-2 break-all text-sm text-slate-800">
                                {`${window.location.origin}${route('halls.join.show', hall.unique_slug, false)}`}
                            </p>
                        </div>
                        <div className="panel-muted p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Join PIN
                            </p>
                            <p className="mt-2 font-display text-2xl text-slate-900">
                                {hall.join_code}
                            </p>
                        </div>
                        <div className="panel-muted p-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Game
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-800">
                                {hall.game.title}
                            </p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard>
                    <h2 className="font-display text-lg text-slate-900">Teams</h2>
                    <div className="mt-4 space-y-3">
                        {hall.teams.map((team) => (
                            <div
                                key={team.id}
                                className="panel-muted flex items-center justify-between p-3"
                            >
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {team.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Players: {team.players.length}
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-900 px-3 py-1 font-display text-xs text-white">
                                    {team.score}
                                </span>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </section>

            <section className="mt-6">
                <AnimatedCard className="overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg text-slate-900">
                            Buzz Feed
                        </h2>
                        <button
                            type="button"
                            onClick={resetBuzz}
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700"
                        >
                            Reset Buzz Lock
                        </button>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="pb-2 font-medium">Time</th>
                                    <th className="pb-2 font-medium">Player</th>
                                    <th className="pb-2 font-medium">Team</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {hall.buzz_events.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="py-5 text-slate-500"
                                        >
                                            No buzz events yet.
                                        </td>
                                    </tr>
                                ) : (
                                    hall.buzz_events.map((buzzEvent) => (
                                        <tr key={buzzEvent.id}>
                                            <td className="py-3 font-display text-slate-700">
                                                {new Date(
                                                    buzzEvent.occurred_at,
                                                ).toLocaleTimeString()}
                                            </td>
                                            <td className="py-3 text-slate-800">
                                                {buzzEvent.player?.nickname ??
                                                    'Unknown'}
                                            </td>
                                            <td className="py-3 text-slate-600">
                                                {buzzEvent.player?.team?.name ?? '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AnimatedCard>
            </section>
        </AuthenticatedLayout>
    );
}
