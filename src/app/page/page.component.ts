import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore, query, where } from '@angular/fire/firestore';
import { getBytes, ref, Storage } from '@angular/fire/storage';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtmlPipe } from '../common/SafeHtmlPipe';
import { Utils } from '../common/utils';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageComponent implements OnInit {
  pagePost: Post;
  showPost: boolean;
  postImage: SafeUrl|null;

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
      if(response.length==0) {
        // TODO: Redirect to 404;
        this.router.navigate(['']);
      }
      response.forEach(async (post: any) => {
        postResponse = new Post(
          post.id,
          post.title,
          post.content,
          post.date,
          post.category,
          post.page,
          post.imageUrl,
          post.attachmentUrl
        );

        if (postResponse.imageUrl) {
          let gsReference = ref(this.fireStorage, postResponse.title);

          if(postResponse.page=="Homepage") {
            gsReference = ref(this.fireStorage, postResponse.category);
          }

          await getBytes(gsReference).then((buffer: ArrayBuffer) => {
            this.postImage = this.utils.getSafeUrlFromArrayBuffer(buffer);
          });
        }
        
        this.pagePost = postResponse;
        this.showPost = true;
      });
    });
  }

  downloadAttachment() {
    let gsReference = ref(this.fireStorage, `files/${this.pagePost.attachmentUrl}`);
    
    var x  = getBytes(gsReference).then((buffer: ArrayBuffer) => {
      let blob = new Blob([buffer]);
      let url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = `${this.pagePost.attachmentUrl}`;
      anchor.href = url;
      anchor.click();
    });
    
  }

  private getImage(imageUrl: string): SafeUrl|null {
    let imageSrc: SafeUrl;
    
    const gsReference = ref(this.fireStorage, imageUrl);
    var x  = getBytes(gsReference).then((buffer: ArrayBuffer) => {
        imageSrc = this.utils.getSafeUrlFromArrayBuffer(buffer);
        return imageSrc;
    });

    return null;
}
}
