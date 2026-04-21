import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalItem, GoalService } from '../../services/goal-service';
import {AddRecordBtn} from '../../components/add-record-btn/add-record-btn';
import {AddGoal} from '../../components/add-goal-btn/add-goal-btn';
import { AiService } from '../../services/ai-service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, AddRecordBtn, AddGoal],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
  providers: [GoalService],
})
export class Goals implements OnInit {
  showForm = signal<boolean>(false);
  editingGoal = signal<GoalItem | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  goals = signal<GoalItem[]>([]);
  showAI = signal<boolean>(false);
  aiLoading = signal<boolean>(false);
  aiAdvice = signal<string | null>(null);
  aiError = signal<string | null>(null);

  newGoal = {
    title: '',
    amount: null as number | null,
    current_amount: null as number | null,
    deadline: new Date().toISOString().split('T')[0],
    importance: 2 as 1 | 2 | 3,
  };

  constructor(
    private goalService: GoalService,
    private aiService: AiService,
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading.set(true);
    this.error.set(null);
    this.goalService.getGoals().subscribe({
      next: (data: GoalItem[]) => {
        this.goals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load goals. Make sure you are logged in.');
        this.loading.set(false);
      },
    });
  }

  getProgress(goal: GoalItem): number {
    if (!goal.amount) return 0;
    return Math.min(100, (goal.current_amount / goal.amount) * 100);
  }

  getImportanceLabel(importance: number): string {
    if (importance === 1) return 'Major';
    if (importance === 2) return 'Normal';
    return 'Minor';
  }

  getImportanceClass(importance: number): string {
    if (importance === 1) return 'importance-major';
    if (importance === 2) return 'importance-normal';
    return 'importance-minor';
  }

  getDaysLeft(deadline: string): number {
    const today = new Date();
    const end = new Date(deadline);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDashoffset(goal: GoalItem): number {
    const circumference = 163.4;
    return circumference - (circumference * this.getProgress(goal)) / 100;
  }

  openAddForm(): void {
    this.editingGoal.set(null);
    this.newGoal = {
      title: '',
      amount: null,
      current_amount: null,
      deadline: new Date().toISOString().split('T')[0],
      importance: 2,
    };
    this.showForm.set(true);
  }

  openEditForm(goal: GoalItem): void {
    this.editingGoal.set(goal);
    this.newGoal = {
      title: goal.title,
      amount: goal.amount,
      current_amount: goal.current_amount,
      deadline: goal.deadline,
      importance: goal.importance,
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingGoal.set(null);
  }

  onSubmit(): void {
    if (!this.newGoal.title || !this.newGoal.amount || !this.newGoal.deadline) return;

    const payload = {
      title: this.newGoal.title,
      amount: this.newGoal.amount,
      current_amount: this.newGoal.current_amount ?? 0,
      deadline: this.newGoal.deadline,
      importance: this.newGoal.importance,
    };

    const editing = this.editingGoal();
    if (editing) {
      this.goalService.updateGoal(editing.id, payload).subscribe({
        next: (updated: GoalItem) => {
          this.goals.update(list => list.map(g => g.id === updated.id ? updated : g));
          this.closeForm();
        },
        error: () => this.error.set('Failed to update goal.'),
      });
    } else {
      this.goalService.createGoal(payload).subscribe({
        next: (created: GoalItem) => {
          this.goals.update(list => [created, ...list]);
          this.closeForm();
        },
        error: () => this.error.set('Failed to create goal.'),
      });
    }
  }

  onDelete(id: string): void {
    this.goalService.deleteGoal(id).subscribe({
      next: () => this.goals.update(list => list.filter(g => g.id !== id)),
      error: () => this.error.set('Failed to delete goal.'),
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

    const goalsSummary = this.goals().length
      ? this.goals()
          .map(goal => {
            const daysLeft = this.getDaysLeft(goal.deadline);
            return `${goal.title}: saved ${goal.current_amount} of ${goal.amount}, deadline ${goal.deadline}, days left ${daysLeft}, importance ${this.getImportanceLabel(goal.importance)}`;
          })
          .join('; ')
      : 'No goals yet.';

    const prompt = [
      'You are analyzing financial goals in a budgeting app.',
      'Give a very short response: 2-4 sentences total.',
      'For each goal, consider target amount, saved amount, importance, deadline, and days left.',
      'Point out the most urgent goal, mention if a deadline is close or overdue, and give brief motivation.',
      'Keep the tone supportive and practical.',
      `Goals: ${goalsSummary}`,
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
