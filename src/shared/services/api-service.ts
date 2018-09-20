import { autoinject } from 'aurelia-dependency-injection';
import { HttpClient, json } from 'aurelia-fetch-client';

import * as qs from 'querystringify';

import { JwtService } from './jwt-service';
import { config } from './config';
import { parseError, status } from "./service-helper";

@autoinject()
export class ApiService {

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  getHeaders() {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.jwtService.getToken()) {
      headersConfig[ 'Authorization' ] = `Token ${this.jwtService.getToken()}`;
    }

    return new Headers(headersConfig);
  }

  get(path, params?) {
    const options = {
      method: 'GET',
      headers: this.getHeaders()
    };

    return this.http.fetch(`${config.api_url}${path}?${qs.stringify(params)}`, options)
      .then(status)
      .catch(parseError);
  }

  put(path, body) {
    const options = {
      method: 'PUT',
      headers: this.getHeaders(),
      body: json(body)
    };

    return this.http.fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }

  post(path, body = {}) {
    const options = {
      method: 'POST',
      headers: this.getHeaders(),
      body: json(body)
    };

    return this.http.fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }

  delete(path) {
    const options = {
      method: 'DELETE',
      headers: this.getHeaders()
    };

    return this.http.fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }
}
