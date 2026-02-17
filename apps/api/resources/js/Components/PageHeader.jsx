export default function PageHeader({ eyebrow, title, subtitle }) {
    return (
        <div className="space-y-3">
            {eyebrow && <span className="pill">{eyebrow}</span>}
            <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
