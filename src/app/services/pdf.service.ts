import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { User } from '../models/user.model';
import { Department } from '../models/department.model';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateUserTablePdf(users: User[]): void {
    try {
      console.log('Generating PDF for users:', users.length);
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('User Data Report', 14, 22);
      
      // Prepare table data
      const tableData = users.map(user => [
        user.id.toString(),
        user.name,
        user.username,
        user.email,
        user.address.city,
        user.phone,
        user.company.name
      ]);

      console.log('Table data prepared:', tableData);

      autoTable(doc, {
        head: [['ID', 'Name', 'Username', 'Email', 'City', 'Phone', 'Company']],
        body: tableData,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 15 }, // ID
          1: { cellWidth: 30 }, // Name
          2: { cellWidth: 25 }, // Username
          3: { cellWidth: 40 }, // Email
          4: { cellWidth: 25 }, // City
          5: { cellWidth: 30 }, // Phone
          6: { cellWidth: 35 }  // Company
        },
        margin: { top: 30 }
      });

      console.log('Table generated successfully');

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 14, (doc as any).internal.pageSize.height - 10);
      }
      doc.save('user-data-report.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  }

  // Method 2: Using HTML template (new method)
  generateDepartmentTablePdfFromHtml(elementId: string): void {
    try {
      console.log('Generating PDF from HTML template...');
      
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        
        const imgWidth = 297; // A4 width in mm
        const pageHeight = 210; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('department-report.pdf');
        console.log('PDF generated successfully from HTML template');
      }).catch(error => {
        console.error('Error generating PDF from HTML:', error);
        alert('Error generating PDF from HTML template. Please check the console for details.');
      });
      
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      alert('Error generating PDF from HTML template. Please check the console for details.');
    }
  }

  // Method 3: Using jsPDF autoTable for department data (matching your image)
  generateDepartmentTablePdfWithAutoTable(departments: Department[]): void {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFontSize(16);
      const tableData = departments.map(dept => [
        dept.department,
        dept.overallResidualRating,
        `${dept.averageControlEffectiveness} (${dept.controlEffectivenessLabel})`,
        dept.reviewStatus,
        dept.reviewDate,
        dept.reviewer
      ]);

      autoTable(doc, {
        head: [['Department/Entity', 'Overall Residual Rating', 'Average Control Effectiveness (CE)', 'Review Status', 'Review Date', 'Reviewer']],
        body: tableData,
        startY: 25,
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [52, 73, 94], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250] 
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Department
          1: { cellWidth: 50 }, // Rating
          2: { cellWidth: 40 }, // Control Effectiveness
          3: { cellWidth: 25 }, // Review Status
          4: { cellWidth: 25 }, // Review Date
          5: { cellWidth: 30 }  // Reviewer
        },
        margin: { top: 25 },
        didParseCell: function(data) {
          // Color code the rating column
          if (data.column.index === 1) {
            const rating = data.cell.text[0];
            if (rating === 'Critical' || rating === 'High') {
              data.cell.styles.textColor = [231, 76, 60]; // Red
            } else if (rating === 'Low') {
              data.cell.styles.textColor = [39, 174, 96]; // Green
            } else if (rating === 'Medium') {
              data.cell.styles.textColor = [241, 196, 15]; // Yellow
            }
          }
          // Color code overdue dates
          if (data.column.index === 4) {
            const dept = departments[data.row.index];
            if (dept.isDateOverdue) {
              data.cell.styles.textColor = [231, 76, 60]; // Red
            }
          }
        }
      });
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 14, (doc as any).internal.pageSize.height - 10);
      }
      
      doc.save('department-report-autotable.pdf');
      
    } catch (error) {
      console.error('Error generating Department PDF:', error);
      alert('Error generating Department PDF. Please check the console for details.');
    }
  }

  // Method 4: Generate Compliance Risk Assessment PDF (matching the exact image)
  generateComplianceRiskAssessmentPdf(data: {departments: Department[], status: string, percentage: string}, logoUrl?: string): void {
    try {
      console.log('Generating Compliance Risk Assessment PDF:', data.departments.length);
      
      const doc = new jsPDF('l', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Use #00346B blue color (RGB: 0, 52, 107)
      doc.setFillColor(0, 52, 107);
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Add logo if provided
      if (logoUrl) {
        try {
          // Add logo on the left side
          doc.addImage(logoUrl, 'PNG', 14, 5, 20, 15);
        } catch (error) {
          console.warn('Could not load logo from URL:', logoUrl);
        }
      }
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Compliance Risk Assessment 2023-2024', 14, 18);
      
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
          textColor: [0, 0, 0] // Black text
        },
        headStyles: {
          fillColor: [0, 52, 107], // Updated to #00346B blue
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 11
        },
        // alternateRowStyles: {
        //   fillColor: [248, 249, 250] // Light gray for alternating rows
        // },
        columnStyles: {
          0: { cellWidth: 50, halign: 'left' }, // Department/Entity
          1: { cellWidth: 60, halign: 'center' }, // Residual Rating Status
          2: { cellWidth: 40, halign: 'left' }, // Entity Head
          3: { cellWidth: 90, halign: 'left' }  // Advisory Remarks
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
      const labelWidth = 80;
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
}
