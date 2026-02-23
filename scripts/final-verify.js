import axios from 'axios';

const S = 'https://zinflixritqtulboiqnb.supabase.co';
const K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbmZsaXhyaXRxdHVsYm9pcW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4ODYyNCwiZXhwIjoyMDg3MTY0NjI0fQ.WTlcVdHR8EA6AmIXltz_yKyIsr7wWq7uFCUxsjRvOVg';

async function verify() {
    console.log('--- Final Check ---');
    const h = { 'apikey': K, 'Authorization': 'Bearer ' + K };

    const { data: files } = await axios.get(S + '/rest/v1/files?select=count', { headers: { ...h, 'Prefer': 'count=exact' } });
    console.log('Total files in DB:', files); // This might return an object with count or similar depending on the SDK/Axios

    const resFiles = await axios.get(S + '/rest/v1/files?select=id', { headers: h });
    console.log('Actual file rows count:', resFiles.data.length);

    const resSubj = await axios.get(S + '/rest/v1/subjects?select=id', { headers: h });
    console.log('Actual subject count:', resSubj.data.length);

    const resUnits = await axios.get(S + '/rest/v1/units?select=id', { headers: h });
    console.log('Actual units count:', resUnits.data.length);

    const resProf = await axios.get(S + '/rest/v1/profiles?email=eq.teacher@mhub.com', { headers: h });
    console.log('Teacher profile exists:', resProf.data.length > 0);
    if (resProf.data.length > 0) {
        console.log('Teacher approved:', resProf.data[0].is_approved);
        console.log('Teacher department:', resProf.data[0].department);
    }
}

verify().catch(console.error);
