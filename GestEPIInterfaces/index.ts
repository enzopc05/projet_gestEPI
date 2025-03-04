export interface EPI {
    id?: number;
    brand: string;
    model: string;
    serialNumber: string;
    size?: string;
    color?: string;
    purchaseDate: Date;
    manufactureDate: Date;
    serviceStartDate: Date;
    periodicity: number;
    epiTypeId: number;
    statusId: number;
    endOfLifeDate?: Date;
    typeName?: string;
    statusName?: string;
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
    checkDate: Date;
    userId: number;
    epiId: number;
    statusId: number;
    remarks?: string;
    userName?: string;
    epiSerialNumber?: string;
    statusName?: string;
  }