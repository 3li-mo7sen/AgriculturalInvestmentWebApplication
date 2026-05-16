import { Component } from '@angular/core';
import { ExpertReviewsSearch } from './components/expert-reviews-search/expert-reviews-search';
import { ExpertReviewsList } from './components/expert-reviews-list/expert-reviews-list';

interface ReviewItem {
  project: string;
  location: string;
  landDetails: string;
  farmer: string;
  phone: string;
  submitted: string;
  size: string;
  crop: string;
  soilType: string;
  water: string;
  ownership: string;
  documents: { pdf: number; images: number };
  documentsList: { name: string; type: string }[];
  fundingGoal: string;
  expectedROI: string;
  urgency: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-expert-reviews',
  imports: [ExpertReviewsList, ExpertReviewsSearch],
  templateUrl: './expert-reviews.html',
  styleUrls: ['./expert-reviews.css'],
})
export class ExpertReviews {
  searchQuery = '';
  urgencyFilter: 'All Urgency' | 'High' | 'Medium' | 'Low' = 'All Urgency';
  cropFilter: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' = 'All Crops';

  reviews: ReviewItem[] = [
    {
      project: 'Wheat Farm Investment',
      location: 'Kafr El-Sheikh, Beheira',
      landDetails: '15 Feddan',
      farmer: 'Ahmed Hassan',
      phone: '+20 100 XXX XXXX',
      submitted: '2 hours ago',
      size: '15 Feddan',
      crop: 'Wheat',
      soilType: 'Fertile Black',
      water: 'Nile Irrigation',
      ownership: 'Owned',
      documents: { pdf: 4, images: 6 },
      documentsList: [
        { name: 'Land Ownership.pdf', type: 'pdf' },
        { name: 'National ID.jpg', type: 'image' },
        { name: 'Agricultural Permit.pdf', type: 'pdf' },
        { name: 'Water Rights.pdf', type: 'pdf' },
      ],
      fundingGoal: 'EGP 250,000',
      expectedROI: '15-18%',
      urgency: 'High',
    },
    {
      project: 'Mango Orchard Project',
      location: 'Abu Sultan, Ismailia',
      landDetails: '8 Feddan',
      farmer: 'Mohamed Ali',
      phone: '+20 101 XXX XXXX',
      submitted: '5 hours ago',
      size: '8 Feddan',
      crop: 'Fruits',
      soilType: 'Sandy Loam',
      water: 'Drip Irrigation',
      ownership: 'Leased',
      documents: { pdf: 3, images: 8 },
      documentsList: [
        { name: 'Ownership Contract.pdf', type: 'pdf' },
        { name: 'Farmer ID.jpg', type: 'image' },
        { name: 'Crop Plan.pdf', type: 'pdf' },
      ],
      fundingGoal: 'EGP 180,000',
      expectedROI: '12-15%',
      urgency: 'Medium',
    },
    {
      project: 'Rice Paddy Investment',
      location: 'Desouk, Kafr El-Sheikh',
      landDetails: '12 Feddan',
      farmer: 'Omar Mostafa',
      phone: '+20 102 XXX XXXX',
      submitted: '1 day ago',
      size: '12 Feddan',
      crop: 'Rice',
      soilType: 'Clay',
      water: 'Flood Irrigation',
      ownership: 'Owned',
      documents: { pdf: 5, images: 4 },
      documentsList: [
        { name: 'Title Deed.pdf', type: 'pdf' },
        { name: 'Identity Card.jpg', type: 'image' },
        { name: 'Irrigation Permit.pdf', type: 'pdf' },
        { name: 'Soil Report.pdf', type: 'pdf' },
        { name: 'Harvest Plan.pdf', type: 'pdf' },
      ],
      fundingGoal: 'EGP 220,000',
      expectedROI: '14-17%',
      urgency: 'Low',
    },
  ];

  get filteredReviews() {
    return this.reviews.filter((review) => {
      const query = this.searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        review.project.toLowerCase().includes(query) ||
        review.location.toLowerCase().includes(query) ||
        review.farmer.toLowerCase().includes(query) ||
        review.crop.toLowerCase().includes(query);

      const matchesUrgency =
        this.urgencyFilter === 'All Urgency' || review.urgency === this.urgencyFilter;
      const matchesCrop =
        this.cropFilter === 'All Crops' || review.crop === this.cropFilter;

      return matchesSearch && matchesUrgency && matchesCrop;
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onUrgency(value: 'All Urgency' | 'High' | 'Medium' | 'Low') {
    this.urgencyFilter = value;
  }

  onCrop(value: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice') {
    this.cropFilter = value;
  }
}
