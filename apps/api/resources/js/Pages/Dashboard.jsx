import AnimatedCard from '@/Components/AnimatedCard';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentHalls }) {
    const statItems = [
        { label: 'Surveys', value: stats.surveys },
        { label: 'Games', value: stats.games },
        { label: 'Active Games', value: stats.activeGames },
        { label: 'Halls', value: stats.halls },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Control Room"
                    title="Family Feud SaaS Dashboard"
                    subtitle="Manage surveys, game rounds, and live halls with real-time status from one place."
                />
            }
        >
            <Head title="Dashboard" />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statItems.map((item, index) => (
                    <AnimatedCard key={item.label} delay={index * 0.06}>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            {item.label}
                        </p>
                        <p className="mt-3 font-display text-3xl text-slate-900">
                            {item.value}
                        </p>
                    </AnimatedCard>
                ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <AnimatedCard className="overflow-hidden" delay={0.12}>
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg text-slate-900">
                            Recent Halls
                        </h2>
                        <Link
                            href={route('games.index')}
                            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                        >
                            Manage Games
                        </Link>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="pb-2 font-medium">Hall</th>
                                    <th className="pb-2 font-medium">Game</th>
                                    <th className="pb-2 font-medium">Status</th>
                                    <th className="pb-2 font-medium">Join PIN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentHalls.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-5 text-slate-500"
                                        >
                                            No halls created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentHalls.map((hall) => (
                                        <tr key={hall.id}>
                                            <td className="py-3 font-medium text-slate-800">
                                                {hall.unique_slug}
                                            </td>
                                            <td className="py-3 text-slate-600">
                                                {hall.game?.title ?? 'Game unavailable'}
                                            </td>
                                            <td className="py-3">
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                    {hall.status}
                                                </span>
                                            </td>
                                            <td className="py-3 font-display text-slate-900">
                                                {hall.join_code}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.18}>
                    <h2 className="font-display text-lg text-slate-900">
                        Next Actions
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <p>
                            1. Build a survey with answers totaling exactly 100
                            responses.
                        </p>
                        <p>
                            2. Create a game and configure rounds/multipliers.
                        </p>
                        <p>
                            3. Launch a hall, share the 6-digit PIN, and start
                            buzzing in real time.
                        </p>
                    </div>
                </AnimatedCard>
            </section>
        </AuthenticatedLayout>
    );
}
