import { autoinject, computedFrom, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from 'aurelia-router';

import { SharedState } from '../../shared/state/shared-state';
import { ProfileService } from 'shared/services/profile-service';

@autoinject()
export class ProfileComponent {
  router: Router;
  username: string;
  profile: Profile;

  constructor(private sharedState: SharedState,
              private profileService: ProfileService) {
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.map([
      {
        route: [''],
        moduleId: PLATFORM.moduleName('components/profile/profile-article-component'),
        name: 'profilearticle',
        title: 'Profile'
      },
      {
        route: ['favorites'],
        moduleId: PLATFORM.moduleName('components/profile/profile-favorites-component'),
        name: 'profilefavorites',
        title: 'Profile'
      }
    ]);

    this.router = router;
  }

  activate(params, routeConfig) {
    this.username = params.name;
    return this.profileService.get(this.username)
      .then(profile => this.profile = profile);
  }

  onToggleFollowing() {
    this.profile.following = !this.profile.following;

    if (this.profile.following) {
      this.profileService.follow(this.profile.username);
    } else {
      this.profileService.unfollow(this.profile.username);
    }
  }

  @computedFrom('sharedState.currentUser.username')
  get isUser() {
    return this.profile.username === this.sharedState.currentUser.username;
  }
}
