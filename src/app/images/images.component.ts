import { Component, OnInit, SecurityContext } from '@angular/core';
import { list, listAll, ref, Storage } from '@angular/fire/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { timer } from 'rxjs';
import { ImageGalleryFolder } from '../common/image-gallery.model';
import { Utils } from '../common/utils';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  images: GalleryItem[];
  showSlider: boolean;
  galleryFolders: ImageGalleryFolder[];
  showFolders: boolean;

  constructor(private gallery: Gallery, private lightbox: Lightbox, private utils: Utils,private sanitizer: DomSanitizer, private fireStorage: Storage) { }

  async ngOnInit() {
    await this.listFoldersInImageGallery();
    this.showFolders = true;

    this.images = [
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/1.jpeg', thumb: 'assets/images/awakened-citizen-program/1.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/2.jpeg', thumb: 'assets/images/awakened-citizen-program/2.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/3.jpeg', thumb: 'assets/images/awakened-citizen-program/3.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/4.jpeg', thumb: 'assets/images/awakened-citizen-program/4.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/5.jpeg', thumb: 'assets/images/awakened-citizen-program/5.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/6.jpeg', thumb: 'assets/images/awakened-citizen-program/6.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/7.jpeg', thumb: 'assets/images/awakened-citizen-program/7.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/8.jpeg', thumb: 'assets/images/awakened-citizen-program/8.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/9.jpeg', thumb: 'assets/images/awakened-citizen-program/9.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/10.jpeg', thumb: 'assets/images/awakened-citizen-program/10.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/11.jpeg', thumb: 'assets/images/awakened-citizen-program/11.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/12.jpeg', thumb: 'assets/images/awakened-citizen-program/12.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/13.jpeg', thumb: 'assets/images/awakened-citizen-program/13.jpeg' }),
      // new ImageItem({ src: 'assets/images/awakened-citizen-program/14.jpeg', thumb: 'assets/images/awakened-citizen-program/14.jpeg' }),
    ];

    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Left
    });

    lightboxRef.load(this.images);
  }

  async listFoldersInImageGallery() {
    this.galleryFolders = [];

    const galleryRef = ref(this.fireStorage, 'Gallery/')

    await listAll(galleryRef).then(res => {
      res.prefixes.forEach(async folderRef => {
        let folderPath = folderRef.fullPath;
        let folderName = folderRef.name;
        let folderThumbnailPath: SafeUrl;


        await list(folderRef, {maxResults:1}).then(res => {
          res.items.forEach(async imageRef => {
            this.utils.getImage(imageRef.fullPath).then(response => {
              folderThumbnailPath = response;
              this.galleryFolders.push(new ImageGalleryFolder(folderPath, folderThumbnailPath, folderName));
            })})});})});
  }

  showImageSlider() {
    this.showSlider = true;
    console.log(this.showSlider)
  }

  async openGallery(folderPath: string) {
    const galleryRef = ref(this.fireStorage, folderPath);
    while(this.images.length>0){
      this.images.pop();
    }

    await listAll(galleryRef).then(async res => {
      await res.items.forEach(async imageRef => {
        await this.utils.getImage(imageRef.fullPath).then(response => {
          let img = this.sanitizer.sanitize(SecurityContext.URL, response)||'';
          this.images.push(new ImageItem({src: img, thumb: img}));
        })
      })
    })
    
    setTimeout(() => {
      this.lightbox.open(0, 'lightbox', {panelClass: 'fullscreen'});
    }, 3000);
  }
}
