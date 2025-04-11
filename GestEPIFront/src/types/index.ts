export interface EPI {
  daysUntilNextCheck: number;
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
  password?: string;
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