import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://isbxdvwctzzgbtdawdmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYnhkdndjdHp6Z2J0ZGF3ZG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNzg4MTEsImV4cCI6MjA5ODY1NDgxMX0.mJtUiQ8GBmvBeZhyyUVhFitc23QqcYLu3-1zb-VdQ-E';

export const supabase = createClient(supabaseUrl, supabaseKey);
