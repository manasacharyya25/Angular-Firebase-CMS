import { Component, OnInit } from '@angular/core';
import { collection, collectionData, DocumentData, deleteDoc, doc, Firestore, query } from '@angular/fire/firestore';
import { Member } from '../common/member.model';
import { Utils } from '../common/utils';

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./members-page.component.scss']
})
export class MembersPageComponent implements OnInit {

  membersList: Member[];
  schoolManagementCommittee: Member[];
  disciplinaryStaff: Member[];
  internalComplaints: Member[];
  ptaMembers: Member[];

  showMembers: boolean;
  
  constructor(private fireStore: Firestore, private utils: Utils) { }

  ngOnInit() {
    this.membersList = [];
    this.schoolManagementCommittee = [];
    this.disciplinaryStaff = [];
    this.internalComplaints = [];
    this.ptaMembers = [];

    const membersCollection = collection(this.fireStore, 'members');
    let q = query(membersCollection);
    collectionData(q).forEach((response: DocumentData[])=> {
       response.forEach((member:any)=> {
         if(member.name!="Dont Delete") {
           let newMember = new Member(member.id, member.name, member.committee, member.designation, member.contactNumber, member.imageName);
          if(member.imageName) {
            let imagePath = `members/${member.imageName}`
            this.utils.getImage(imagePath).then(response => {
              newMember.imageSrc = response;
            })
          }
          this.membersList.push(newMember)
        }
      })
      this.membersList.forEach(member => {
        if(member.committee=="School Management Committee") {
          this.schoolManagementCommittee.push(member);
        }
        else if(member.committee=="PTA Members") {
          this.ptaMembers.push(member);
        }
        else if(member.committee=="Internal Complaints Committee: Sexual Harrasment of Women at Work Place") {
          this.internalComplaints.push(member);
        }
        else if(member.committee=="Disciplinary Committee: Staff") {
          this.disciplinaryStaff.push(member)
        }
      })
    });

    setTimeout(() => {
      console.log(this.schoolManagementCommittee)
      this.showMembers = true;
    }, 1000);
  }


}
