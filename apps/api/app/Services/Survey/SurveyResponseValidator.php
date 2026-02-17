<?php

namespace App\Services\Survey;

use InvalidArgumentException;

class SurveyResponseValidator
{
    public function validate(array $answers): void
    {
        $totalResponses = array_sum(array_map(
            static fn (array $answer): int => (int) ($answer['frequency'] ?? 0),
            $answers,
        ));

        if ($totalResponses !== 100) {
            throw new InvalidArgumentException('Survey answers must total exactly 100 responses.');
        }
    }
}
