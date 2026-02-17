import { Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: 'dashboard', pattern: 'dashboard' },
    { name: 'Surveys', href: 'surveys.index', pattern: 'surveys.*' },
    { name: 'Games', href: 'games.index', pattern: 'games.*' },
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash;
    const [isOpen, setIsOpen] = useState(false);

    const userInitials = useMemo(() => {
        return user.name
            .split(' ')
            .slice(0, 2)
            .map((token) => token[0]?.toUpperCase() ?? '')
            .join('');
    }, [user.name]);

    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-900">
            <div className="ambient-grid pointer-events-none fixed inset-0 opacity-60" />

            <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-3"
                    >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-orange-500 font-display text-sm font-bold text-white shadow-lg shadow-orange-300/50">
                            FF
                        </span>
                        <span className="font-display text-lg font-semibold tracking-tight text-slate-800">
                            FamilyFraud
                        </span>
                    </Link>

                    <div className="hidden items-center gap-6 sm:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={route(item.href)}
                                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                                    route().current(item.pattern)
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                        <Link
                            href={route('profile.edit')}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
                        >
                            {userInitials}
                        </Link>
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Log Out
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen((value) => !value)}
                        className="sm:hidden rounded-md border border-slate-200 bg-white p-2 text-slate-700"
                    >
                        Menu
                    </button>
                </div>

                {isOpen && (
                    <div className="border-t border-slate-200 bg-white p-4 sm:hidden">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                                        route().current(item.pattern)
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href={route('profile.edit')}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Profile
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="w-full rounded-md bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {header && <div className="mb-6">{header}</div>}

                {flash?.success && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {flash.error}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
