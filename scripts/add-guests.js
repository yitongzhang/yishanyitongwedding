// Script to bulk add guests to the database
// Usage: node scripts/add-guests.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Replace this with your actual guest list
const guestList = [
  { email: 'guest1@example.com', name: 'Guest One Name' },
  { email: 'guest2@example.com', name: 'Guest Two Name' },
  { email: 'guest3@example.com', name: 'Guest Three Name' },
  // Add all your guests here
]

async function addGuests() {
  console.log(`Adding ${guestList.length} guests to the database...`)
  
  for (const guest of guestList) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .upsert({ 
          email: guest.email, 
          name: guest.name,
          is_admin: false 
        }, { 
          onConflict: 'email' 
        })
      
      if (error) {
        console.error(`Error adding ${guest.email}:`, error.message)
      } else {
        console.log(`✓ Added ${guest.name} (${guest.email})`)
      }
    } catch (error) {
      console.error(`Error adding ${guest.email}:`, error)
    }
  }
  
  console.log('Done!')
}

addGuests() 