import { Component, OnInit, Query } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { getBytes, ref, Storage } from '@angular/fire/storage';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Utils } from '../common/utils';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  pagePost: Post;
  showPost: boolean;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private fireStore: Firestore, 
    private fireStorage: Storage, 
    private utils: Utils) {}

  async ngOnInit() {
    let pageTitle : string|null = '';
    let pageCategory : string|null = '';
    let postResponse: Post;
    let q: any;

    this.route.queryParamMap.subscribe(params => {
      pageTitle = params.get("title")
      pageCategory = params.get("category")
    })

    console.log(pageTitle)

    const postCollection = collection(this.fireStore, 'posts');
    if(pageTitle) {
      q = query(postCollection, where('title', '==', pageTitle));
    }
    else if(pageCategory) {
      q = query(postCollection, where('category', '==', pageCategory));
    }else {
      // TODO: Redirect to 404;
    }


    await collectionData(q).forEach((response: DocumentData[]) => {
      console.log(response)
      if(response.length==0) {
        // TODO: Redirect to 404;
        this.router.navigate(['']);
      }
      response.forEach((post: any) => {
        postResponse = new Post(
          post.id,
          post.title,
          post.content,
          post.date,
          post.category,
          post.page
        );

        if (postResponse.imageUrl) {
          // postResponse.setImageUrl(this.getImage(post.imageUrl));
        }

        this.pagePost = postResponse;
        this.showPost = true;
      });
    });
  }

  private getImage(imageUrl: string|SafeUrl|null): SafeUrl|null {
    let imageSrc: SafeUrl;

    const gsReference = ref(this.fireStorage, 'gs://school-cms-966e4.appspot.com/Featured Content');
    var x  = getBytes(gsReference).then((buffer: ArrayBuffer) => {
        imageSrc = this.utils.getSafeUrlFromArrayBuffer(buffer);
        return imageSrc;
    });

    return null;
}
}
