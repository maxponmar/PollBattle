import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SurveyForm from '@/Pages/Surveys/Partials/SurveyForm';
import { Head } from '@inertiajs/react';

export default function SurveyEdit({ survey }) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Survey Engine"
                    title="Edit Survey"
                    subtitle="Update answers and keep the total at exactly 100 responses."
                />
            }
        >
            <Head title="Edit Survey" />

            <SurveyForm
                survey={survey}
                submitRoute={route('surveys.update', survey.id)}
                method="patch"
                submitLabel="Save Changes"
            />
        </AuthenticatedLayout>
    );
}
