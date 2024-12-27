import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, debounceTime, Subject, takeUntil } from 'rxjs';
import { SelectInterface } from '../../interfaces/select.interface';
import { UserStore } from '../../store/user.store';

@Component({
  standalone: true,
  selector: 'app-filter',
  imports: [
    ToolbarModule,
    CommonModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    Select,
    ReactiveFormsModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnDestroy {
  readonly store = inject(UserStore);

  @Output() refresh = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();
  text = new BehaviorSubject('');
  destroy = new Subject<void>();

  sortOptions: SelectInterface[] = [
    { code: 'name', name: 'Name' },
    { code: 'age', name: 'Age' },
  ];
  selectedSort: SelectInterface | undefined;
  formGroup: FormGroup = new FormGroup({});

  constructor() {
    this.formGroup = new FormGroup({
      text: new FormControl<string | null>(null),
      selectedSort: new FormControl<SelectInterface | null>(null),
    });

    this.text
      .pipe(takeUntil(this.destroy), debounceTime(500))
      .subscribe((res) => {
        this.onFilterBy('keyword', res);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onInput = (value: string) => {
    this.text.next(value);
  };

  onFilterBy = (key: string, value: string) => {
    switch (key) {
      case 'keyword':
        this.store.updateKeyword(value);
        break;

      case 'selectedSort':
        this.store.updateOrder(value);
        break;

      default:
        break;
    }
  };

  onReset = () => {
    this.formGroup.reset();
    this.store.resetFilter();
  };

  onRefresh = () => {
    this.onReset();
    this.refresh.emit();
  };
}
