import { Component, OnInit } from '@angular/core';
import { getBytes, ref, uploadBytes  } from "firebase/storage";
import { Storage } from '@angular/fire/storage';
import { FormControl } from "@angular/forms";
import {
  Firestore, addDoc, collection, collectionData, query,
  where, DocumentData, doc
} from '@angular/fire/firestore';
import { FirebaseConverters } from '../models/firebase.converters';
import { Post } from '../models/post.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Utils } from '../common/utils';
import { setDoc, updateDoc } from '@firebase/firestore';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  formTitle: string;
  imageUrl: SafeUrl;

  currentPostTitle: string;
  currentPostContent : FormControl;
  newPostPage: string;
  recentPosts: Post[];
  searchResult: Post;
  showSearchResults: boolean;
  showEditPost: boolean;
  editPostPage: string;
  editPostId: string;

  
  constructor(private router: Router, private fireStore: Firestore, private fireStorage: Storage, private utils: Utils) {
    this.formTitle = "Homepage"
    this.currentPostContent = new FormControl("");
   }

  async ngOnInit() {
    let currentPostCategory = "Featured Content"
    await this.updateCurrentPost(currentPostCategory);
  }

  async updateCurrentPost(currentPostCategory: string) {
    let currentPost: Post = await this.utils.getPostByCategory(currentPostCategory)

    this.currentPostTitle = currentPost.title;
    this.currentPostContent = new FormControl(currentPost.content);
  }

  showForm(name: string) {
    this.formTitle =  name;
    if(this.formTitle!='Homepage') {
      this.currentPostTitle = '';
      this.currentPostContent = new FormControl('');
    }
    if(this.formTitle=='Homepage') {
      this.updateCurrentPost('Featured Content')
    }
  }

  uploadImageForPost(event: any, postName: string) {
    var imageFile = event.target.files[0];

    var imgRef = ref(this.fireStorage, postName);

    uploadBytes(imgRef, imageFile).then((snapshot) => {
      console.log(snapshot);
    });

  }

  submit(category: string) {
    this.utils.getPostByCategory(category).then(post=> {
      if(post.title || post.content || post.imageUrl || post.attachmentUrl || post.category) {
        let newPost =  new Post(post.id, this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), category, "Homepage");
        setDoc(doc(this.fireStore, "posts", post.id), FirebaseConverters.toFirestore(newPost));
      }else {
        let newPost =  new Post(UUID.UUID(), this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), category, "Homepage");
        setDoc(doc(this.fireStore, "posts", newPost.id), FirebaseConverters.toFirestore(newPost));
      }
    });
  }

  createNewPostByTitle() {
    let newPost =  new Post(UUID.UUID(), this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), "Post", this.newPostPage);
    setDoc(doc(this.fireStore, "posts", newPost.id), FirebaseConverters.toFirestore(newPost));
  }

  getPostsToEdit() {
    this.utils.getPostsByCategory("Post").then((respone: Post[]) => {
      //TODO: Paginate Results or Just Search
      this.recentPosts = respone;
    });
  }

  async searchPost(search_term: string) {
    this.showEditPost = false;
    await this.utils.searchPosts(search_term).then((response: Post)=> {
      this.searchResult = response;
    }).catch(error => {
      this.searchResult = new Post('', 'No Results Found', '', '', '', '');
    });
    this.showSearchResults = true;
  }

  navigateToPost(title: string) {
    window.open(`/page?title=${title}`, '_blank');
  }

  editPost(post: Post) {
    console.log()
    this.currentPostContent = new FormControl(post.content)
    this.currentPostTitle = post.title
    this.editPostPage = post.category;
    this.editPostId = post.id;
    this.showEditPost = true;
  }

  submitEditedPost() {
    let editedPost =  new Post(this.editPostId, this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), "Post", this.editPostPage);
    setDoc(doc(this.fireStore, "posts", this.editPostId), FirebaseConverters.toFirestore(editedPost));
  }
}
