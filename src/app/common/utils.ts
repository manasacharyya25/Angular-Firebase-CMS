import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  constructor(private domSanitizer: DomSanitizer) {}

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
}
