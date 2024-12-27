import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../interfaces/user.interface';
import { computed, inject } from '@angular/core';
import { includes, lowerCase, filter, replace, sortBy, orderBy } from 'lodash';
import { UserService } from '../services/user.service';

const DEFAULT_FILTER = { keyword: '', orderBy: '' };

type UserState = {
  users: User[];
  filterCondition: { keyword: string; orderBy: string };
};

const initialState: UserState = {
  users: [],
  filterCondition: DEFAULT_FILTER,
};

export const UserStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ users, filterCondition }) => ({
    usersCount: computed(() => users().length),
    sortedUsers: computed(() => {
      const { keyword, orderBy } = filterCondition();

      const filteredUser = keyword
        ? filter(users(), (user) => {
            const { business_unit } = user;
            const transformName = lowerCase(replace(business_unit, ' ', ''));
            const valid = includes(transformName, lowerCase(keyword));
            return valid;
          })
        : users();

      return sortBy(filteredUser, orderBy);
    }),
  })),

  withMethods((store, userService = inject(UserService)) => ({
    async loadAll(): Promise<void> {
      userService.getAll().subscribe((res: any) => {
        const users = res as Array<User>;
        patchState(store, { users });
      });
    },
    updateKeyword(keyword: string) {
      patchState(store, (state) => ({
        filterCondition: { ...state.filterCondition, keyword },
      }));
    },
    updateOrder(orderBy: string) {
      patchState(store, (state) => ({
        filterCondition: { ...state.filterCondition, orderBy },
      }));
    },
    resetFilter() {
      patchState(store, { filterCondition: DEFAULT_FILTER });
    },
    deleteUser(selectedUser: User): Promise<boolean> {
      const users = filter(store.users(), (user) => user !== selectedUser);
      patchState(store, { users });
      return new Promise((resolve) => {
        resolve(true);
      });
    },
  })),

  withHooks({
    onInit(store) {
      store.loadAll();
    },
  })
);
