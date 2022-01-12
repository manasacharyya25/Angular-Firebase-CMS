import { Component, OnInit } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { getBytes, ref, Storage } from '@angular/fire/storage';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private fireStore: Firestore, private fireStorage: Storage, private utils: Utils) {}

  async ngOnInit() {
    let pageTitle : string|null = '';
    let postResponse: Post;

    this.route.queryParamMap.subscribe(params => {
      pageTitle = params.get("title")
    })

    const postCollection = collection(this.fireStore, 'posts');
    let q = query(postCollection, where('title', '==', pageTitle));

    await collectionData(q).forEach((response: DocumentData[]) => {
      response.forEach((post: any) => {
        postResponse = new Post(
          post.title,
          post.content,
          post.date,
          post.category,
          post.page
        );

        if (postResponse.imageUrl) {
          postResponse.setImageUrl(this.getImage(post.imageUrl));
        }

        this.pagePost = postResponse;
        this.showPost = true;
      });
    });
  }

  private getImage(imageUrl: string): string {
    let imageSrc: string|null = '';

    const gsReference = ref(this.fireStorage, 'gs://school-cms-966e4.appspot.com/Featured Content');
    var x  = getBytes(gsReference).then((buffer: ArrayBuffer) => {
        imageSrc = this.utils.getSafeUrlFromArrayBuffer(buffer);
    });

    return imageSrc;
}
}
