import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserStore } from '../../store/user.store';
import { User } from '../../interfaces/user.interface';
import { size } from 'lodash';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { GroupPipe } from "../../pipes/group.pipe";

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [UserCardComponent, Toast, GroupPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  readonly store = inject(UserStore);
  groupList = ['Retail', 'Wholesale', 'Digital', 'Content'];

  constructor(private messageService: MessageService) {}

  onEdit = (event: User) => {
    const { name, department } = event;
    alert(`Edit:  ${name} - ${department}`);
  };

  onDelete = (event: User) => {
    const { name } = event;
    this.store.deleteUser(event).then((isSuccess) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Delete ${name} successfully`,
      });
    });
  };

  get count() {
    return size(this.store.sortedUsers());
  }
}
