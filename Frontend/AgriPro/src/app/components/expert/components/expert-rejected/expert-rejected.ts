import { Component } from '@angular/core';
import { ExpertRejectedCards } from './components/expert-rejected-cards/expert-rejected-cards';
import { ExpertRejectedList } from './components/expert-rejected-list/expert-rejected-list';
import { ExpertRejectedSearch } from './components/expert-rejected-search/expert-rejected-search';

interface RejectedProject {
  project: string;
  location: string;
  farmer: string;
  email: string;
  phone: string;
  rejectedOn: string;
  rejectedDaysAgo: number;
  status: 'Rejected' | 'Under Appeal';
  reason: string;
  crop: string;
  size: string;
  fundingGoal: string;
  expectedROI: string;
  rejectionDetails: string;
  documents: { pdf: number; images: number };
  documentsList: { name: string; type: string }[];
}

@Component({
  standalone: true,
  selector: 'app-expert-rejected',
  imports: [ExpertRejectedCards, ExpertRejectedList, ExpertRejectedSearch],
  templateUrl: './expert-rejected.html',
  styleUrls: ['./expert-rejected.css'],
})
export class ExpertRejected {
  searchQuery = '';
  selectedCrop: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | 'Maize' = 'All Crops';
  selectedDateRange: 'All Time' | 'Last 30 Days' | 'Last 90 Days' = 'All Time';

  rejectedProjects: RejectedProject[] = [
    {
      project: 'Wheat Farm Investment',
      location: 'Kafr El-Sheikh, Beheira',
      farmer: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+20 100 XXX XXXX',
      rejectedOn: '5 days ago',
      rejectedDaysAgo: 5,
      status: 'Rejected',
      reason: 'Missing irrigation permit and inconsistent soil report.',
      crop: 'Wheat',
      size: '15 Feddan',
      fundingGoal: 'EGP 250,000',
      expectedROI: '15-18%',
      rejectionDetails:
        'This project was rejected because the submitted land ownership documents were incomplete and the irrigation plan did not meet expert standards.',
      documents: { pdf: 4, images: 6 },
      documentsList: [
        { name: 'Land Ownership.pdf', type: 'pdf' },
        { name: 'Irrigation Plan.jpg', type: 'image' },
        { name: 'Soil Report.pdf', type: 'pdf' },
      ],
    },
    {
      project: 'Mango Orchard Project',
      location: 'Abu Sultan, Ismailia',
      farmer: 'Mohamed Ali',
      email: 'mohamed.ali@email.com',
      phone: '+20 101 XXX XXXX',
      rejectedOn: '12 days ago',
      rejectedDaysAgo: 12,
      status: 'Under Appeal',
      reason: 'Project lacks a clear harvest timeline and water access confirmation.',
      crop: 'Fruits',
      size: '8 Feddan',
      fundingGoal: 'EGP 180,000',
      expectedROI: '12-15%',
      rejectionDetails:
        'The submission has been placed under appeal pending additional documentation for water access rights and expected harvest cycles.',
      documents: { pdf: 3, images: 8 },
      documentsList: [
        { name: 'Ownership Contract.pdf', type: 'pdf' },
        { name: 'Water Access.jpg', type: 'image' },
        { name: 'Harvest Schedule.pdf', type: 'pdf' },
      ],
    },
    {
      project: 'Rice Paddy Expansion',
      location: 'Desouk, Kafr El-Sheikh',
      farmer: 'Omar Mostafa',
      email: 'omar.mostafa@email.com',
      phone: '+20 102 XXX XXXX',
      rejectedOn: '28 days ago',
      rejectedDaysAgo: 28,
      status: 'Rejected',
      reason: 'Estimated budget and ROI do not reflect current labor costs.',
      crop: 'Rice',
      size: '12 Feddan',
      fundingGoal: 'EGP 220,000',
      expectedROI: '14-17%',
      rejectionDetails:
        'The financial assumptions require revision to align with recent labor and material cost increases.',
      documents: { pdf: 5, images: 4 },
      documentsList: [
        { name: 'Title Deed.pdf', type: 'pdf' },
        { name: 'Budget Plan.pdf', type: 'pdf' },
        { name: 'Labor Contract.jpg', type: 'image' },
      ],
    },
    {
      project: 'Maize Seed Trial',
      location: 'Al-Fayoum',
      farmer: 'Salma Nabil',
      email: 'salma.nabil@email.com',
      phone: '+20 103 XXX XXXX',
      rejectedOn: '65 days ago',
      rejectedDaysAgo: 65,
      status: 'Rejected',
      reason: 'Soil analysis report is outdated and missing water source verification.',
      crop: 'Maize',
      size: '10 Feddan',
      fundingGoal: 'EGP 150,000',
      expectedROI: '11-14%',
      rejectionDetails:
        'A new soil exam and formal water access confirmation must be provided before re-evaluation.',
      documents: { pdf: 2, images: 5 },
      documentsList: [
        { name: 'Soil Analysis.pdf', type: 'pdf' },
        { name: 'Water Survey.jpg', type: 'image' },
      ],
    },
    {
      project: 'Citrus Orchard - Sharqia',
      location: 'Zagazig, Sharqia',
      farmer: 'Karim Said',
      email: 'karim.said@email.com',
      phone: '+20 104 XXX XXXX',
      rejectedOn: 'Jan 12, 2024',
      rejectedDaysAgo: 120,
      status: 'Rejected',
      reason: 'Incomplete ownership documents - Missing land survey.',
      crop: 'Fruits',
      size: '10 Feddan',
      fundingGoal: 'EGP 190,000',
      expectedROI: '13-16%',
      rejectionDetails:
        'Ownership paperwork was incomplete and the land survey documents were missing. The application must be re-submitted with full legal ownership proof.',
      documents: { pdf: 2, images: 3 },
      documentsList: [
        { name: 'Ownership.pdf', type: 'pdf' },
        { name: 'Survey Photo.jpg', type: 'image' },
      ],
    },
    {
      project: 'Potato Farm - Giza',
      location: 'Badrashin, Giza',
      farmer: 'Nour Ahmed',
      email: 'nour.ahmed@email.com',
      phone: '+20 105 XXX XXXX',
      rejectedOn: 'Jan 08, 2024',
      rejectedDaysAgo: 124,
      status: 'Rejected',
      reason: 'Land images do not match the described location. GPS mismatch.',
      crop: 'Vegetables',
      size: '8 Feddan',
      fundingGoal: 'EGP 140,000',
      expectedROI: '12-14%',
      rejectionDetails:
        'Submitted land photos did not correspond with the declared GPS coordinates, raising concerns about site authenticity and acreage accuracy.',
      documents: { pdf: 2, images: 4 },
      documentsList: [
        { name: 'Site Photos.jpg', type: 'image' },
        { name: 'GPS Report.pdf', type: 'pdf' },
      ],
    },
    {
      project: 'Olive Grove Project',
      location: 'Siwa, Matrouh',
      farmer: 'Samira Hassan',
      email: 'samira.hassan@email.com',
      phone: '+20 106 XXX XXXX',
      rejectedOn: 'Dec 28, 2023',
      rejectedDaysAgo: 136,
      status: 'Rejected',
      reason: 'Water source documentation is insufficient. No valid water permit.',
      crop: 'Fruits',
      size: '15 Feddan',
      fundingGoal: 'EGP 240,000',
      expectedROI: '14-17%',
      rejectionDetails:
        'The project lacks valid water permit documentation, and existing water source details are insufficient for long-term irrigation planning.',
      documents: { pdf: 3, images: 2 },
      documentsList: [
        { name: 'Water Permit.pdf', type: 'pdf' },
        { name: 'Well Photos.jpg', type: 'image' },
      ],
    },
    {
      project: 'Corn Field Investment',
      location: 'Beni Suef',
      farmer: 'Tarek Mahmoud',
      email: 'tarek.mahmoud@email.com',
      phone: '+20 107 XXX XXXX',
      rejectedOn: 'Dec 20, 2023',
      rejectedDaysAgo: 144,
      status: 'Rejected',
      reason: 'Financial projections are unrealistic. Expected ROI overestimated.',
      crop: 'Grains',
      size: '12 Feddan',
      fundingGoal: 'EGP 210,000',
      expectedROI: '9-11%',
      rejectionDetails:
        'The financial model overstated expected returns and did not account for rising input costs, making the current projection unsupported.',
      documents: { pdf: 4, images: 3 },
      documentsList: [
        { name: 'Budget Forecast.pdf', type: 'pdf' },
        { name: 'Cost Sheet.pdf', type: 'pdf' },
      ],
    },
    {
      project: 'Herb Garden Project',
      location: 'Aswan',
      farmer: 'Layla Ibrahim',
      email: 'layla.ibrahim@email.com',
      phone: '+20 108 XXX XXXX',
      rejectedOn: 'Dec 15, 2023',
      rejectedDaysAgo: 149,
      status: 'Rejected',
      reason: 'National ID verification failed. The submitted ID does not match.',
      crop: 'Herbs',
      size: '3 Feddan',
      fundingGoal: 'EGP 110,000',
      expectedROI: '10-12%',
      rejectionDetails:
        'The farmer’s national identification documents could not be verified. Please submit valid ID to proceed with funding.',
      documents: { pdf: 2, images: 1 },
      documentsList: [
        { name: 'ID Scan.pdf', type: 'pdf' },
        { name: 'Site Photo.jpg', type: 'image' },
      ],
    },
  ];

