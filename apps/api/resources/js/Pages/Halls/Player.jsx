import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';

export default function HallPlayer({ hall, player }) {
    const buzz = () => {
        router.post(route('halls.buzz', hall.id));
    };

    return (
        <>
            <Head title={`Player Board ${hall.unique_slug}`} />

            <div className="relative min-h-screen bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_-10%,rgba(249,115,22,0.33),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.2),transparent_45%)]" />

                <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-6 backdrop-blur"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                    You Joined
                                </span>
                                <h1 className="mt-3 font-display text-3xl text-white">
                                    {hall.game.title}
                                </h1>
                                <p className="mt-1 text-sm text-slate-300">
                                    Player:
                                    <span className="ml-1 font-semibold text-white">
                                        {player.nickname}
                                    </span>
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    Hall PIN
                                </p>
                                <p className="font-display text-2xl text-orange-300">
                                    {hall.join_code}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {hall.teams.map((team) => (
                                <div
                                    key={team.id}
                                    className={`rounded-xl border p-3 ${
                                        team.id === player.team_id
                                            ? 'border-orange-400 bg-orange-500/10'
                                            : 'border-slate-700 bg-slate-950/60'
                                    }`}
                                >
                                    <p className="font-medium text-slate-100">
                                        {team.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Score: {team.score}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={buzz}
                            className="mt-8 flex h-36 w-full items-center justify-center rounded-2xl bg-orange-500 text-3xl font-black uppercase tracking-widest text-white shadow-2xl shadow-orange-500/40"
                        >
                            Buzz
                        </motion.button>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
