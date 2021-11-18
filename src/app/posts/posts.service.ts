import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + "posts";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  authstatusListener = new Subject<boolean>();
  getAuthStatusListener() {
    return this.authstatusListener.asObservable();
  }
  constructor(private http: HttpClient, private router: Router) { }
  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    // return this.posts;
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    return this.http.get<{ message: string, posts: any, maxPosts: number }>(`${BACKEND_URL
      }${queryParams}`).pipe(map((postt) => {
        return {
          posts: postt.posts.map((posttt: any) => {
            // console.log("post", posttt)
            return {
              title: posttt.title,
              content: posttt.content,
              id: posttt._id,
              imagePath: posttt.imagePath,
              creator: posttt.creator
            }
          }), maxPosts: postt.maxPosts
        };
      })).subscribe((e) => {
        this.posts = e.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: e.maxPosts });
        // console.log("eeee", e);
      })
  }
  getPstsNew() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string) {
    // return {
    //   ...this.posts.find(p => p.id === id)
    // };
    return this.http.get(`${BACKEND_URL
      }/${id}`);
  }
  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: "", title: title, content: content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    return this.http.post<{ message: string, post: Post }>(BACKEND_URL
      , postData).subscribe((e: any) => {
        // const id = e.postId
        // post.id = id;
        // const post: Post = { id: e.post.id, title: title, content: content, imagePath: e.post.imagePath };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }
  deletePost(id: string) {
    // console.log("iddddd", id);
    return this.http.delete(`${BACKEND_URL
      }/${id}`)
    // this.posts = this.posts.filter((post: any) => {
    //   return post.id !== id;
    // });
    // this.postsUpdated.next([...this.posts]);
    // return p;

  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath: "" };
    let postData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };

    }
    let p = this.http.put(`${BACKEND_URL
      }/${id}`, postData).subscribe((e: any) => {
        // const updatedPost = [...this.posts];
        // const oldPostIndex = updatedPost.findIndex((p: any) => p.id === id);
        // const post: Post = {
        //   id: id, title: title, content: content, imagePath: e.imagePath
        // }
        // updatedPost[oldPostIndex] = post;
        // this.posts = updatedPost;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);

      }, (err: any) => {
        // this.isLoading = false;
        this.authstatusListener.next(false);
        this.router.navigate(['/']);

      })

  }
}
// xcbkCpGWqY5nqZXR