import { identifierModuleUrl } from "@angular/compiler";
import { Member } from "../common/member.model";
import { Post } from "./post.model";

export class FirebaseConverters {

    public static postToFirestore(post: Post) {
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

    public static memberToFirestore(id: string, member: Member) {
        return {
            id: id,
            imageName: member.imageName,
            name: member.name,
            committee: member.committee,
            designation: member.designation,
            contactNumber: member.contactNumber
        }
    }

        // fromFirestore(snapshot) => {
        //     return new Post(data.title, data.content, data.date, data.category, data.page, data.imageUrl, data.attachmentUrl);
        // }
}