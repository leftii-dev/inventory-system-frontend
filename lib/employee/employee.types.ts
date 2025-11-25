export type EmployeeResponse = EmployeeResponseBasic | EmployeeResponseDetail;

interface EmployeeResponseBasic {
    id: string;
    nameFirst: string;
    nameLast: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    employeeCode: string;
}

interface EmployeeResponseDetail extends EmployeeResponseBasic {
    createdAt: string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
    active: boolean;
    isCurrentEmployee: boolean;
}