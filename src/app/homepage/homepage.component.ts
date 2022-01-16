import { Component, LOCALE_ID, OnInit } from '@angular/core';
import {
  Firestore, addDoc, collection, collectionData, query,
  DocumentData
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { doc, getDoc } from '@firebase/firestore';
import { FirebaseConverters } from '../models/firebase.converters';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private fireStore: Firestore, private router: Router) { }

  ngOnInit(): void {
  }

  goToPageWithCategory(category: string) {
    this.router.navigate(['page'], {
      queryParams: {
        category: category
      }
    });
  }

  onClick() {
    const postsCollection = collection(this.fireStore, "posts");

    addDoc(postsCollection, FirebaseConverters.toFirestore(new Post("", "ABC", "abd", new Date().toLocaleDateString(), "casdf", "pagd"))).then(response => console.log(response));
  }

  onGet() {
    console.log("Get");
    const postsCollection = collection(this.fireStore, "posts");
    

    // var q = query(postsCollection, where("category","==","Uncategorized"));
    var q = query(postsCollection);
    // var docResponse = getDoc(docRef);
    
    collectionData(q).forEach((response:DocumentData[]) => {
      response.forEach((post: any) => {
        var p = new Post(post.id, post.title, post.content, post.date, post.category, post.page);
        console.log(p)
      });
    });
  }

}
