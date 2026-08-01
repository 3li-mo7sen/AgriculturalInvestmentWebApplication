import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-farmer-investment',
  imports: [CommonModule,FormsModule],
  templateUrl: './farmer-investment.html',
  styleUrls: ['./farmer-investment.css'],
})
export class FarmerInvestment {
  @Output() previous = new EventEmitter<void>();
  
  @Output() submitForm = new EventEmitter<any>(); // حدث إرسال الفورم للـ API النهائي

  // استقبال كل الداتا اللي اتجمعت من الخطوات السابقة لعرضها في الـ Summary Card
  @Input() projectSummaryData: any = {};

  // البيانات الخاصة بالخطوة الحالية (تطابق Swagger)
  data = {
    minimumInvestment: null as number | null,
    farmerProfitShare: null as number | null,
    investorProfitShare: null as number | null,
  };

  sendData() {
    // إرسال بيانات الاستثمار للـ Parent ليقوم بالـ POST النهائي
    console.log(' Submit Button Clicked!');
    this.submitForm.emit(this.data);
  }
}
