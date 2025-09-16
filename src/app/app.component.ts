import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { PdfService } from './services/pdf.service';
import { User } from './models/user.model';
import { Department, SAMPLE_DEPARTMENTS } from './models/department.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PDF POC - Multiple Table Types';
  users: User[] = [];
  departments: Department[] = SAMPLE_DEPARTMENTS;
  loading = false;
  error: string | null = null;
  
  // New data structure for compliance risk assessment
  complianceData = {
    departments: SAMPLE_DEPARTMENTS,
    status: 'Critical',
    percentage: '42.85'
  };
  
  // Logo URL (can be set from external source)
  logoUrl: string = 'https://via.placeholder.com/80x30/00346B/FFFFFF?text=LOGO';

  constructor(
    private userService: UserService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  // User table PDF methods
  downloadUserPdf(): void {
    if (this.users.length > 0) {
      this.pdfService.generateUserTablePdf(this.users);
    }
  }

  // Department table PDF methods
  downloadDepartmentPdfFromHtml(): void {
    this.pdfService.generateDepartmentTablePdfFromHtml('department-table');
  }

  downloadDepartmentPdfWithAutoTable(): void {
    this.pdfService.generateDepartmentTablePdfWithAutoTable(this.departments);
  }

  downloadComplianceRiskAssessmentPdf(): void {
    this.pdfService.generateComplianceRiskAssessmentPdf(this.complianceData, this.logoUrl);
  }

  // Helper method to get rating color class
  getRatingColorClass(rating: string): string {
    switch (rating) {
      case 'Critical':
      case 'High':
        return 'rating-high';
      case 'Medium':
        return 'rating-medium';
      case 'Low':
        return 'rating-low';
      default:
        return '';
    }
  }

  // Calculate risk percentage based on high/critical departments
  getRiskPercentage(): string {
    const totalDepartments = this.departments.length;
    const highRiskCount = this.departments.filter(d => 
      d.overallResidualRating === 'Critical' || d.overallResidualRating === 'High'
    ).length;
    return ((highRiskCount / totalDepartments) * 100).toFixed(1);
  }

  // Get overall risk status based on highest risk level present
  getOverallRiskStatus(): string {
    const criticalCount = this.departments.filter(d => d.overallResidualRating === 'Critical').length;
    const highCount = this.departments.filter(d => d.overallResidualRating === 'High').length;
    const mediumCount = this.departments.filter(d => d.overallResidualRating === 'Medium').length;
    
    if (criticalCount > 0) return 'Critical';
    if (highCount > 0) return 'High';
    if (mediumCount > 0) return 'Medium';
    return 'Low';
  }

  // Get CSS class for overall risk status
  getOverallRiskStatusClass(): string {
    const status = this.getOverallRiskStatus();
    return status.toLowerCase();
  }
}
