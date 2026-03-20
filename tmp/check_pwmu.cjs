require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from('pwmu_centers').select('*').limit(2);
  console.log(JSON.stringify(data, null, 2));
}
test();
