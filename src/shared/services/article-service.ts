import { autoinject } from "aurelia-framework";
import { ApiService } from "./api-service";

const resource = '/articles';

@autoinject()
export class ArticleService {

  constructor(private apiService: ApiService) {
  }

  getList(type, params) {
    return this.apiService.get(`${resource}${((type === 'feed') ? '/feed' : '')}`, params);
  }

  get(slug) {
    return this.apiService.get(`${resource}${slug}`)
      .then(data => data.article);
  }

  destroy(slug) {
    return this.apiService.delete(`${resource}${slug}`);
  }

  save(article) {
    if (article.slug) {
      return this.apiService.put(`${resource}${article.slug}`, { article })
        .then(data => data.article);
    } else {
      return this.apiService.post(resource, {article})
        .then(data => data.article);
    }
  }

  favorite(slug) {
    return this.apiService.post(`${resource}${slug}/favorite`);
  }

  unfavorite(slug) {
    return this.apiService.delete(`${resource}${slug}/favorite`);
  }
}
