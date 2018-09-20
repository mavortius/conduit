import { autoinject } from "aurelia-dependency-injection";

import { ApiService } from "./api-service";

const resource = '/profiles';

@autoinject()
export class ProfileService {

  constructor(private apiService: ApiService) { }

  get(username) {
    return this.apiService.get(`${resource}/${username}`)
      .then(data => data.profile);
  }

  follow(username) {
    return this.apiService.post(`${resource}/${username}/follow`);
  }

  unfollow(username) {
    return this.apiService.delete(`${resource}/${username}/follow`);
  }
}
