import { autoinject, Disposable, BindingEngine } from "aurelia-framework";

import { TagService } from '../../shared/services/tag-service';
import { ArticleService } from '../../shared/services/article-service';
import { SharedState } from '../../shared/state/shared-state';

@autoinject()
export class HomeComponent {
  subscription: Disposable;

  articles = [];
  showList = 'all';
  tags = [];
  filterTag = undefined;
  pageNumber;
  totalPages;
  currentPage = 1;
  limit = 10;

  constructor(private sharedState: SharedState,
    private bindingEngine: BindingEngine,
    private articleService: ArticleService,
    private tagService: TagService) { }

  bind() {
    this.subscription = this.bindingEngine.propertyObserver(this.sharedState, 'isAuthenticated')
      .subscribe((newValue, oldValue) => {
        console.log('homeComponent isAuthenticated: ', newValue);
      });
  }

  unbind() {
    this.subscription.dispose();
  }

  attached() {
    this.subscription.dispose();
  }

  getArticles() {
    let params = {
      limit: this.limit,
      offset: this.limit * (this.currentPage - 1),
      tag: this.filterTag
    };

    this.articleService.getList(this.showList, params)
      .then(response => {
        this.articles.splice(0);
        this.articles.push(...response.articles);

        // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
        this.totalPages = Array.from(new Array(Math.ceil(response.articlesCount / this.limit)), (val, index) => index + 1);
      });
  }

  getTags() {
    this.tagService.getList()
      .then(response => {
        this.tags.splice(0);
        this.tags.push(...response);
      });
  }

  setListTo(type, tag) {
    if (type === 'feed' && !this.sharedState.isAuthenticated) {
      return;
    }

    this.showList = type;
    this.filterTag = tag;
    this.getArticles();
  }

  getFeedLinkClass() {
    let clazz = '';

    if (!this.sharedState.isAuthenticated) {
      clazz += ' disabled';
    }

    if (this.showList === 'feed') {
      clazz += ' active';
    }

    return clazz;
  }

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.getArticles();
  }
}
