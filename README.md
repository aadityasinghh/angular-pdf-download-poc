# PDF POC - Angular Multiple Table Types

This is a comprehensive Proof of Concept (POC) application that demonstrates multiple PDF generation methods:

1. **jsPDF autoTable**: Programmatic table generation with styling
2. **HTML Template**: Convert HTML tables to PDF using html2canvas
3. **API Data Integration**: Fetch data from JSONPlaceholder API
4. **Sample Data**: Pre-defined department review data matching real-world scenarios

## Features

### Multiple PDF Generation Methods

- **jsPDF autoTable**: Creates PDFs programmatically with custom styling and color coding
- **HTML Template**: Converts existing HTML tables to PDF, preserving exact visual appearance
- **Dual Table Support**: Both API-fetched user data and sample department data

### Data Sources

- **API Data**: Retrieves user data from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users)
- **Sample Data**: Pre-defined department review data with ratings, dates, and reviewers

### Visual Features

- **Color-coded Ratings**: Red for Critical/High, Green for Low, Yellow for Medium
- **Overdue Date Highlighting**: Red text for overdue review dates
- **Responsive Design**: Works on desktop and mobile devices
- **Professional Styling**: Clean, modern interface with hover effects

## Technologies Used

- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **jsPDF** - PDF generation library
- **jsPDF AutoTable** - Table generation plugin
- **html2canvas** - HTML to canvas conversion
- **RxJS** - Reactive programming
- **SCSS** - Styling

## Table Types

### 1. User Data Table (API)

- Fetches data from JSONPlaceholder API
- Columns: ID, Name, Username, Email, City, Phone, Company
- PDF Generation: jsPDF autoTable only

### 2. Department Review Table (Sample Data)

- Pre-defined sample data matching real-world scenarios
- Columns: Department/Entity, Overall Residual Rating, Control Effectiveness, Review Status, Review Date, Reviewer
- PDF Generation: Both jsPDF autoTable and HTML template methods

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run the Application**

   ```bash
   ng serve
   ```

3. **Open Browser**
   Navigate to `http://localhost:4200`

## Usage

### User Data Table

1. Data loads automatically from the API
2. Click "Refresh User Data" to reload
3. Click "Download User PDF (autoTable)" to generate PDF

### Department Review Table

1. Sample data is pre-loaded
2. Click "Download Department PDF (HTML Template)" to generate PDF from HTML
3. Click "Download Department PDF (autoTable)" to generate PDF programmatically

## PDF Generation Methods

### Method 1: jsPDF autoTable

- **Pros**: Programmatic control, consistent styling, smaller file size
- **Cons**: Limited visual customization, requires data transformation
- **Best for**: Standard reports, data-heavy tables

### Method 2: HTML Template

- **Pros**: Exact visual reproduction, easy to style with CSS
- **Cons**: Larger file size, requires HTML element reference
- **Best for**: Complex layouts, exact visual matching

## Sample Data Structure

The department table includes realistic data with:

- **Ratings**: Low, Medium, High, Critical (color-coded)
- **Control Effectiveness**: Numerical values with descriptive labels
- **Review Status**: Submitted (with clickable links)
- **Review Dates**: Some marked as overdue (red text)
- **Reviewers**: Assigned personnel names

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   ├── user.model.ts              # User interface
│   │   └── department.model.ts        # Department interface + sample data
│   ├── services/
│   │   ├── user.service.ts            # API service
│   │   └── pdf.service.ts             # PDF generation service
│   ├── app.component.ts               # Main component
│   ├── app.component.html             # Main template
│   ├── app.component.scss             # Main styles
│   └── app.config.ts                  # App configuration
```

## Customization

### PDF Styling

- Modify `PdfService` methods to change colors, fonts, layouts
- Update column widths and cell padding
- Add custom headers and footers

### Table Styling

- Update SCSS files for visual changes
- Modify color schemes for ratings
- Adjust responsive breakpoints

### Data Sources

- Replace sample data with real API calls
- Add new table types by creating new models and services
- Implement data filtering and sorting

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- The application demonstrates both programmatic and template-based PDF generation
- HTML template method preserves exact visual appearance
- jsPDF autoTable method provides better performance and smaller file sizes
- All PDFs include page numbering and professional formatting
