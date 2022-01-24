import { SafeUrl } from "@angular/platform-browser";

export class Member {
    imageName: string;
    imageSrc: SafeUrl|undefined;
    name: string;
    committee: string;
    designation: string;
    contactNumber: string;
    imageDataUrl: string ;

    constructor(name: string, committee: string, designation: string, contactNumber: string, imageName: string, imageSrc?: SafeUrl) {
        this.imageName = imageName;
        this.imageSrc = imageSrc;
        this.name = name;
        this.committee = committee;
        this.designation = designation;
        this.contactNumber = contactNumber;
    }
}