import { SafeUrl } from "@angular/platform-browser";

export class ImageGalleryFolder {
    folderPath : string;
    folderThumbnailPath: SafeUrl;
    folderName: string;

    constructor(folderPath: string, folderThumbnailPath: SafeUrl, folderName: string) {
        this.folderPath = folderPath;
        this.folderThumbnailPath = folderThumbnailPath;
        this.folderName = folderName;
    }
}