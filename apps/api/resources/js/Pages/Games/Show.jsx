import AnimatedCard from '@/Components/AnimatedCard';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function GameShow({ game, stateOptions }) {
    const [nextState, setNextState] = useState(game.status);

    const createHall = () => {
        router.post(route('halls.store', game.id));
    };

    const transition = (event) => {
        event.preventDefault();
        router.post(route('games.transition', game.id), {
            to_state: nextState,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Game Engine"
                    title={game.title}
                    subtitle="Control the game state machine, inspect rounds, and launch joinable halls."
                />
            }
        >
            <Head title={game.title} />

            <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                <AnimatedCard className="overflow-hidden">
                    <h2 className="font-display text-lg text-slate-900">
                        Round Plan
                    </h2>
                    <div className="mt-4 space-y-3">
                        {game.rounds.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No rounds configured.
                            </p>
                        ) : (
                            game.rounds.map((round) => (
                                <div
                                    key={round.id}
                                    className="panel-muted flex flex-wrap items-center justify-between gap-3 p-3"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            Round {round.round_order}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {round.survey?.question}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                                        x{round.multiplier}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </AnimatedCard>

                <AnimatedCard>
                    <h2 className="font-display text-lg text-slate-900">
                        State Machine
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Current state:
                        <span className="ml-1 rounded-full bg-slate-100 px-2 py-1 font-display text-xs uppercase tracking-wide text-slate-700">
                            {game.status}
                        </span>
                    </p>

                    <form onSubmit={transition} className="mt-4 space-y-3">
                        <select
                            className="block w-full rounded-md border-slate-300 text-sm"
                            value={nextState}
                            onChange={(event) =>
                                setNextState(event.target.value)
                            }
                        >
                            {stateOptions.map((stateOption) => (
                                <option key={stateOption} value={stateOption}>
                                    {stateOption}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                        >
                            Transition State
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={createHall}
                        className="mt-4 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                        Launch Hall
                    </button>
                </AnimatedCard>
            </section>

            <section className="mt-6">
                <AnimatedCard className="overflow-hidden">
                    <h2 className="font-display text-lg text-slate-900">
                        Linked Halls
                    </h2>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="pb-2 font-medium">Slug</th>
                                    <th className="pb-2 font-medium">PIN</th>
                                    <th className="pb-2 font-medium">Status</th>
                                    <th className="pb-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {game.halls.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-5 text-slate-500"
                                        >
                                            No halls launched yet.
                                        </td>
                                    </tr>
                                ) : (
                                    game.halls.map((hall) => (
                                        <tr key={hall.id}>
                                            <td className="py-3 text-slate-800">
                                                {hall.unique_slug}
                                            </td>
                                            <td className="py-3 font-display text-slate-900">
                                                {hall.join_code}
                                            </td>
                                            <td className="py-3 text-slate-600">
                                                {hall.status}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route(
                                                            'halls.show',
                                                            hall.id,
                                                        )}
                                                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
                                                    >
                                                        Host View
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            'halls.join.show',
                                                            hall.unique_slug,
                                                        )}
                                                        className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700"
                                                    >
                                                        Join View
                                                    </Link>
                                                </div>
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
