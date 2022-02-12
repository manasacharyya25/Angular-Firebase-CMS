import { SafeUrl } from "@angular/platform-browser";

export class Member {
    id: string;
    imageName: string;
    imageSrc: SafeUrl|undefined;
    name: string;
    committee: string;
    designation: string;
    contactNumber: string;
    imageDataUrl: string ;

    constructor(id: string, name: string, committee: string, designation: string, contactNumber: string, imageName: string, imageSrc?: SafeUrl) {
        this.id = id;
        this.imageName = imageName;
        this.imageSrc = imageSrc;
        this.name = name;
        this.committee = committee;
        this.designation = designation;
        this.contactNumber = contactNumber;
    }
}