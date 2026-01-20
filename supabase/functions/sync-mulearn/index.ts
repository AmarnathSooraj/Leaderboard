import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Main function handler
Deno.serve(async (_req: Request) => {
  try {
    // === STEP 1: Get Credentials & Log In to µLearn ===
    console.log("Function started. Authenticating with µLearn...");
    const MULEARN_USER = Deno.env.get('MULEARN_USER') || Deno.env.get('username');
    const MULEARN_PASS = Deno.env.get('MULEARN_PASS') || Deno.env.get('password');
    if (!MULEARN_USER || !MULEARN_PASS) {
      throw new Error('Missing MULEARN_USER or MULEARN_PASS secrets.');
    }

    const authResponse = await fetch("https://mulearn.org/api/v1/auth/user-authentication/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrMuid: MULEARN_USER,
        password: MULEARN_PASS
      })
    });

    if (!authResponse.ok) {
      throw new Error(`µLearn authentication failed: ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const freshToken = authData.response.accessToken;
    console.log("Successfully obtained fresh token.");

    // === STEP 2: Fetch Student AND Campus Data Concurrently ===
    console.log("Fetching student and campus data...");
    
    const fetchHeaders = {
      Authorization: `Bearer ${freshToken}`
    };

    const studentDataPromise = fetch("https://mulearn.org/api/v1/dashboard/campus/student-details/csv/", { headers: fetchHeaders });
    const campusDataPromise = fetch("https://mulearn.org/api/v1/dashboard/campus/campus-details/", { headers: fetchHeaders });

    const [studentDataResponse, campusDataResponse] = await Promise.all([
      studentDataPromise,
      campusDataPromise
    ]);

    // Check both responses
    if (!studentDataResponse.ok) {
      throw new Error(`Failed to fetch student data: ${studentDataResponse.statusText}`);
    }
    if (!campusDataResponse.ok) {
      throw new Error(`Failed to fetch campus data: ${campusDataResponse.statusText}`);
    }

    // Process student data
    const csvText = await studentDataResponse.text();
    console.log("Successfully fetched CSV data.");

    // Process campus data
    const campusJson = await campusDataResponse.json();
    const campusDetails = campusJson.response; // Get the nested response object
    console.log("Successfully fetched campus JSON data.");


    // === STEP 3: Parse CSV & Prepare Data Payloads ===
    console.log("Parsing CSV data...");
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error("CSV data is empty or invalid.");
    }

    const headerLine = lines.shift();
    if (!headerLine) {
      throw new Error("Failed to parse CSV headers.");
    }
    const headers = headerLine.split(',').map((h) => h.trim()); // Get headers
    
    const cleanedStudents = lines.map((line) => {
      const values = line.split(',');
      const student = headers.reduce((obj, header, index) => {
        const value = values[index] ? values[index].trim() : null;
        if (header === 'karma' || header === 'rank') {
          obj[header] = Number(value) || 0;
        } else if (header === 'full_name') {
           // Mapping CSV 'full_name' to DB 'fullname'
          obj['fullname'] = value;
        } else if (header === 'join_date') {
           // Mapping CSV 'join_date' to DB 'joint_date'
          obj['joint_date'] = value;
        } else {
          obj[header] = value;
        }
        return obj;
      }, {} as Record<string, string | number | null>);

      // Only return columns that exist in the students table schema
      const allowedColumns = ['user_id', 'fullname', 'muid', 'karma', 'rank', 'level', 'joint_date'];
      return Object.keys(student)
        .filter(key => allowedColumns.includes(key))
        .reduce((obj, key) => {
          obj[key] = student[key];
          return obj;
        }, {} as Record<string, string | number | null>);
    });
    console.log(`Parsed ${cleanedStudents.length} student records.`);

    // Prepare history data
    const historyRecords = cleanedStudents.map((student) => ({
      student_id: student.user_id as string,
      karma: student.karma as number
    }));
    
    // Prepare campus data record
    const campusRecord = {
        rank: campusDetails.rank,
        karma: campusDetails.total_karma, // Map total_karma to karma
        total_members: campusDetails.total_members,
        active_members: campusDetails.active_members
    };
    console.log("Prepared all data payloads for Supabase.");


    // === STEP 4: Connect to Supabase & Update All Tables ===
    console.log("Connecting to Supabase and updating database...");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert into the 'students' table
    const { error: upsertError } = await supabaseClient
      .from('students')
      .upsert(cleanedStudents, { onConflict: 'user_id' });
    if (upsertError) throw upsertError;
    console.log("Upserted data into 'students' table.");

    // Insert into the 'karma_history' table
    const { error: insertError } = await supabaseClient
      .from('karma_history')
      .insert(historyRecords);
    if (insertError) throw insertError;
    console.log("Inserted records into 'karma_history' table.");

    // (NEW) Insert into the 'campus_details' table
    const { error: campusInsertError } = await supabaseClient
      .from('campus_details')
      .insert(campusRecord); // We insert the single object
    if (campusInsertError) throw campusInsertError;
    console.log("Inserted record into 'campus_details' table.");


    // === STEP 5: Return Success Response ===
    return new Response(JSON.stringify({
      message: `Successfully updated ${cleanedStudents.length} students and campus details.`
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error?.message ?? String(error) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
