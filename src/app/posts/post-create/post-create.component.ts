// @ts-nocheck
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscriber } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './ṃime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  constructor(private postService: PostsService, private route: ActivatedRoute) { }

  enterdContent = ""
  enterdTitle = ""
  post = " ";
  mode = 'create';
  postId: any = "";
  singlePost: any;
  isLoading = false;
  imagePriview: string;
  authstatusSubsciption!: Subscriber;
  // @Output() postCreated = new EventEmitter<Post>();

  ///////////////////////reactive form//////////////////////////

  form!: FormGroup;



  ///////////////////////////////////////////////////
  ngOnInit(): void {

    ///////////////////form//////////////////
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),

    })

    ////////////////////////////////////
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // console.log(this.postId);
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((p: any) => {
          this.isLoading = false;
          this.singlePost = {
            id: p._id,
            title: p.title,
            content: p.content,
            imagePath: p.imagePath,
            creator: p.creator
          };
          /////////to add values for form while editing ///////////////////////////
          this.form.setValue({
            title: this.singlePost.title,
            content: this.singlePost.content,
            image: this.singlePost.imagePath,
          });
          //////////////////////////////////////////////////////////////////////////////
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
    this.authstatusSubsciption = this.postService.getAuthStatusListener().subscribe((status: any) => {
      this.isLoading = false;
    })
  }
  // onAddPost(text: any) {
  //   // this.post == " " ? "my post is here" : " ";
  //   // this.post = "my post is here"
  //   this.post = text.value;
  // }
  // onAddPost() {
  //   // this.post == " " ? "my post is here" : " ";
  //   // this.post = "my post is here"
  //   const post: Post = {
  //     title: this.enterdTitle,
  //     content: this.enterdContent
  //   }
  //   this.postCreated.emit(post);
  // }
  // onAddPost(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   const post: Post = {
  //     title: form.value.title,
  //     content: form.value.content
  //   }
  //   this.postCreated.emit(post);
  // }
  ////////////////////////////////template form/////////////////////////////
  // onSavePost(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   if (this.mode === 'create') {
  //     this.postService.addPost(form.value.title, form.value.content);
  //     form.resetForm();
  //   } else {
  //     this.postService.updatePost(this.postId, form.value.title, form.value.content);
  //     form.resetForm();
  //   }
  // }
  /////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////for reactive form/////////////////////////////////
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();

  }
  ////////////////////////////////////////////////////////////////////////////////
  getErrorMessage() {
    return "please enter valid content"
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    // console.log("filee", file);
    // console.log("form", this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePriview = reader.result;
    };
    reader.readAsDataURL(file);
    this.imagePriview
  }
  ngOnDestroy(): void {
    this.authstatusSubsciption.unsubscribe();
  }
}
