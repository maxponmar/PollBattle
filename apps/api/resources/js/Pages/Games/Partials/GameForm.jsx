import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

const defaultRound = { survey_id: '', multiplier: 1, round_order: 1 };

export default function GameForm({ surveys }) {
    const form = useForm({
        title: '',
        configuration_json: {
            rounds: 4,
            fast_money_enabled: true,
        },
        rounds: [defaultRound],
    });

    const setRound = (index, key, value) => {
        form.setData(
            'rounds',
            form.data.rounds.map((round, roundIndex) =>
                roundIndex === index
                    ? {
                          ...round,
                          [key]: Number(value),
                      }
                    : round,
            ),
        );
    };

    const addRound = () => {
        const nextRoundOrder = form.data.rounds.length + 1;

        form.setData('rounds', [
            ...form.data.rounds,
            {
                ...defaultRound,
                round_order: nextRoundOrder,
            },
        ]);
    };

    const removeRound = (index) => {
        if (form.data.rounds.length <= 1) {
            return;
        }

        const nextRounds = form.data.rounds
            .filter((_, roundIndex) => roundIndex !== index)
            .map((round, roundIndex) => ({
                ...round,
                round_order: roundIndex + 1,
            }));

        form.setData('rounds', nextRounds);
    };

    const submit = (event) => {
        event.preventDefault();
        form.post(route('games.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="panel p-5">
                <label className="block text-sm font-medium text-slate-700">
                    Game Title
                </label>
                <TextInput
                    value={form.data.title}
                    onChange={(event) =>
                        form.setData('title', event.target.value)
                    }
                    className="mt-2 block w-full"
                    placeholder="Friday Church League Finals"
                />
                <InputError className="mt-2" message={form.errors.title} />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm text-slate-700">
                        Base Rounds
                        <TextInput
                            type="number"
                            min="1"
                            max="8"
                            className="mt-1 block w-full"
                            value={form.data.configuration_json.rounds}
                            onChange={(event) =>
                                form.setData('configuration_json', {
                                    ...form.data.configuration_json,
                                    rounds: Number(event.target.value),
                                })
                            }
                        />
                    </label>

                    <label className="inline-flex items-center gap-2 pt-7 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={
                                form.data.configuration_json.fast_money_enabled
                            }
                            onChange={(event) =>
                                form.setData('configuration_json', {
                                    ...form.data.configuration_json,
                                    fast_money_enabled:
                                        event.target.checked,
                                })
                            }
                            className="rounded border-slate-300"
                        />
                        Fast Money Enabled
                    </label>
                </div>
            </div>

            <div className="panel p-5">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-slate-900">
                        Round Configuration
                    </h2>
                    <button
                        type="button"
                        onClick={addRound}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                        Add Round
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {form.data.rounds.map((round, index) => (
                        <div
                            key={`round-${index}`}
                            className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_120px_120px_90px]"
                        >
                            <select
                                className="rounded-md border-slate-300 text-sm"
                                value={round.survey_id}
                                onChange={(event) =>
                                    setRound(
                                        index,
                                        'survey_id',
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">Select survey</option>
                                {surveys.map((survey) => (
                                    <option key={survey.id} value={survey.id}>
                                        {survey.question}
                                    </option>
                                ))}
                            </select>

                            <TextInput
                                type="number"
                                min="1"
                                max="5"
                                value={round.multiplier}
                                onChange={(event) =>
                                    setRound(
                                        index,
                                        'multiplier',
                                        event.target.value,
                                    )
                                }
                            />

                            <TextInput
                                type="number"
                                min="1"
                                max="10"
                                value={round.round_order}
                                onChange={(event) =>
                                    setRound(
                                        index,
                                        'round_order',
                                        event.target.value,
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={() => removeRound(index)}
                                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <InputError className="mt-2" message={form.errors.rounds} />
            </div>

            <PrimaryButton disabled={form.processing}>Create Game</PrimaryButton>
        </form>
    );
}
