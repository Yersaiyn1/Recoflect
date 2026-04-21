import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordItem, RecordService } from '../../services/record-service';
import { AddRecordBtn } from '../../components/add-record-btn/add-record-btn';
import { AiService } from '../../services/ai-service';

@Component({
  selector: 'app-records',
  imports: [CommonModule, AddRecordBtn],
  templateUrl: './records.html',
  styleUrl: './records.css',
  providers: [RecordService],
})
export class Records implements OnInit {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  records = signal<RecordItem[]>([]);
  showAI = signal<boolean>(false);
  aiLoading = signal<boolean>(false);
  aiAdvice = signal<string | null>(null);
  aiError = signal<string | null>(null);

  incomeSort  = signal<'date-asc'|'date-desc'|'amount-asc'|'amount-desc'>('date-desc');
  expenseSort = signal<'date-asc'|'date-desc'|'amount-asc'|'amount-desc'>('date-desc');

  income  = computed(() => this.sortRecords(this.records().filter(r => r.type === 1), this.incomeSort()));
  expense = computed(() => this.sortRecords(this.records().filter(r => r.type === 2), this.expenseSort()));

  setIncomeSort(val: string)  { this.incomeSort.set(val as any); }
  setExpenseSort(val: string) { this.expenseSort.set(val as any); }

  private sortRecords(list: RecordItem[], sort: string): RecordItem[] {
    return [...list].sort((a, b) => {
      if (sort === 'amount-asc')  return parseFloat(a.amount) - parseFloat(b.amount);
      if (sort === 'amount-desc') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sort === 'date-asc')    return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }

  constructor(
    private recordService: RecordService,
    private aiService: AiService,
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading.set(true);
    this.error.set(null);
    this.recordService.getRecords().subscribe({
      next: (data: RecordItem[]) => {
        this.records.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load records. Make sure you are logged in.');
        this.loading.set(false);
      },
    });
  }

  getReflectionLabel(reflection: number): string {
    if (reflection === 1) return 'Happy';
    if (reflection === 2) return 'Neutral';
    return 'Regret';
  }

  onDelete(id: string): void {
    this.recordService.deleteRecord(id).subscribe({
      next: () => this.records.update(list => list.filter(r => r.id !== id)),
      error: () => this.error.set('Failed to delete record.'),
    });
  }

  toggleAI(): void {
    const nextState = !this.showAI();
    this.showAI.set(nextState);

    if (nextState && !this.aiAdvice() && !this.aiLoading()) {
      this.loadAIAdvice();
    }
  }

  loadAIAdvice(): void {
    this.aiLoading.set(true);
    this.aiError.set(null);

    const incomeTotal = this.income().reduce((sum, record) => sum + parseFloat(record.amount), 0);
    const expenseTotal = this.expense().reduce((sum, record) => sum + parseFloat(record.amount), 0);
    const reflectionsSummary = this.records().length
      ? this.records()
          .map(record => `${record.category_title}: ${record.type === 1 ? 'income' : 'expense'} ${record.amount}, reflection ${this.getReflectionLabel(record.reflection)}`)
          .join('; ')
      : 'No records yet.';

    const prompt = [
      'You are analyzing records in a family finance app.',
      'Give a very short response: 2-4 sentences total.',
      'Use income, expense, category patterns, and reflections (Happy, Neutral, Regret) to comment on habits.',
      'Mention one positive pattern and one thing to improve.',
      'Keep the advice practical and concise.',
      `Income total: ${incomeTotal}. Expense total: ${expenseTotal}.`,
      `Records: ${reflectionsSummary}`,
    ].join(' ');

    this.aiService.getAdvice(prompt).subscribe({
      next: response => {
        this.aiAdvice.set(response.advice);
        this.aiLoading.set(false);
      },
      error: err => {
        this.aiError.set(err?.error?.detail ?? 'Failed to get AI advice.');
        this.aiLoading.set(false);
      },
    });
  }
}
