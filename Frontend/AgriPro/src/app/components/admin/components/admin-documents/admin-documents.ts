import { Component } from '@angular/core';
import { AdminDocCards } from './components/admin-doc-cards/admin-doc-cards';
import { AdminDocList } from './components/admin-doc-list/admin-doc-list';

@Component({
  selector: 'app-admin-documents',
  imports: [AdminDocCards,AdminDocList],
  templateUrl: './admin-documents.html',
  styleUrl: './admin-documents.css',
})
export class AdminDocuments {

}
