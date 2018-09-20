import { User } from "../models/user";

export class SharedState {
  currentUser = new User();
  isAuthenticated = false;
}
