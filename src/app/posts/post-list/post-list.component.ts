import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(private postService: PostsService, private authService: AuthService) { }

  // @Input() posts: Post[] = [];
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  authListener!: Subscription;
  userAutnenticated = false;
  userId!: string;
  private postsubscribe!: Subscription;
  ngOnInit(): void {
    // this.posts = this.postService.getPosts();
    this.userId = this.authService.userId;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.isLoading = true;
    this.postsubscribe = this.postService.getPstsNew().subscribe((postData: { posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.userAutnenticated = this.authService.authorization;
    this.authListener = this.authService.authstatusListener.subscribe((e: any) => {
      // console.log("eee", e);
      if (e === true) {
        this.userAutnenticated = true;
        this.userId = this.authService.userId;
      } else {
        this.userAutnenticated = e;

      }
    })
  }
  ngOnDestroy() {
    this.postsubscribe.unsubscribe;
    this.authListener.unsubscribe();

  }
  deletingPost(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe((e: any) => {
      this.postService.getPosts(this.postPerPage, this.currentPage);

      // console.log(e.message);
    }, (err: any) => {
      this.isLoading = false;

    })
    // console.log("hiii deleted", id);
  }
  // posts = [
  //   {
  //     title: "first Post",
  //     content: "this is the first content"
  //   },
  //   {
  //     title: "second Post",
  //     content: "this is the second content"
  //   },
  //   {
  //     title: "third Post",
  //     content: "this is the third content"
  //   }
  // ]
  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);

    // console.log("event", event);
  }
  
}
