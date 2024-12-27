import { Component, inject } from '@angular/core';
import { FilterComponent } from './features/filter/filter.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { UserStore } from './store/user.store';

@Component({
  selector: 'app-root',
  imports: [FilterComponent, UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly store = inject(UserStore);
  title = 'user';

  constructor() {}
}
