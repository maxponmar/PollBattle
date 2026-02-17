import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';

const highlights = [
    {
        title: 'Survey Engine',
        description:
            'Create answer sets that total 100 responses for automatic point scoring.',
    },
    {
        title: 'Game State Machine',
        description:
            'Run Face-Off, Active Rounds, strikes, steals, and Fast Money with atomic transitions.',
    },
    {
        title: 'Hall System',
        description:
            'Share a URL and 6-digit PIN for anonymous players to join teams and buzz live.',
    },
];

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <>
            <Head title="FamilyFraud" />

            <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-15%,rgba(249,115,22,0.45),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.4),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(15,23,42,0.98))]" />

                <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-orange-500 font-display text-sm font-bold text-white">
                            FF
                        </span>
                        <span className="font-display text-lg text-white">
                            FamilyFraud
                        </span>
                    </div>

                    <nav className="flex items-center gap-2 text-sm">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full bg-white px-4 py-2 font-semibold text-slate-900"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full border border-white/20 px-4 py-2 text-white"
                                    >
                                        Log In
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white"
                                    >
                                        Start Free
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="max-w-3xl"
                    >
                        <span className="inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200">
                            Laravel 12 + Inertia React + Motion
                        </span>
                        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Real-Time Family Feud SaaS for Communities and Teams
                        </h1>
                        <p className="mt-5 text-base text-slate-200 sm:text-lg">
                            Launch multiplayer halls, animate answer reveals, and
                            synchronize gameplay over websockets with sub-second
                            updates.
                        </p>
                    </motion.div>

                    <section className="mt-10 grid gap-4 md:grid-cols-3">
                        {highlights.map((highlight, index) => (
                            <motion.article
                                key={highlight.title}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.35,
                                    delay: 0.1 + index * 0.08,
                                }}
                                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                            >
                                <h2 className="font-display text-xl text-white">
                                    {highlight.title}
                                </h2>
                                <p className="mt-3 text-sm text-slate-200">
                                    {highlight.description}
                                </p>
                            </motion.article>
                        ))}
                    </section>
                </main>
            </div>
        </>
    );
}
