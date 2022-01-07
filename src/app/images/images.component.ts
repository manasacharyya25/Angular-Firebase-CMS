import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  images: GalleryItem[];
  showSlider: boolean;

  constructor(private gallery: Gallery, private lightbox: Lightbox) { }

  ngOnInit() {
    this.images = [
      new ImageItem({ src: 'assets/images/awakened-citizen-program/1.jpeg', thumb: 'assets/images/awakened-citizen-program/1.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/2.jpeg', thumb: 'assets/images/awakened-citizen-program/2.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/3.jpeg', thumb: 'assets/images/awakened-citizen-program/3.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/4.jpeg', thumb: 'assets/images/awakened-citizen-program/4.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/5.jpeg', thumb: 'assets/images/awakened-citizen-program/5.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/6.jpeg', thumb: 'assets/images/awakened-citizen-program/6.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/7.jpeg', thumb: 'assets/images/awakened-citizen-program/7.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/8.jpeg', thumb: 'assets/images/awakened-citizen-program/8.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/9.jpeg', thumb: 'assets/images/awakened-citizen-program/9.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/10.jpeg', thumb: 'assets/images/awakened-citizen-program/10.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/11.jpeg', thumb: 'assets/images/awakened-citizen-program/11.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/12.jpeg', thumb: 'assets/images/awakened-citizen-program/12.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/13.jpeg', thumb: 'assets/images/awakened-citizen-program/13.jpeg' }),
      new ImageItem({ src: 'assets/images/awakened-citizen-program/14.jpeg', thumb: 'assets/images/awakened-citizen-program/14.jpeg' }),
    ];

    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Left
    });

    lightboxRef.load(this.images);
  }

  showImageSlider() {
    this.showSlider = true;
    console.log(this.showSlider)
  }

  
  
}
