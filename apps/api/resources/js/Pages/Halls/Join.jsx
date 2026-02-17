import { Head, useForm } from '@inertiajs/react';
import { motion } from 'motion/react';

export default function HallJoin({ hall }) {
    const form = useForm({
        nickname: '',
        join_code: hall.join_code,
        team_id: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('halls.join', hall.unique_slug));
    };

    return (
        <>
            <Head title={`Join ${hall.unique_slug}`} />

            <div className="relative min-h-screen bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-20%,rgba(249,115,22,0.35),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.25),transparent_40%)]" />

                <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="w-full rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur"
                    >
                        <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200">
                            Hall Join
                        </span>
                        <h1 className="mt-4 font-display text-3xl font-bold text-white">
                            {hall.game?.title}
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Enter nickname and team to join. Hall slug:
                            <span className="ml-1 font-display text-orange-300">
                                {hall.unique_slug}
                            </span>
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <label className="block text-sm text-slate-200">
                                Nickname
                                <input
                                    value={form.data.nickname}
                                    onChange={(event) =>
                                        form.setData(
                                            'nickname',
                                            event.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-slate-100"
                                    placeholder="Captain Max"
                                />
                            </label>

                            <label className="block text-sm text-slate-200">
                                Join Code
                                <input
                                    value={form.data.join_code}
                                    onChange={(event) =>
                                        form.setData(
                                            'join_code',
                                            event.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 font-display text-slate-100"
                                />
                            </label>

                            <label className="block text-sm text-slate-200">
                                Team
                                <select
                                    value={form.data.team_id}
                                    onChange={(event) =>
                                        form.setData(
                                            'team_id',
                                            event.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-950 text-slate-100"
                                >
                                    <option value="">No team yet</option>
                                    {hall.teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {form.errors.nickname && (
                                <p className="text-sm text-rose-300">
                                    {form.errors.nickname}
                                </p>
                            )}
                            {form.errors.join_code && (
                                <p className="text-sm text-rose-300">
                                    {form.errors.join_code}
                                </p>
                            )}
                            {form.errors.team_id && (
                                <p className="text-sm text-rose-300">
                                    {form.errors.team_id}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
                            >
                                Join Hall
                            </button>
                        </form>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
