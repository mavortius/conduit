import { autoinject } from "aurelia-framework";
import { Router, activationStrategy } from "aurelia-router";
import { ValidationController, ValidationControllerFactory, ValidationRules } from "aurelia-validation";

import { UserService } from "../../shared/services/user-service";

@autoinject()
export class AuthComponent {
  controller: ValidationController;

  type = '';
  username = '';
  email = '';
  password = '';
  errors = null;

  constructor(private userService: UserService,
              private router: Router,
              controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();

    ValidationRules
      .ensure('email').required().email()
      .ensure('password').required().minLength(8)
      .ensure('username').required().when((auth: AuthComponent) => auth.type === 'register')
      .on(this);
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  activate(params, routeConfig) {
    this.type = routeConfig.name;
  }

  submit() {
    this.errors = null;

    this.controller.validate()
      .then(result => {
        if (result.valid) {
          const credentials = {
            username: this.username,
            email: this.email,
            password: this.password
          };
          this.userService.attemptAuth(this.type, credentials)
            .then(data => this.router.navigateToRoute('home'))
            .catch(promise => {
              promise.then(err => this.errors = err.errors);
            });
        }
      })
  }

  get canSave() {
    if (this.type === 'login') {
      return this.email !== '' && this.password !== '';
    } else {
      return this.username !== '' && this.email !== '' && this.password !== '';
    }
  }
}
