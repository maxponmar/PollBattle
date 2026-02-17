import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GameForm from '@/Pages/Games/Partials/GameForm';
import { Head } from '@inertiajs/react';

export default function GameCreate({ surveys }) {
    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    eyebrow="Game Engine"
                    title="Create Game"
                    subtitle="Assemble surveys into ordered rounds and configure your live session defaults."
                />
            }
        >
            <Head title="Create Game" />

            <GameForm surveys={surveys} />
        </AuthenticatedLayout>
    );
}
