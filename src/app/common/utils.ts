import { Injectable, SecurityContext } from '@angular/core';
import { collection, collectionData, DocumentData, Firestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { getBytes, ref, Storage } from '@angular/fire/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  constructor(private fireStore: Firestore, private fireStorage: Storage, private domSanitizer: DomSanitizer) {}

  getSafeUrlFromArrayBuffer(buffer: ArrayBuffer): string|null {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    var base64String = btoa(binary);
    var safeUrl =  this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
    return this.domSanitizer.sanitize(SecurityContext.URL, safeUrl)
  }

  async getPostByCategory(category: string): Promise<Post> {
    let postResponse: Post;

    const postCollection = collection(this.fireStore, 'posts');
    let q = query(postCollection, where('category', '==', category));

    return new Promise<Post>((resolve, reject) => {
      collectionData(q).forEach((response: DocumentData[]) => {
        if(response.length==0) {
          resolve(new Post('', '','','','',''));
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
            postResponse.setImageUrl(this.getImage(post.imageUrl));
          }
          resolve(postResponse);
        });
      })
    });
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    let postsList: Post[] = [];

    const postCollection = collection(this.fireStore, 'posts');
    // orderBy("date", "desc"), limit(10), 
    let q = query(postCollection, where('category', '==', category));

    return new Promise<Post[]>((resolve, reject) => {
      collectionData(q).forEach((response: DocumentData[]) => {
        if(response.length==0) {
          resolve([]);
        }
        response.forEach((post: any) => {
          let postResponse: Post = new Post(
            post.id,
            post.title,
            post.content,
            post.date,
            post.category,
            post.page
          );
          postsList.push(postResponse)
        });
      })
      resolve(postsList);
    });

  }

  async searchPosts(search_term: string): Promise<Post> {
    const postCollection = collection(this.fireStore, 'posts');
    let q = query(postCollection, where('title', '==', search_term), where('page','!=', 'Homepage'), orderBy("date", "desc"), limit(10));

    return new Promise<Post>((resolve, reject) => {
      collectionData(q).forEach((response: DocumentData[]) => {
        console.log(response)
        if(response.length==0) {
          reject("No Result Found")
        }
        response.forEach((post: any) => {
          let postResponse: Post = new Post(
            post.id,
            post.title,
            post.content,
            post.date,
            post.category,
            post.page
          );
          resolve(postResponse)
        });
      })
    });

  }

  async getNavbarLinks() : Promise<Map<String, String[]>> {
    var navbarLinksMap: Map<any, any> = new Map();

    const postCollection = collection(this.fireStore, 'navbar');
    let q = query(postCollection);

    return new Promise<any>((resolve, reject) => {
      collectionData(q).forEach((response: DocumentData[]) => {
        if(response.length==0) {
          reject("No Result Found")
        }
        response.forEach((navbarList: any) => {
          navbarLinksMap.set(navbarList.label, navbarList.sublinks);
        });
        resolve(navbarLinksMap);
      })
    });
  }


  private getImage(imageUrl: string): string {
    let imageSrc: string|null = '';

    const gsReference = ref(this.fireStorage, 'gs://school-cms-966e4.appspot.com/Featured Content');
    var x  = getBytes(gsReference).then((buffer: ArrayBuffer) => {
        imageSrc = this.getSafeUrlFromArrayBuffer(buffer);
    });

    return imageSrc;
  }


}
