import { Component, OnInit } from '@angular/core';
import { getBytes, ref, uploadBytes  } from "firebase/storage";
import { Storage } from '@angular/fire/storage';
import { FormControl } from "@angular/forms";
import {
  Firestore, addDoc, collection, collectionData, query,
  where, DocumentData
} from '@angular/fire/firestore';
import { FirebaseConverters } from '../models/firebase.converters';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  formTitle: string;

  featuredPostTitle: string;
  featuredPostContent : FormControl;

  
  constructor(private fireStore: Firestore, private fireStorage: Storage) {
    this.formTitle = "Homepage"
    this.featuredPostContent = new FormControl("");
   }

  ngOnInit(): void {
  }

  showForm(name: string) {
    this.formTitle =  name;
  }

  uploadImageForPost(event: any, postName: string) {
    var imageFile = event.target.files[0];

    var imgRef = ref(this.fireStorage, postName);

    uploadBytes(imgRef, imageFile).then((snapshot) => {
      console.log(snapshot);
    });

  }

  // TODO: Testing Get Image. Will Move to Homepage and Post Page Later on 
  getImage() {
    const gsReference = ref(this.fireStorage, 'gs://school-cms-966e4.appspot.com/Featured Content');
    var x  = getBytes(gsReference)
    console.log(x);
  }

  getPost() {
    const postsCollection = collection(this.fireStore, "posts");
    var q = query(postsCollection, where("page","==","Homepage"));

    collectionData(q).forEach((response:DocumentData[]) => {
      response.forEach((post: any) => {
        var p = new Post(post.title, post.content, post.date, post.category, post.page);
        console.log(p)
      });
    });
  }

  submit() {
    const postsCollection = collection(this.fireStore, "posts");

    console.log(postsCollection)
  
    addDoc(postsCollection, FirebaseConverters.toFirestore(
      new Post(this.featuredPostTitle, this.featuredPostContent.value, new Date().toLocaleDateString(), "Uncategorized", "Homepage"))
    ).then(response => console.log(response));
  }
}
