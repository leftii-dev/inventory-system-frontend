'use server'

// Get employee by ID
import {ActionResult, apiAction} from "@/lib/utils/api.actions";
import {EmployeeResponse} from "@/lib/employee/employee.types";

export async function getEmployeeByIdAction(userId: string): Promise<ActionResult<EmployeeResponse>> {
    return await apiAction<EmployeeResponse>({
        endpoint: `/employees/${userId}`,
        method: 'GET',
        requireAuth: true,
    })
}