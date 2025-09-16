import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { User } from '../models/user.model';
import { Department } from '../models/department.model';
import { FinanceRiskData } from '../models/finance-risk.model';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {


  // Method 4: Generate Compliance Risk Assessment PDF (matching the exact image)
  generateComplianceRiskAssessmentPdf(data: {departments: Department[], status: string, percentage: string}, logoUrl?: string): void {
    try {
      console.log('Generating Compliance Risk Assessment PDF:', data.departments.length);
      
      const doc = new jsPDF('l', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Use #00346B blue color (RGB: 0, 52, 107)
      doc.setFillColor(0, 52, 107);
      doc.rect(0, 0, pageWidth, 20, 'F' );
      
      // Add logo if provided
      // if (logoUrl) {
      //   try {
      //     // Add logo on the left side
      //     doc.addImage(logoUrl, 'PNG', 14, 5, 20, 15);
      //   } catch (error) {
      //     console.warn('Could not load logo from URL:', logoUrl);
      //   }
      // }
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Compliance Risk Assessment 2023-2024', 14, 18 );
      
      doc.setFontSize(10);
      doc.text('Bank of Baroda', pageWidth - 30, 25, { align: 'center' });
      
      // Prepare table data matching the image exactly
      const tableData = data.departments.map(dept => [
        dept.department,
        dept.overallResidualRating,
        dept.entityHead,
        dept.advisoryRemarks
      ]);

      autoTable(doc, {
        head: [['Department/Entity', 'Residual Rating Status', 'Entity Head', 'Advisory Remarks']],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 10,
          cellPadding: 6,
          overflow: 'linebreak',
          textColor: [0, 0, 0], // Black text
          lineColor: [224, 224, 224], // Light grey borders
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [0, 52, 107], // Updated to #00346B blue
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 11,
          lineColor: [255, 255, 255], // White borders between header columns
          lineWidth: 0.1
        },
        // alternateRowStyles: {
        //   fillColor: [248, 249, 250] // Light gray for alternating rows
        // },
        columnStyles: {
          0: { cellWidth: 55, halign: 'left' }, // Department/Entity
          1: { cellWidth: 65, halign: 'center' }, // Residual Rating Status
          2: { cellWidth: 45, halign: 'left' }, // Entity Head
          3: { cellWidth: 95, halign: 'left' }  // Advisory Remarks
        },
        margin: { top: 35, left: 14, right: 14 },
        didParseCell: function(data) {
          // Color code the rating column with background colors
          if (data.column.index === 1) {
            const rating = data.cell.text[0];
            if (rating === 'Critical') {
              data.cell.styles.fillColor = [139, 0, 0]; // Darker red for critical
              data.cell.styles.textColor = [255, 255, 255]; // White text
            } else if (rating === 'High') {
              data.cell.styles.fillColor = [231, 76, 60]; // Regular red for high
              data.cell.styles.textColor = [255, 255, 255]; // White text
            } else if (rating === 'Low') {
              data.cell.styles.fillColor = [39, 174, 96]; // Green background
              data.cell.styles.textColor = [255, 255, 255]; // White text
            } else if (rating === 'Medium') {
              data.cell.styles.fillColor = [241, 196, 15]; // Yellow background
              data.cell.styles.textColor = [0, 0, 0]; // Black text
            }
          }
          // Make department names blue (clickable links)
          // if (data.column.index === 0) {
          //   data.cell.styles.textColor = [0, 0, 255]; // Blue color
          //   data.cell.styles.fontStyle = 'bold';
          // }
        }
      });

      // Calculate the final Y position after the table
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      
      // Use provided data for risk status
      const riskPercentage = data.percentage;
      const overallRiskStatus = data.status;
      
      // Determine status color based on risk level
      let statusColor = [39, 174, 96]; // Green for Low
      
      if (overallRiskStatus === 'Critical') {
        statusColor = [139, 0, 0]; // Darker red for critical
      } else if (overallRiskStatus === 'High') {
        statusColor = [231, 76, 60]; // Regular red for high
      } else if (overallRiskStatus === 'Medium') {
        statusColor = [241, 196, 15]; // Yellow for medium
      }
      
      // Organizational Residual Risk Status summary - Positioned on the right side
      const summaryY = finalY + 15;
      const labelWidth = 70;
      const percentageWidth = 25;
      const statusWidth = 35;
      
      // Calculate right-aligned position
      const rightStartX = pageWidth - 14 - labelWidth - percentageWidth - statusWidth;
      
      // Label section (white background)
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(rightStartX, summaryY, labelWidth, 12, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Organizational Residual Risk Status:', rightStartX + 2, summaryY + 8);
      
      // Percentage section (gray background)
      doc.setFillColor(200, 200, 200); // Gray background
      doc.rect(rightStartX + labelWidth, summaryY, percentageWidth, 12, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${riskPercentage}%`, rightStartX + labelWidth + (percentageWidth/2), summaryY + 8, { align: 'center' });
      
      // Status section (dynamic color based on risk level)
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(rightStartX + labelWidth + percentageWidth, summaryY, statusWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(overallRiskStatus, rightStartX + labelWidth + percentageWidth + (statusWidth/2), summaryY + 8, { align: 'center' });
      doc.save('compliance-risk-assessment-2023-2024.pdf');
      
    } catch (error) {
      console.error('Error generating Compliance Risk Assessment PDF:', error);
      alert('Error generating Compliance Risk Assessment PDF. Please check the console for details.');
    }
  }

  // Method 5: Generate Finance Risk Assessment PDF
  generateFinanceRiskAssessmentPdf(data: FinanceRiskData, logoUrl?: string): void {
    try {
      console.log('Generating Finance Risk Assessment PDF:', data.risks.length);
      
      const doc = new jsPDF('l', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Use #00346B blue color (RGB: 0, 52, 107)
      doc.setFillColor(0, 52, 107);
      doc.rect(0, 0, pageWidth, 20, 'F');
      
      // Add logo if provided
      if (logoUrl) {
        try {
          // Add logo on the right side
          doc.addImage(logoUrl, 'PNG', pageWidth - 60, 3, 50, 14);
        } catch (error) {
          console.warn('Could not load logo from URL:', logoUrl);
        }
      }
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${data.department} Risk Assessment ${data.year}`, 14, 15);
      
      // Prepare table data
      const tableData = data.risks.map(risk => [
        risk.risk,
        risk.sourceType,
        risk.riskStatus,
        risk.rrRating,
        risk.averageControlEffectiveness,
        risk.riskCriticalityValue,
        risk.impact,
        risk.likelihood,
        risk.inherentRiskValue,
        risk.residualRisk
      ]);

      autoTable(doc, {
        head: [
          ['Risk', 'Source Type', 'Risk Status', 'RR Rating', 'Average Control Effectiveness (CE)', 
           'Risk Criticality Value (RCV)', 'Impact (I)', 'Likelihood (L)', 
           'Inherent Risk Value (IRV)', 'Residual Risk (RR)']
        ],
        body: tableData,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          textColor: [0, 0, 0], // Black text
          lineColor: [224, 224, 224], // Light grey borders
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [0, 52, 107], // #00346B blue
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9,
          lineColor: [255, 255, 255], // White borders between header columns
          lineWidth: 0.1
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'left' }, // Risk
          1: { cellWidth: 20, halign: 'center' }, // Source Type
          2: { cellWidth: 25, halign: 'center' }, // Risk Status
          3: { cellWidth: 25, halign: 'center' }, // RR Rating
          4: { cellWidth: 35, halign: 'center' }, // Average Control Effectiveness
          5: { cellWidth: 30, halign: 'center' }, // Risk Criticality Value
          6: { cellWidth: 20, halign: 'center' }, // Impact
          7: { cellWidth: 20, halign: 'center' }, // Likelihood
          8: { cellWidth: 30, halign: 'center' }, // Inherent Risk Value
          9: { cellWidth: 25, halign: 'center' }  // Residual Risk
        },
        margin: { top: 30, left: 14, right: 14 },
        didParseCell: function(data) {
          // Color code the Risk Status column (index 2)
          if (data.column.index === 2) {
            const status = data.cell.text[0];
            if (status === 'Critical') {
              data.cell.styles.fillColor = [139, 0, 0]; // Darker red
              data.cell.styles.textColor = [255, 255, 255];
            } else if (status === 'High') {
              data.cell.styles.fillColor = [231, 76, 60]; // Regular red
              data.cell.styles.textColor = [255, 255, 255];
            } else if (status === 'Medium') {
              data.cell.styles.fillColor = [241, 196, 15]; // Yellow
              data.cell.styles.textColor = [0, 0, 0];
            } else if (status === 'Low') {
              data.cell.styles.fillColor = [46, 204, 113]; // Green
              data.cell.styles.textColor = [255, 255, 255];
            }
          }
          // Color code the RR Rating column (index 3)
          if (data.column.index === 3) {
            const rating = data.cell.text[0];
            if (rating === 'Critical') {
              data.cell.styles.fillColor = [139, 0, 0]; // Darker red
              data.cell.styles.textColor = [255, 255, 255];
            } else if (rating === 'High') {
              data.cell.styles.fillColor = [231, 76, 60]; // Regular red
              data.cell.styles.textColor = [255, 255, 255];
            } else if (rating === 'Medium') {
              data.cell.styles.fillColor = [241, 196, 15]; // Yellow
              data.cell.styles.textColor = [0, 0, 0];
            } else if (rating === 'Low') {
              data.cell.styles.fillColor = [46, 204, 113]; // Green
              data.cell.styles.textColor = [255, 255, 255];
            }
          }
        }
      });

      // Calculate the final Y position after the table
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      
      // Finance Residual Risk Status summary - Left side
      const summaryY = finalY + 15;
      const leftLabelWidth = 80;
      const leftStatusWidth = 30;
      
      // Left side - Finance Residual Risk Status
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(14, summaryY, leftLabelWidth, 12, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${data.department} Residual Risk Status:`, 16, summaryY + 8);
      
      // Left side - Status box
      const leftStatusColor = this.getStatusColor(data.residualRiskStatus);
      doc.setFillColor(leftStatusColor[0], leftStatusColor[1], leftStatusColor[2]);
      doc.rect(14 + leftLabelWidth, summaryY, leftStatusWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(data.residualRiskStatus, 14 + leftLabelWidth + (leftStatusWidth/2), summaryY + 8, { align: 'center' });
      
      // Right side - Finance Residual Risk Rating (By Average)
      const rightLabelWidth = 100;
      const rightValueWidth = 25;
      const rightStatusWidth = 30;
      const rightStartX = pageWidth - 14 - rightLabelWidth - rightValueWidth - rightStatusWidth;
      
      // Right side - Label
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(rightStartX, summaryY, rightLabelWidth, 12, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${data.department} Residual Risk Rating (By Average):`, rightStartX + 2, summaryY + 8);
      
      // Right side - Value box (gray)
      doc.setFillColor(108, 117, 125); // Gray background
      doc.rect(rightStartX + rightLabelWidth, summaryY, rightValueWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(data.residualRiskRatingByAverage.value, rightStartX + rightLabelWidth + (rightValueWidth/2), summaryY + 8, { align: 'center' });
      
      // Right side - Status box
      const rightStatusColor = this.getStatusColor(data.residualRiskRatingByAverage.status);
      doc.setFillColor(rightStatusColor[0], rightStatusColor[1], rightStatusColor[2]);
      doc.rect(rightStartX + rightLabelWidth + rightValueWidth, summaryY, rightStatusWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(data.residualRiskRatingByAverage.status, rightStartX + rightLabelWidth + rightValueWidth + (rightStatusWidth/2), summaryY + 8, { align: 'center' });
      
      doc.save(`${data.department.toLowerCase()}-risk-assessment-${data.year}.pdf`);
      
    } catch (error) {
      console.error('Error generating Finance Risk Assessment PDF:', error);
      alert('Error generating Finance Risk Assessment PDF. Please check the console for details.');
    }
  }

  // Helper method to get status color
  private getStatusColor(status: string): [number, number, number] {
    switch (status) {
      case 'Critical':
        return [139, 0, 0]; // Darker red
      case 'High':
        return [231, 76, 60]; // Regular red
      case 'Medium':
        return [241, 196, 15]; // Yellow
      case 'Low':
        return [46, 204, 113]; // Green
      default:
        return [108, 117, 125]; // Gray
    }
  }
}
