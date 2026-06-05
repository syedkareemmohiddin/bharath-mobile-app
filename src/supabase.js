import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojxdhcytzmuykdxtcspy.supabase.co';
const supabaseKey = 'sb_publishable_cRURRbWajlafZbnraHOHyQ_ybkj4Mxo';

export const supabase = createClient(supabaseUrl, supabaseKey);
