import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  /*
  Authenticate Request
  -------------------------------------

  method 01 - Now If we need to inject the the auth service into the post service. We can inject the auth service in this constructor. then call get token on the object object and the simply add a headers to all our outgoing http request here.

  method 02 - (this method is preferable for Angular)
  * Interceptor - Interceptor for my Http client. That is a feature offered by the angular http client. We can add interceptors which are simply functions that will run on any outgoing http request and we can then manipulate these outgoing request for example to attach our token.That is actually what i want to do. It Works Like middleware*/

  addPost(title: string, content: string, image: File) {

    // FormData - It may contains text and files value.
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put<{ message: string, post: Post }>(BACKEND_URL + id, postData).subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  // postsUpdated is private property. So We need to add getter method.
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    /* pipe() method of Observable that simply allows u to add in such an operators and we can actually pipe multiple operators. So pipe is a method that accepts multiple operators.
     */
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams,).pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(BACKEND_URL + id);
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + postId);
  }

}
