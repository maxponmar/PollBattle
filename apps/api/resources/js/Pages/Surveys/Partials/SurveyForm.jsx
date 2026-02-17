import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useMemo } from 'react';

const defaultAnswer = { answer: '', frequency: 0 };

export default function SurveyForm({
    survey = null,
    submitRoute,
    method = 'post',
    submitLabel,
}) {
    const form = useForm({
        question: survey?.question ?? '',
        is_public: Boolean(survey?.is_public),
        approved: Boolean(survey?.approved),
        answers:
            survey?.answers?.map((answer) => ({
                answer: answer.answer,
                frequency: answer.frequency,
            })) ?? [defaultAnswer],
    });

    const totalResponses = useMemo(() => {
        return form.data.answers.reduce(
            (sum, answer) => sum + (Number(answer.frequency) || 0),
            0,
        );
    }, [form.data.answers]);

    const setAnswerValue = (index, key, value) => {
        form.setData(
            'answers',
            form.data.answers.map((answer, answerIndex) =>
                answerIndex === index
                    ? {
                          ...answer,
                          [key]: key === 'frequency' ? Number(value) : value,
                      }
                    : answer,
            ),
        );
    };

    const addAnswer = () => {
        form.setData('answers', [...form.data.answers, { ...defaultAnswer }]);
    };

    const removeAnswer = (index) => {
        if (form.data.answers.length <= 1) {
            return;
        }

        form.setData(
            'answers',
            form.data.answers.filter((_, answerIndex) => answerIndex !== index),
        );
    };

    const submit = (event) => {
        event.preventDefault();

        form[method](submitRoute);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="panel p-5">
                <label className="block text-sm font-medium text-slate-700">
                    Survey Question
                </label>
                <TextInput
                    className="mt-2 block w-full"
                    value={form.data.question}
                    onChange={(event) =>
                        form.setData('question', event.target.value)
                    }
                    placeholder="Name something people forget before traveling"
                />
                <InputError className="mt-2" message={form.errors.question} />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_public}
                            onChange={(event) =>
                                form.setData('is_public', event.target.checked)
                            }
                            className="rounded border-slate-300"
                        />
                        Public Survey
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={form.data.approved}
                            onChange={(event) =>
                                form.setData('approved', event.target.checked)
                            }
                            className="rounded border-slate-300"
                        />
                        Approved for Gameplay
                    </label>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel p-5"
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-slate-900">
                        Answers ({totalResponses}/100)
                    </h2>
                    <button
                        type="button"
                        onClick={addAnswer}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                        Add Answer
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {form.data.answers.map((answer, index) => (
                        <div
                            key={`${index}-${answer.answer}`}
                            className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_110px_90px]"
                        >
                            <TextInput
                                value={answer.answer}
                                placeholder={`Answer #${index + 1}`}
                                onChange={(event) =>
                                    setAnswerValue(
                                        index,
                                        'answer',
                                        event.target.value,
                                    )
                                }
                            />

                            <TextInput
                                type="number"
                                min="0"
                                max="100"
                                value={answer.frequency}
                                onChange={(event) =>
                                    setAnswerValue(
                                        index,
                                        'frequency',
                                        event.target.value,
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={() => removeAnswer(index)}
                                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <InputError className="mt-2" message={form.errors.answers} />
            </motion.div>

            <PrimaryButton disabled={form.processing}>{submitLabel}</PrimaryButton>
        </form>
    );
}
