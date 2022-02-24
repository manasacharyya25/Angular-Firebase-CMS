import { SafeUrl } from "@angular/platform-browser";
import { UUID } from "angular2-uuid";

export class Post {
    id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    page: string
    imageUrl: SafeUrl|string|undefined;
    attachmentUrl: string|undefined;

    public constructor(id: string, title: string, content: string, date: string, category: string, page: string, imageUrl?: string|SafeUrl, attachmentUrl?: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.date = date;
        this.category = category;
        this.page = page;
        this.imageUrl = imageUrl;
        this.attachmentUrl = attachmentUrl;
    }

    public setImageUrl(image: string|SafeUrl) {
        this.imageUrl = image;
    }

    public setAttachmentUrl(attachment: string) {
        this.attachmentUrl = attachment;
    }
}