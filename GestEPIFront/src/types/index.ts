export interface EPI {
    id?: number;
    brand: string;
    model: string;
    serialNumber: string;
    size?: string;
    color?: string;
    purchaseDate: Date | string;
    manufactureDate: Date | string;
    serviceStartDate: Date | string;
    periodicity: number;
    epiTypeId: number;
    statusId: number;
    endOfLifeDate?: Date | string;
    typeName?: string;
    statusName?: string;
  }
  
  export interface EPIType {
    id: number;
    typeName: string;
    isTextile: boolean;
  }
  
  export interface EPIStatus {
    id: number;
    statusName: string;
  }
  
  export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    userTypeId: number;
    typeName?: string;
  }
  
  export interface EPICheck {
    id?: number;
    checkDate: Date | string;
    userId: number;
    epiId: number;
    statusId: number;
    remarks?: string;
    userName?: string;
    epiSerialNumber?: string;
    statusName?: string;
  }