import { autoinject } from "aurelia-framework";

import { ArticleService } from './../../shared/services/article-service';

@autoinject()
export class ProfileFavoritesComponent {    
  username: string;
  articles = [];
  pageNumber: number;
  totalPages: number[];
  currentPage = 1;
  limit = 10;

  constructor(private articleService: ArticleService) { }

  activate(params, routeConfig) {
    this.username = params.name;
    return this.getArticles();
  }

  getArticles(): any {
    let queryParams = {
      limit: this.limit,
      offset: this.limit * (this.currentPage - 1),
      favorited: this.username
    };

    return this.articleService.getList('all', queryParams)
    .then(response => {
      this.articles.splice(0);
      this.articles.push(...response.articles)

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(new Array(Math.ceil(response.articlesCount / this.limit)), (val, index) => index + 1);
    });
  }

  setPageTo(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.getArticles();  
  }
}
