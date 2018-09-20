import { autoinject } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import { RouteConfig, Router } from 'aurelia-router';

import { ArticleService } from '../../shared/services/article-service';
import { CommentService } from '../../shared/services/comment-service';
import { SharedState } from '../../shared/state/shared-state';
import { ProfileService } from '../../shared/services/profile-service';

@autoinject()
export class ArticleComponent {
  routeConfig: RouteConfig;
  slug: string;
  article;
  comments = [];
  myComment: string;

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private sharedState: SharedState,
              private profileService: ProfileService,
              private router: Router) {
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.slug = params.slug;

    return this.articleService.get(this.slug)
      .then(article => {
        this.article = article;
        this.commentService.getList(this.slug)
          .then(comments => this.comments = comments);
      });
  }

  onToggleFavorited() {
    this.article.favorited = !this.article.favorited;

    if (this.article.favorited) {
      this.article.favoritesCount++;
      this.articleService.favorite(this.slug);
    } else {
      this.article.favoritesCount--;
      this.articleService.unfavorite(this.slug);
    }
  }

  onToggleFollowing() {
    this.article.author.following = !this.article.author.following;

    if (this.article.author.following)
      this.profileService.follow(this.article.author.username);
    else
      this.profileService.unfollow(this.article.author.username);
  }

  postComment() {
    return this.commentService.add(this.slug, this.myComment)
      .then(comment => {
        this.comments.push(comment);
        this.myComment = '';
      });
  }

  deleteArticle() {
    this.articleService.destroy(this.article.slug)
      .then(() => this.router.navigateToRoute('home'));
  }

  deleteComment(commentId) {
    this.commentService.destroy(commentId, this.slug)
      .then(() => {
        this.commentService.getList(this.slug)
          .then(comments => this.comments = comments);
      })
  }

  @computedFrom('article.author.username')
  get canModify() {
    return this.article.author.username === this.sharedState.currentUser.username;
  }
}
