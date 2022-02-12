import { Component, OnInit } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormControl } from "@angular/forms";
import {
  Firestore, collection, collectionData, query,
  DocumentData, doc
} from '@angular/fire/firestore';
import { FirebaseConverters } from '../models/firebase.converters';
import { Post } from '../models/post.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Utils } from '../common/utils';
import { deleteDoc, setDoc } from '@firebase/firestore';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { Member } from '../common/member.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  /** Common Fields */
  formTitle: string;
  imageUrl: SafeUrl;
  currentPostTitle: string;
  currentPostContent : FormControl;
  currentPostImage: SafeUrl;
  currentPostAttachment: SafeUrl;
  imageLoading: boolean;

  newPostPage: string;
  recentPosts: Post[];
  searchResult: Post;
  showSearchResults: boolean;
  showEditPost: boolean;
  editPostPage: string;
  editPostId: string;

  selectedImagesForGallery: any[];
  selectedImagesDataUrl: any[];

  membersList: Member[];

  /** POST SECTION */
  imageFile: any;
  postHasImage: boolean;
  currentPostCategory: string;
  postHasAttachment: boolean;
  attachmentFile: any;

  
  constructor(private router: Router, 
    private fireStore: Firestore, 
    private fireStorage: Storage, 
    private utils: Utils,
    private sanitizer: DomSanitizer) {
    this.formTitle = "Homepage"
    this.currentPostContent = new FormControl("");
   }

  async ngOnInit() {
    let currentPostCategory = "Featured Content"
    await this.updateCurrentPost(currentPostCategory);
    this.membersList = [];
  }

// #region Common Functions
 clearPreviousPostDetailsFromEditor() {
  this.currentPostImage = '';
  this.currentPostAttachment = '';
  this.currentPostTitle = '';
  this.currentPostContent = new FormControl('');
 }
//#endregion

//#region  Sidebar Functions

  showForm(name: string) {
    this.clearPreviousPostDetailsFromEditor();
    this.formTitle =  name;
    if(this.formTitle=='Homepage') {
      this.updateCurrentPost('Featured Content')
    }

    if(this.formTitle=='Committee Members') {
      this.loadMembersList();
    }
  }

//#endregion

//#region  Homepage Section
  
  async updateCurrentPost(currentPostCategory: string) {
    if(this.currentPostCategory!=currentPostCategory) {
      this.clearPreviousPostDetailsFromEditor();

      this.utils.getPostByCategory(currentPostCategory).then(response => {
        let currentPost = response;
  
        this.currentPostTitle = currentPost.title;
        this.currentPostContent = new FormControl(currentPost.content);
        this.currentPostCategory = currentPost.category;
        
        if(currentPost.imageUrl) {
          this.imageLoading = true;
          this.utils.getImage(currentPost.category).then(response => {
            this.currentPostImage = response;
            this.imageLoading = false;
          });
        }
      })
    }
  }

  submitHomepagePost(category: string) {
    this.utils.getPostByCategory(category).then(post=> {
      if(post.title || post.content || post.imageUrl || post.attachmentUrl || post.category) {
        let newPost =  new Post(post.id, this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), category, "Homepage");

        if(this.postHasImage) {
          this.uploadImageForPost(category)
          newPost.imageUrl = category;
        }

        if(this.postHasAttachment) {
          let fileExtension = this.attachmentFile.name.split('.')[1];
          this.utils.uploadAttachmentFile(this.attachmentFile, `files/${category}.${fileExtension}`)
          newPost.attachmentUrl = category;
        }

        setDoc(doc(this.fireStore, "posts", post.id), FirebaseConverters.postToFirestore(newPost));
      }else {
        let newPost =  new Post(UUID.UUID(), this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), category, "Homepage");
        setDoc(doc(this.fireStore, "posts", newPost.id), FirebaseConverters.postToFirestore(newPost));
      }
    });
  }

//#endregion

