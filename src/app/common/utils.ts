import { Injectable, SecurityContext } from '@angular/core';
import { collection, collectionData, doc, DocumentData, Firestore, getDoc, limit, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { getBytes, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { list, listAll } from '@firebase/storage';
import { UUID } from 'angular2-uuid';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  constructor(private fireStore: Firestore, private fireStorage: Storage, private domSanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService) {}

  getSafeUrlFromArrayBuffer(buffer: ArrayBuffer): SafeUrl{
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    var base64String = btoa(binary);
    var safeUrl =  this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
    // return this.domSanitizer.sanitize(SecurityContext.URL, safeUrl)
    return safeUrl;
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
            post.page,
            post.imageUrl,
            post.attachmentUrl
          );

          if (postResponse.imageUrl) {
            this.getImage(post.imageUrl).then( response => {
              postResponse.setImageUrl(response);
            });
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
            post.page,
            post.imageUrl,
            post.attachmentUrl
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

  async createNewPageInNavbar(currentPostTitle: string, newPostPage: string) {
    let menuIds =  new Map<string, string>();
    menuIds.set("Admission", "JcXcSpLhRcqBpGGCbFhu")
    menuIds.set("Administration", "QZqDxbgNWs0REYHiFLkn")
    menuIds.set("Academics", "S9QreURHigWQOxvba8DN")
    menuIds.set("Miscellaneous", "bQySVR0vx1PZpaTl6prg")
    menuIds.set("About Us", "d9RMYPpiC2zZMt7RayVK")


    const docRef = doc(this.fireStore, "navbar",menuIds.get(newPostPage)||"");
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let docSnap2 = docSnap.data();

      const index = docSnap2["sublinks"].indexOf(currentPostTitle, 0);
      console.log(index)
      if(index>-1) {
        docSnap2["sublinks"].push(currentPostTitle)
        setDoc(doc(this.fireStore, "navbar", menuIds.get(newPostPage)||""), docSnap2);
      }
    } else {
      console.log("No such document!");
    }
  }

  async deletePageFromNavbar(currentPostTitle: string, newPostPage: string) {
    let menuIds =  new Map<string, string>();
    menuIds.set("Admission", "JcXcSpLhRcqBpGGCbFhu")
    menuIds.set("Administration", "QZqDxbgNWs0REYHiFLkn")
    menuIds.set("Academics", "S9QreURHigWQOxvba8DN")
    menuIds.set("Miscellaneous", "bQySVR0vx1PZpaTl6prg")
    menuIds.set("About Us", "d9RMYPpiC2zZMt7RayVK")


    const docRef = doc(this.fireStore, "navbar",menuIds.get(newPostPage)||"");
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let docSnap2 = docSnap.data();

      const index = docSnap2["sublinks"].indexOf(currentPostTitle, 0);
      if (index > -1) {
        docSnap2["sublinks"].splice(index, 1);
      }

      setDoc(doc(this.fireStore, "navbar", menuIds.get(newPostPage)||""), docSnap2);
    } else {
      console.log("No such document!");
    }
  }

  async compressAndUploadFile(imageBeforCompress: DataUrl, fileName: string) {
    let imgSize = this.imageCompress.byteCount(imageBeforCompress);

    if(imgSize > 1000000) {
      console.warn('Size in bytes was:', this.imageCompress.byteCount(imageBeforCompress));
    console.log("Compressing...")
    
    this.imageCompress
      .compressFile(imageBeforCompress, 80, 80)
      .then(
        async (result: DataUrl) => {
          var imgFile = this.dataUrlToBlob(result)

          var imgRef = ref(this.fireStorage, fileName);
          
          await uploadBytes(imgRef, imgFile).then((snapshot) => {
            console.log(snapshot);
          });
        }
      );
    } else {
      var imgFile = this.dataUrlToBlob(imageBeforCompress)
      var imgRef = ref(this.fireStorage, fileName);
      
      uploadBytes(imgRef, imgFile).then((snapshot) => {
        console.log(snapshot);
      });
    }
  }

  getImage(imageUrl: string): Promise<SafeUrl> {
    return new Promise<SafeUrl>((resolve)=> {
      let imageSrc: SafeUrl;

      const gsReference = ref(this.fireStorage, `gs://school-cms-966e4.appspot.com/${imageUrl}`);
      getBytes(gsReference).then((buffer: ArrayBuffer) => {
          imageSrc = this.getSafeUrlFromArrayBuffer(buffer);
          resolve(imageSrc);
      });
    })
  }

  private dataUrlToBlob(dataUrl: DataUrl) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataUrl.split(',')[1]);

    // separate out the mime component
    var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //New Code
    return new Blob([ab], {type: mimeString});
  }

  getSafeUrlForSelectedImage(file: any) {
    return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  async uploadAttachmentFile(file: any, filename: string) {
    var imgRef = ref(this.fireStorage, filename);
          
    await uploadBytes(imgRef, file).then((snapshot) => {
      console.log(snapshot);
    });
  }

}
