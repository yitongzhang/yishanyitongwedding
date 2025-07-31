import { SaveTheDateEmail } from '@/emails/save-the-date'
import { ReminderEmail } from '@/emails/reminder'
import { render } from '@react-email/render'

export default async function EmailPreview() {
  // Render emails to HTML strings to avoid hydration issues
  const saveTheDateHtml = render(
    <SaveTheDateEmail guestEmail="test@example.com" guestName="John Doe" />
  )
  
  const reminderHtml = render(
    <ReminderEmail guestEmail="test@example.com" guestName="John Doe" />
  )

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Email Preview</h1>
        
        {/* Save the Date Email */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Save the Date Email</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              srcDoc={saveTheDateHtml}
              style={{ width: '100%', height: '800px', border: 'none' }}
              title="Save the Date Email Preview"
            />
          </div>
        </div>

        {/* RSVP Reminder Email */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">RSVP Reminder Email</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              srcDoc={reminderHtml}
              style={{ width: '100%', height: '600px', border: 'none' }}
              title="RSVP Reminder Email Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 