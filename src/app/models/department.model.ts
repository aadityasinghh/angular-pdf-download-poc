export interface Department {
  id: number;
  department: string;
  overallResidualRating: 'Low' | 'Medium' | 'High' | 'Critical';
  averageControlEffectiveness: number;
  controlEffectivenessLabel: string;
  reviewStatus: 'Submitted' | 'Pending' | 'In Progress';
  reviewDate: string;
  reviewer: string;
  isDateOverdue?: boolean;
  // New fields to match the image
  entityHead: string;
  advisoryRemarks: string;
}

export const SAMPLE_DEPARTMENTS: Department[] = [
  {
    id: 1,
    department: 'Operations',
    overallResidualRating: 'High',
    averageControlEffectiveness: 5.5,
    controlEffectivenessLabel: 'Less Effective',
    reviewStatus: 'Submitted',
    reviewDate: '20-08-2023',
    reviewer: 'Asha Negi',
    entityHead: 'Asha Negi',
    advisoryRemarks: 'Needs considerable improvement in controls'
  },
  {
    id: 2,
    department: 'Compliance',
    overallResidualRating: 'High',
    averageControlEffectiveness: 20,
    controlEffectivenessLabel: 'Most Effective',
    reviewStatus: 'Submitted',
    reviewDate: '15-07-2023',
    reviewer: 'Shanaya Malhotra',
    isDateOverdue: true,
    entityHead: 'Shanaya Malhotra',
    advisoryRemarks: 'Needs considerable improvement in controls'
  },
  {
    id: 3,
    department: 'Finance',
    overallResidualRating: 'Critical',
    averageControlEffectiveness: 11.42,
    controlEffectivenessLabel: 'Very Effective',
    reviewStatus: 'Submitted',
    reviewDate: '16-08-2023',
    reviewer: 'Ramakant Das',
    entityHead: 'Ramakant Das',
    advisoryRemarks: 'Control Effectiveness must be revisited'
  },
  {
    id: 4,
    department: 'Marketing',
    overallResidualRating: 'Low',
    averageControlEffectiveness: 20,
    controlEffectivenessLabel: 'Most Effective',
    reviewStatus: 'Submitted',
    reviewDate: '26-07-2023',
    reviewer: 'Karan Singhal',
    entityHead: 'Karan Singhal',
    advisoryRemarks: 'Acceptable & Mitigated'
  },
  {
    id: 5,
    department: 'Human Resource',
    overallResidualRating: 'Critical',
    averageControlEffectiveness: 10,
    controlEffectivenessLabel: 'Less Effective',
    reviewStatus: 'Submitted',
    reviewDate: '16-08-2023',
    reviewer: 'Garima Patel',
    entityHead: 'Garima Patel',
    advisoryRemarks: 'Control Effectiveness must be revisited'
  },
  {
    id: 6,
    department: 'Legal',
    overallResidualRating: 'Medium',
    averageControlEffectiveness: 5.65,
    controlEffectivenessLabel: 'Less Effective',
    reviewStatus: 'Submitted',
    reviewDate: '28-08-2023',
    reviewer: 'Nihar Chandar',
    entityHead: 'Nihar Chandar',
    advisoryRemarks: 'Effectiveness of controls could be better'
  },
  {
    id: 7,
    department: 'Information Technology',
    overallResidualRating: 'Critical',
    averageControlEffectiveness: 5.4,
    controlEffectivenessLabel: 'Less Effective',
    reviewStatus: 'Submitted',
    reviewDate: '10-08-2023',
    reviewer: 'Sindhu Iyer',
    entityHead: 'Sindhu Iyer',
    advisoryRemarks: 'Control Effectiveness must be revisited'
  }
];
