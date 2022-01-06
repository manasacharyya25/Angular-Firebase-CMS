import { UUID } from "angular2-uuid";

export class Post {
    id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    page: string
    imageUrl: string|undefined;
    attachmentUrl: string|undefined;

    public constructor(title: string, content: string, date: string, category: string, page: string, imageUrl?: string, attachmentUrl?: string) {
        this.id = UUID.UUID();
        this.title = title;
        this.content = content;
        this.date = date;
        this.category = category;
        this.page = page;
        this.imageUrl = imageUrl;
        this.attachmentUrl = attachmentUrl;
    }
}