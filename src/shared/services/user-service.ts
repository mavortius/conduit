import { autoinject } from "aurelia-dependency-injection";

import { ApiService } from "./api-service";
import { JwtService } from "./jwt-service";
import { SharedState } from "../state/shared-state";
import { User } from "../models/user";

@autoinject()
export class UserService {

  constructor(private apiService: ApiService,
              private jwtService: JwtService,
              private sharedState: SharedState) {
  }

  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.get('/user')
        .then(data => this.setAuth(data.user));
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user) {
    this.jwtService.saveToken(user.token);
    this.sharedState.currentUser = user;
    this.sharedState.isAuthenticated = true;
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.sharedState.currentUser = new User();
    this.sharedState.isAuthenticated = false;
  }

  attemptAuth(type, credentials) {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.post(`/users${route}`, { user: credentials })
      .then(data => {
        this.setAuth(data.user);
        return data;
      });
  }

  update(user) {
    return this.apiService.put('/user', { user })
      .then(data => {
        this.sharedState.currentUser = data.user;
        return data.user;
      });
  }
}
