import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';
import { User } from '../interfaces/user.interface';

@Pipe({
  name: 'groupBy',
})
export class GroupPipe implements PipeTransform {
  transform(value: Array<User>, ...args: any[]): Array<User> {
    const [group] = args;
    const filteredList = filter(
      value,
      ({ department }) => department === group
    );
    return filteredList;
  }
}
