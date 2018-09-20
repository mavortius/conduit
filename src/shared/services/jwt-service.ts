const tokenKey = 'jwtToken';

export class JwtService {

  getToken() {
    return window.localStorage[tokenKey];
  }

  saveToken(token) {
    window.localStorage[tokenKey] = token;
  }

  destroyToken() {
    window.localStorage.removeItem(tokenKey);
  }
}
