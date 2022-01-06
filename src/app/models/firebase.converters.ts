import { Post } from "./post.model";

export class FirebaseConverters {

    public static toFirestore(post: Post) {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                date: post.date,
                category: post.category,
                page: post.page,
                imageUrl: post.imageUrl || "",
                attachmentUrl: post.attachmentUrl || ""
            }
        }

        // fromFirestore(snapshot) => {
        //     return new Post(data.title, data.content, data.date, data.category, data.page, data.imageUrl, data.attachmentUrl);
        // }
}