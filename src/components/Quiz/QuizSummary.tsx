'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Bebas_Neue } from 'next/font/google'
import { motion } from 'framer-motion'

const bebasNeue = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
})

interface Question {
    id: number
    question: string
    options: string[]
    correct_answer: string
    image: string | null
    category: string
    created_at: string
    updated_at: string
}

interface QuizSummaryData {
    session_id: string
    current_question: number
    score: number
    completed: boolean
    created_at: string
    questions: Question[]
    answer_history: Array<{
        quizId: string
        userAnswer: string
        correctAnswer: string
        correct: boolean
    }>
}

interface QuizSummaryProps {
    id: string
}

export default function QuizSummary({ id }: QuizSummaryProps) {
    const { user, isLoaded } = useUser()
    const [quizSummary, setQuizSummary] = useState<QuizSummaryData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        if (isLoaded && !user) {
            redirect('/sign-in')
        }
    }, [user, isLoaded])

    useEffect(() => {
        const fetchQuizSummary = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/quiz-summary?id=${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz summary')
                }
                const data = await response.json()
                setQuizSummary(data.quizSummary)
            } catch (error) {
                console.error('Failed to fetch quiz summary:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchQuizSummary()
        }
    }, [id])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/quiz-summary?id=${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete quiz')
            }

            window.location.href = '/dashboard'
        } catch (error) {
            console.error('Failed to delete quiz:', error)
            alert('Failed to delete quiz. Please try again.')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='quiz-creation flex min-h-screen flex-col'
        >
            <header className='relative flex w-full justify-center px-6 py-4 text-white'>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='absolute top-10 left-4 md:top-14 md:left-8'
                >
                    <Link href='/dashboard'>
                        <ArrowLeft />
                    </Link>
                </motion.div>
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`${bebasNeue.className} text-7xl font-bold md:text-9xl`}
                >
                    Quiz Summary
                </motion.h1>
            </header>

            <main className='flex-1 p-6'>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='mx-auto max-w-4xl'
                >
                    {loading ? (
                        <div className='flex justify-center py-8'>
                            <div className='h-6 w-6 animate-spin rounded-full border-2 border-pink-500 border-t-transparent'></div>
                        </div>
                    ) : quizSummary ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className='space-y-6'
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className='rounded-md bg-white p-6'
                            >
                                <h2 className='mb-4 text-2xl font-bold text-pink-700'>
                                    Summary
                                </h2>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className='rounded-md bg-pink-50 p-4'
                                    >
                                        <p className='text-sm text-pink-700'>
                                            Date taken
                                        </p>
                                        <p className='font-medium text-gray-800'>
                                            {formatDate(quizSummary.created_at)}
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className='rounded-md bg-pink-50 p-4'
                                    >
                                        <p className='text-sm text-pink-700'>
                                            Final score
                                        </p>
                                        <p className='font-medium text-gray-800'>
                                            {quizSummary.score} /{' '}
                                            {quizSummary.questions.length}
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className='rounded-md bg-pink-50 p-4'
                                    >
                                        <p className='text-sm text-pink-700'>
                                            Status
                                        </p>
                                        <div className='flex items-center space-x-2'>
                                            {quizSummary.completed ? (
                                                <>
                                                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                                                    <p className='font-medium text-green-600'>
                                                        Completed
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className='h-5 w-5 text-red-600' />
                                                    <p className='font-medium text-red-600'>
                                                        Incomplete
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className='rounded-md bg-pink-50 p-4'
                                    >
                                        <p className='text-sm text-pink-700'>
                                            Percentage
                                        </p>
                                        <p className='font-medium text-gray-800'>
                                            {Math.round(
                                                (quizSummary.score /
                                                    quizSummary.questions
                                                        .length) *
                                                    100
                                            )}
                                            %
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className='rounded-md bg-white p-6'
                            >
                                <h2 className='mb-4 text-2xl font-bold text-pink-700'>
                                    Question review
                                </h2>

                                {quizSummary.answer_history.length > 0 ? (
                                    <div className='space-y-4'>
                                        {quizSummary.questions.map(
                                            (question, index) => {
                                                const answer =
                                                    quizSummary.answer_history[
                                                        index
                                                    ]

                                                return (
                                                    <motion.div
                                                        initial={{
                                                            x: -20,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            x: 0,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: 0.1 * index,
                                                        }}
                                                        key={question.id}
                                                        className={`rounded-md p-4 ${
                                                            answer?.correct
                                                                ? 'border border-green-100 bg-green-50'
                                                                : 'border border-red-100 bg-red-50'
                                                        }`}
                                                    >
                                                        <div className='flex items-start space-x-2'>
                                                            <div className='shrink-0 pt-1'>
                                                                {answer?.correct ? (
                                                                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                                                                ) : (
                                                                    <XCircle className='h-5 w-5 text-red-600' />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className='font-medium text-gray-800'>
                                                                    {index + 1}.{' '}
                                                                    {
                                                                        question.question
                                                                    }
                                                                </p>
                                                                {answer && (
                                                                    <div className='mt-2 space-y-1 text-sm'>
                                                                        <p className='text-gray-600'>
                                                                            <span className='font-medium'>
                                                                                Your
                                                                                answer:
                                                                            </span>{' '}
                                                                            {
                                                                                answer.userAnswer
                                                                            }
                                                                        </p>
                                                                        {!answer.correct && (
                                                                            <p className='text-green-600'>
                                                                                <span className='font-medium'>
                                                                                    Correct
                                                                                    answer:
                                                                                </span>{' '}
                                                                                {
                                                                                    question.correct_answer
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className='rounded-md bg-pink-50 p-6 text-center'>
                                        <p className='text-gray-600'>
                                            No question data available.
                                        </p>
                                    </div>
                                )}
                                <Button
                                    variant='destructive'
                                    onClick={() => setShowDeleteModal(true)}
                                    className='mt-4 flex w-full items-center gap-2 bg-red-600 text-white hover:bg-red-500 md:w-auto'
                                >
                                    <Trash2 className='h-4 w-4' />
                                    Delete quiz
                                </Button>
                            </motion.div>

                            <div className='flex justify-center space-x-4'>
                                <Link
                                    className='w-full md:w-auto'
                                    href='/dashboard'
                                >
                                    <Button className='w-full bg-pink-500 text-white hover:bg-pink-600 md:w-auto'>
                                        Back to dashboard
                                    </Button>
                                </Link>
                                <Link className='w-full md:w-auto' href='/quiz'>
                                    <Button
                                        variant='outline'
                                        className='w-full border-pink-300 text-white hover:bg-pink-50 hover:text-pink-700 md:w-auto'
                                    >
                                        Take another quiz
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className='rounded-md bg-pink-50 p-6 text-center'>
                            <p className='text-gray-600'>
                                Quiz not found or you don&apos;t have permission
                                to view it.
                            </p>
                            <div className='mt-4'>
                                <Link href='/dashboard'>
                                    <Button className='bg-pink-500 text-white hover:bg-pink-600'>
                                        Back to dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {showDeleteModal && (
                <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm'>
                    <div className='mx-4 w-full max-w-md rounded-md bg-white p-6 shadow-xl'>
                        <h3 className='mb-4 text-xl font-bold text-gray-900'>
                            Delete Quiz
                        </h3>
                        <p className='mb-6 text-gray-600'>
                            Are you sure you want to delete this quiz? This
                            action cannot be undone.
                        </p>
                        <div className='flex justify-end space-x-3'>
                            <Button
                                variant='outline'
                                onClick={() => setShowDeleteModal(false)}
                                className='border-gray-300'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={handleDelete}
                                className='bg-red-600 hover:bg-red-700'
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

const ArrowLeft = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
        >
            <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m12 19l-7-7l7-7m7 7H5'
            />
        </svg>
    )
}
