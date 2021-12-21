import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionData, where, query,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private fireStore: Firestore, private router: Router) { }

  ngOnInit(): void {
  }

  goToPage() {
    this.router.navigate(['page']);
  }

  onClick() {
    console.log("Clicked");
    const postsCollection = collection(this.fireStore, "posts");
    // var post = new Post("New Post", "New Post is about testing Post Creation in Firebase Firestore", 
    //     Date.now().toLocaleString(), "Uncategorized");

    return addDoc(postsCollection, {
      name: "New Post without Id",
      text: "New Post is about testing Post Creation in Firebase Firestore",
      date: Date.now().toLocaleString(),
      category: "Uncategorized"
    }).then(response => console.log(response));
  }

  onGet() {
    console.log("Get");
    const postsCollection = collection(this.fireStore, "posts");
    var q = query(postsCollection, where("category","==","Uncategorized"));
    collectionData(q).forEach(response => console.log(response));
  }

}