// #region Post

  selectFileForPost(event: any) {
    this.attachmentFile = event.target.files[0];
    this.postHasAttachment = true;
  }

  selectImageForPost(event: any) {
    this.imageFile = event.target.files[0];
    this.currentPostImage = this.utils.getSafeUrlForSelectedImage(this.imageFile);
    this.postHasImage = true;
  }

  async uploadImageForPost(postName: string) {
    var imageDataUrl: string = '';

    var reader = new FileReader();
    reader.readAsDataURL(this.imageFile)
    reader.onload = async ev => {
      imageDataUrl = reader.result?.toString() || '';
      await this.utils.compressAndUploadFile(imageDataUrl, postName);
    }
  }

  async createNewPostByTitle() {
    let imageName =  "";

    let newPost =  new Post(UUID.UUID(),
                            this.currentPostTitle,
                            this.currentPostContent.value,
                            new Date().toLocaleDateString(), 
                            "Post",
                            this.newPostPage,
                            imageName);

    if(this.postHasImage) {
      await this.uploadImageForPost(this.currentPostTitle)
      imageName = this.currentPostTitle;
    }

    if(this.postHasAttachment) {
      let fileExtension = this.attachmentFile.name.split('.')[1];
      this.utils.uploadAttachmentFile(this.attachmentFile, `files/${this.currentPostTitle}.${fileExtension}`)
      newPost.attachmentUrl = `${this.currentPostTitle}.${fileExtension}`;
    }
    
    await setDoc(doc(this.fireStore, "posts", newPost.id), FirebaseConverters.postToFirestore(newPost));
  }

  getPostsToEdit() {
    this.utils.getPostsByCategory("Post").then((respone: Post[]) => {
      this.recentPosts = respone;
    });
  }

  editPost(post: Post) {
    this.showEditPost = true;
    this.currentPostContent = new FormControl(post.content)
    this.currentPostTitle = post.title
    this.editPostPage = post.category;
    this.editPostId = post.id;

    if(post.imageUrl) {
      this.imageLoading = true;
      this.utils.getImage(this.currentPostTitle).then(response => {
        this.currentPostImage = response;
        this.imageLoading = false;
      })
    }
  }

  async submitEditedPost() {
    let imageName =  "";

    let newPost =  new Post(this.editPostId,
                            this.currentPostTitle,
                            this.currentPostContent.value,
                            new Date().toLocaleDateString(), 
                            "Post",
                            this.editPostPage,
                            imageName);

    if(this.postHasImage) {
      await this.uploadImageForPost(this.currentPostTitle)
      imageName = this.currentPostTitle;
    }

    if(this.postHasAttachment) {
      let fileExtension = this.attachmentFile.name.split('.')[1];
      this.utils.uploadAttachmentFile(this.attachmentFile, `files/${this.currentPostTitle}.${fileExtension}`)
      newPost.attachmentUrl = `${this.currentPostTitle}.${fileExtension}`;
    }
    
    await setDoc(doc(this.fireStore, "posts", newPost.id), FirebaseConverters.postToFirestore(newPost));

    // let editedPost =  new Post(this.editPostId, this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), "Post", this.editPostPage);
    // setDoc(doc(this.fireStore, "posts", this.editPostId), FirebaseConverters.postToFirestore(editedPost));
  }


  //#endregion

  createNewNotification() {
    let newNotification =  new Post(UUID.UUID(), this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), "Notification", "");
    setDoc(doc(this.fireStore, "posts", newNotification.id), FirebaseConverters.postToFirestore(newNotification));
  }

  getNotificationsToEdit() {
    this.utils.getPostsByCategory("Notification").then((respone: Post[]) => {
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
  
  submitEditedNotification() {
    let editedPost =  new Post(this.editPostId, this.currentPostTitle, this.currentPostContent.value, new Date().toLocaleDateString(), "Notification", this.editPostPage);
    setDoc(doc(this.fireStore, "posts", this.editPostId), FirebaseConverters.postToFirestore(editedPost));
  }

  createNewImageGallery(galleryName: string) {
    if(galleryName) {
      for(let imageDataUrl of this.selectedImagesDataUrl) {
        this.utils.compressAndUploadFile(imageDataUrl, `Gallery/${galleryName}/${UUID.UUID()}`);
      }
    }else {
      alert("Enter Gallery Name")
    }
    
  }

  selectImagesForNewImageGallery(event: any) {
    if(event.target.files.length>0) {
      this.selectedImagesForGallery=[];
      this.selectedImagesDataUrl = [];
      
      for(let f of event.target.files) {
        setTimeout(() => {
          let reader = new FileReader();
          reader.readAsDataURL(f)
          reader.onloadend = ev => {
            this.selectedImagesDataUrl.push(reader.result)
          }
          let safeUrl =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(f));
          this.selectedImagesForGallery.push(safeUrl)
        }, 1000);
      }
    }
  }

  //#region Members Section

  loadMembersList() {
    const membersCollection = collection(this.fireStore, 'members');
    let q = query(membersCollection);
    collectionData(q).forEach((response: DocumentData[])=> {
       response.forEach((member:any)=> {
         if(member.name!="Dont Delete") {
           let newMember = new Member(member.id, member.name, member.committee, member.designation, member.contactNumber, member.imageName);
          if(member.imageName) {
            let imagePath = `members/${member.imageName}`
            this.utils.getImage(imagePath).then(response => {
              newMember.imageSrc = response;
            })
          }
          this.membersList.push(newMember)
        }
      })
      if(this.membersList.length==0) {
        this.membersList = [new Member('', '', '', '', '', '', '')];
      }
    })
  }

  removeMember(id: string, i: number) {
    console.log(id); 
    deleteDoc(doc(this.fireStore, "members", id));
    this.membersList = this.membersList.filter(member => {
      member.id != id;
    })
    // this.membersList = this.membersList.slice(0, i).concat(this.membersList.slice(i+1))
  }

  addNewMemberPlaceholder() {
    this.membersList.push(new Member('','','','','', '', ''))
  }

  uploadImageForMember(event: any, member: Member) {
    let f = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(f)
    reader.onloadend = ev => {
      member.imageSrc =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(f));
      member.imageName = f.name;
      member.imageDataUrl = reader.result?.toString() || '';
    }
  }

  clearMembersList() {
    const membersCollection = collection(this.fireStore, 'members');
    let q = query(membersCollection);
    collectionData(q).forEach((response: DocumentData[])=> {
      response.forEach((member:any)=> {
        if(member.name!="Dont Delete") {
          deleteDoc(doc(this.fireStore, "members", member.id))
        }
      })
    });
  }

  async submitMembersList() {
    this.membersList.forEach(async member => {
      if(member.id!=null) {
        await deleteDoc(doc(this.fireStore, "members", member.id));
      }
    })

    this.membersList.forEach(async member => {
      let memberId = UUID.UUID();
      await setDoc(doc(this.fireStore, "members", memberId), FirebaseConverters.memberToFirestore(memberId, member)).then(response => console.log(response));
      if(member.imageName) {
        await this.utils.compressAndUploadFile(member.imageDataUrl, `members/${member.imageName}`);
      }
    })

    this.router.navigate(['members'])
  }

  //#endregion

}


