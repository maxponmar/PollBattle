import AnimatedCard from '@/Components/AnimatedCard';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function SurveyIndex({ surveys }) {
    const deleteSurvey = (surveyId) => {
        if (!window.confirm('Delete this survey?')) {
            return;
        }

        router.delete(route('surveys.destroy', surveyId));
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Survey Engine"
                    title="Survey Library"
                    subtitle="Each survey must total exactly 100 responses to be eligible for game rounds."
                />
            }
        >
            <Head title="Surveys" />

            <AnimatedCard className="overflow-hidden">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-slate-900">
                        Surveys
                    </h2>
                    <Link
                        href={route('surveys.create')}
                        className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                        New Survey
                    </Link>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="pb-2 font-medium">Question</th>
                                <th className="pb-2 font-medium">Answers</th>
                                <th className="pb-2 font-medium">Responses</th>
                                <th className="pb-2 font-medium">Flags</th>
                                <th className="pb-2 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {surveys.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-5 text-slate-500">
                                        No surveys yet. Create your first one.
                                    </td>
                                </tr>
                            ) : (
                                surveys.map((survey) => (
                                    <tr key={survey.id}>
                                        <td className="py-3 text-slate-800">
                                            {survey.question}
                                        </td>
                                        <td className="py-3 text-slate-600">
                                            {survey.answers_count}
                                        </td>
                                        <td className="py-3 font-display text-slate-900">
                                            {survey.total_responses ?? 0}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {survey.is_public && (
                                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                                                        Public
                                                    </span>
                                                )}
                                                {survey.approved && (
                                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                        Approved
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route(
                                                        'surveys.edit',
                                                        survey.id,
                                                    )}
                                                    className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteSurvey(survey.id)
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
