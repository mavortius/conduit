import { autoinject } from "aurelia-dependency-injection";
import { ApiService } from "./api-service";

const resource = '/articles';

@autoinject()
export class CommentService {

  constructor(private apiService: ApiService) {
  }

  add(slug, payload) {
    return this.apiService.post(`${resource}/${slug}/comments`, { comment: { body: payload } })
      .then(data => data.comment);
  }

  getList(slug) {
    return this.apiService.get(`${resource}/${slug}/comments`)
      .then(data => data.comments);
  }

  destroy(commentId, articleSlug) {
    return this.apiService.delete(`${resource}/${articleSlug}/comments/${commentId}`);
  }
}
