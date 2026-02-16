// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define explicit types to fix "implicit any" errors
interface Student {
    studentNumber: string
    surplus_deficit_payment: number
}

interface Appliance {
    studentNumber: string
    quantity: number
    list_of_appliances: {
        cost: number
    } | null
}

// @ts-ignore: Deno global is available in Supabase Edge Functions environment
Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // @ts-ignore: Deno global is available in Supabase Edge Functions environment
        const supabaseClient = createClient(
            // @ts-ignore: Deno global is available in Supabase Edge Functions environment
            Deno.env.get('SUPABASE_URL') ?? '',
            // @ts-ignore: Deno global is available in Supabase Edge Functions environment
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        // 1. Get Base Rent
        const { data: rentData, error: rentError } = await supabaseClient
            .from('staticCharge')
            .select('charge')
            .eq('chargeName', 'rent')
            .single()

        if (rentError) throw new Error(`Error fetching rent: ${rentError.message}`)
        const baseRent = rentData.charge || 0

        // 2. Fetch Active Students
        const { data: students, error: studentsError } = await supabaseClient
            .from('Students')
            .select('studentNumber, surplus_deficit_payment')
            .eq('isArchived', false)

        if (studentsError) throw new Error(`Error fetching students: ${studentsError.message}`)
        const typedStudents = students as Student[]

        // 3. Fetch Active Appliances
        const { data: appliances, error: applianceError } = await supabaseClient
            .from('appliance_per_student')
            .select(`
        studentNumber,
        quantity,
        list_of_appliances (
          cost
        )
      `)
            .eq('isActive', true)

        if (applianceError) throw new Error(`Error fetching appliances: ${applianceError.message}`)
        // Supabase returns nested objects, cast to our interface
        // Note: The actual return structure matches our Interface if we're careful.
        const typedAppliances = appliances as unknown as Appliance[]

        // 4. Calculate Charges
        const chargesMap: Record<string, number> = {}
        const balanceMap: Record<string, number> = {}

        // Initialize all active students with 0
        typedStudents.forEach((student: Student) => {
            chargesMap[student.studentNumber] = 0
            balanceMap[student.studentNumber] = student.surplus_deficit_payment || 0
        })

        // Add Appliance Costs
        // Only process if appliances data exists
        if (typedAppliances) {
            typedAppliances.forEach((appliance: Appliance) => {
                const studentNum = appliance.studentNumber
                if (Object.prototype.hasOwnProperty.call(chargesMap, studentNum)) {
                    const qty = appliance.quantity || 1
                    const cost = appliance.list_of_appliances?.cost || 0
                    chargesMap[studentNum] += qty * cost
                }
            })
        }

        // Add Rent to ALL
        Object.keys(chargesMap).forEach(key => {
            chargesMap[key] += baseRent
        })

        // 5. Get Admin ID
        let adminID = null
        try {
            const body = await req.json()
            adminID = body.adminID
        } catch {
            // Body might be empty
        }

        if (!adminID) {
            const { data: adminData } = await supabaseClient
                .from('admin')
                .select('adminID')
                .limit(1)
                .single()
            adminID = adminData?.adminID
        }

        if (!adminID) throw new Error("No Admin ID found to authorize charges.")

        // 6. Prepare Batch Insert for Charges
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 31)
        const formattedDueDate = dueDate.toISOString().split('T')[0]

        const newCharges = Object.entries(chargesMap).map(([studentNumber, amount]) => ({
            studentNumber,
            amount,
            dueDate: formattedDueDate,
            adminID,
        }))

        if (newCharges.length > 0) {
            const { error: insertError } = await supabaseClient
                .from('studentCharge')
                .insert(newCharges)
            if (insertError) throw new Error(`Error inserting charges: ${insertError.message}`)
        }

        // 7. Prepare Batch Upsert for Balances
        // Correcting the calculation based on frontend logic: currentBalance - cost
        const correctedUpdates = Object.entries(chargesMap).map(([studentNumber, cost]) => ({
            studentNumber,
            surplus_deficit_payment: (balanceMap[studentNumber] || 0) - cost
        }))

        if (correctedUpdates.length > 0) {
            const { error: upsertError } = await supabaseClient
                .from('Students')
                .upsert(correctedUpdates, { onConflict: 'studentNumber' })
            if (upsertError) throw new Error(`Error updating balances: ${upsertError.message}`)
        }

        // 8. Announcement
        await supabaseClient
            .from('announcements_table')
            .insert({
                issued_by: adminID,
                content: `Monthly charges have been applied for ${new Date().toLocaleString('default', { month: 'long' })}.`,
                type: 'charge',
            })

        return new Response(
            JSON.stringify({ message: 'Monthly charges applied successfully', count: newCharges.length }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || String(error) }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
    }
})
