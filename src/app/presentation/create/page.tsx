'use client'

import PresentationCreateForm from '@/features/presentation/components/PresentationCreateForm'


export default function CreatePresentationPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6"></h1>
      <PresentationCreateForm />
    </div>
  )
}
