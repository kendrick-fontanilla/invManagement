import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project details
const supabaseUrl = 'https://owminiqfnntwzxkgyuhq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bWluaXFmbm50d3p4a2d5dWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NDU2NTQsImV4cCI6MjA2MjQyMTY1NH0.KhRHbq3NYzJGTVC2mGhbhRRhSK-P27MQk5ZZfrZhe3M'

export const supabase = createClient(supabaseUrl, supabaseKey)