  get filteredProjects() {
    const query = this.searchQuery.trim().toLowerCase();
    const maxDays = this.selectedDateRange === 'Last 30 Days' ? 30 : this.selectedDateRange === 'Last 90 Days' ? 90 : Infinity;

    return this.rejectedProjects.filter((project) => {
      const matchesSearch =
        !query ||
        project.project.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.farmer.toLowerCase().includes(query) ||
        project.crop.toLowerCase().includes(query) ||
        project.reason.toLowerCase().includes(query);

      const matchesCrop = this.selectedCrop === 'All Crops' || project.crop === this.selectedCrop;
      const matchesDate = project.rejectedDaysAgo <= maxDays;

      return matchesSearch && matchesCrop && matchesDate;
    });
  }

  get summaryCards() {
    const distinctFarmers = new Set(this.rejectedProjects.map((item) => item.farmer)).size;
    const last30 = this.rejectedProjects.filter((item) => item.rejectedDaysAgo <= 30).length;
    const pendingAppeals = this.rejectedProjects.filter((item) => item.status === 'Under Appeal').length;

    return [
      {
        title: 'Rejected Projects',
        value: this.filteredProjects.length,
        description: 'Total projects declined by experts',
      },
      {
        title: 'This Month',
        value: last30,
        description: 'Projects rejected in the last 30 days',
      },
      {
        title: 'Farmers Affected',
        value: distinctFarmers,
        description: 'Distinct farmers impacted',
      },
      {
        title: 'Pending Appeals',
        value: pendingAppeals,
        description: 'Rejection notices under appeal',
      },
    ];
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onCrop(value: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | 'Maize') {
    this.selectedCrop = value;
  }

  onDateRange(value: 'All Time' | 'Last 30 Days' | 'Last 90 Days') {
    this.selectedDateRange = value;
  }
}
