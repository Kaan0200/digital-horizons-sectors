import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { User } from '../types';

export class UserStore {
  root: RootStore;
  users: Map<string, User>;
  roomId: string | undefined;
  //users: [key: string]: User;

  constructor(root: RootStore) {
    makeAutoObservable(this);
    this.root = root;
    this.users = new Map<string, User>();
  }
}
