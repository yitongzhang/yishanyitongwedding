import { SaveTheDateEmail } from '@/emails/save-the-date'

export default function EmailPreview() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Email Preview</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Save the Date Email</h2>
          <div className="border border-gray-300 rounded-lg">
            <SaveTheDateEmail guestEmail="test@example.com" />
          </div>
        </div>
      </div>
    </div>
  )
} 