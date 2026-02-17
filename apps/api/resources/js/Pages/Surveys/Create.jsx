import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SurveyForm from '@/Pages/Surveys/Partials/SurveyForm';
import { Head } from '@inertiajs/react';

export default function SurveyCreate() {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Survey Engine"
                    title="Create Survey"
                    subtitle="Build answer sets that sum to 100 so game scoring is automatic."
                />
            }
        >
            <Head title="Create Survey" />

            <SurveyForm
                submitRoute={route('surveys.store')}
                submitLabel="Create Survey"
            />
        </AuthenticatedLayout>
    );
}
