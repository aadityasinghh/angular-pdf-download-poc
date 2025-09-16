export interface FinanceRiskItem {
  id: string;
  risk: string;
  sourceType: string;
  riskStatus: 'Low' | 'Medium' | 'High' | 'Critical';
  rrRating: 'Low' | 'Medium' | 'High' | 'Critical';
  averageControlEffectiveness: string;
  riskCriticalityValue: string;
  impact: string;
  likelihood: string;
  inherentRiskValue: string;
  residualRisk: string;
}

export interface FinanceRiskData {
  year: string;
  department: string;
  residualRiskStatus: 'Low' | 'Medium' | 'High' | 'Critical';
  residualRiskRatingByAverage: {
    value: string;
    status: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  risks: FinanceRiskItem[];
}

// Sample data for Finance Risk Assessment
export const SAMPLE_FINANCE_RISK_DATA: FinanceRiskData = {
  year: '2023-2024',
  department: 'Finance',
  residualRiskStatus: 'Critical',
  residualRiskRatingByAverage: {
    value: '79.5',
    status: 'High'
  },
  risks: [
    {
      id: '1',
      risk: 'Risk_1011',
      sourceType: 'Custom',
      riskStatus: 'Medium',
      rrRating: 'High',
      averageControlEffectiveness: 'TBA',
      riskCriticalityValue: 'TBA',
      impact: 'TBA',
      likelihood: 'TBA',
      inherentRiskValue: 'TBA',
      residualRisk: 'TBA'
    },
    {
      id: '2',
      risk: 'Risk_1012',
      sourceType: 'Custom',
      riskStatus: 'Low',
      rrRating: 'Low',
      averageControlEffectiveness: '20 (ME)',
      riskCriticalityValue: '32 [H]',
      impact: '20 [N]',
      likelihood: '2',
      inherentRiskValue: '72',
      residualRisk: '52'
    },
    {
      id: '3',
      risk: 'Risk_1013',
      sourceType: 'Custom',
      riskStatus: 'High',
      rrRating: 'High',
      averageControlEffectiveness: '15 (VE)',
      riskCriticalityValue: '16 [L]',
      impact: '60 [M]',
      likelihood: '1',
      inherentRiskValue: '136',
      residualRisk: '121'
    },
    {
      id: '4',
      risk: 'Risk_1014',
      sourceType: 'Custom',
      riskStatus: 'Low',
      rrRating: 'Low',
      averageControlEffectiveness: '10 (ME)',
      riskCriticalityValue: '8 [N]',
      impact: '40 [L]',
      likelihood: '3',
      inherentRiskValue: '48',
      residualRisk: '28'
    },
    {
      id: '5',
      risk: 'Risk_1015',
      sourceType: 'Custom',
      riskStatus: 'Critical',
      rrRating: 'Critical',
      averageControlEffectiveness: '5 (NE)',
      riskCriticalityValue: '24 [M]',
      impact: '60 [M]',
      likelihood: '2',
      inherentRiskValue: '144',
      residualRisk: '134'
    },
    {
      id: '6',
      risk: 'Risk_1016',
      sourceType: 'Custom',
      riskStatus: 'Medium',
      rrRating: 'Medium',
      averageControlEffectiveness: '20 (ME)',
      riskCriticalityValue: '32 [H]',
      impact: '20 [N]',
      likelihood: '2',
      inherentRiskValue: '64',
      residualRisk: '44'
    },
    {
      id: '7',
      risk: 'Risk_1017',
      sourceType: 'Custom',
      riskStatus: 'High',
      rrRating: 'High',
      averageControlEffectiveness: '15 (VE)',
      riskCriticalityValue: '16 [L]',
      impact: '60 [M]',
      likelihood: '1',
      inherentRiskValue: '136',
      residualRisk: '101'
    }
  ]
};
