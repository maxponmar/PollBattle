<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Models\Survey;
use App\Services\Survey\SurveyResponseValidator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class SurveyController extends Controller
{
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantId($request);

        $surveys = Survey::query()
            ->where('tenant_id', $tenantId)
            ->withCount('answers')
            ->withSum('answers as total_responses', 'frequency')
            ->latest()
            ->get();

        return Inertia::render('Surveys/Index', [
            'surveys' => $surveys,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Surveys/Create');
    }

    public function store(StoreSurveyRequest $request, SurveyResponseValidator $validator): RedirectResponse
    {
        $data = $request->validated();
        $tenantId = $this->tenantId($request);

        $answers = $this->normalizeAnswers($data['answers']);

        try {
            $validator->validate($answers);
        } catch (InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'answers' => $exception->getMessage(),
            ]);
        }

        DB::transaction(function () use ($data, $answers, $tenantId): void {
            $survey = Survey::query()->create([
                'tenant_id' => $tenantId,
                'question' => $data['question'],
                'is_public' => (bool) ($data['is_public'] ?? false),
                'approved' => (bool) ($data['approved'] ?? false),
            ]);

            $survey->answers()->createMany($answers);
        });

        return redirect()->route('surveys.index')->with('success', 'Survey created successfully.');
    }

    public function edit(Request $request, Survey $survey): Response
    {
        $this->ensureSurveyTenantAccess($request, $survey);

        $survey->load('answers:id,survey_id,answer,frequency,points');

        return Inertia::render('Surveys/Edit', [
            'survey' => $survey,
        ]);
    }

    public function update(UpdateSurveyRequest $request, Survey $survey, SurveyResponseValidator $validator): RedirectResponse
    {
        $this->ensureSurveyTenantAccess($request, $survey);

        $data = $request->validated();
        $answers = $this->normalizeAnswers($data['answers']);

        try {
            $validator->validate($answers);
        } catch (InvalidArgumentException $exception) {
            throw ValidationException::withMessages([
                'answers' => $exception->getMessage(),
            ]);
        }

        DB::transaction(function () use ($data, $survey, $answers): void {
            $survey->update([
                'question' => $data['question'],
                'is_public' => (bool) ($data['is_public'] ?? false),
                'approved' => (bool) ($data['approved'] ?? false),
            ]);

            $survey->answers()->delete();
            $survey->answers()->createMany($answers);
        });

        return redirect()->route('surveys.index')->with('success', 'Survey updated successfully.');
    }

    public function destroy(Request $request, Survey $survey): RedirectResponse
    {
        $this->ensureSurveyTenantAccess($request, $survey);

        $survey->delete();

        return redirect()->route('surveys.index')->with('success', 'Survey deleted successfully.');
    }

    /**
     * @param  array<int, array<string, mixed>>  $answers
     * @return array<int, array<string, mixed>>
     */
    private function normalizeAnswers(array $answers): array
    {
        return collect($answers)
            ->filter(static fn (array $answer): bool => ! empty($answer['answer']))
            ->values()
            ->map(static fn (array $answer): array => [
                'answer' => (string) $answer['answer'],
                'frequency' => (int) $answer['frequency'],
                'points' => (int) $answer['frequency'],
            ])
            ->all();
    }

    private function ensureSurveyTenantAccess(Request $request, Survey $survey): void
    {
        abort_unless($survey->tenant_id === $request->user()->tenant_id, 404);
    }

    private function tenantId(Request $request): int
    {
        $tenantId = $request->user()->tenant_id;

        abort_if($tenantId === null, 403, 'Authenticated user is not assigned to a tenant.');

        return (int) $tenantId;
    }
}
