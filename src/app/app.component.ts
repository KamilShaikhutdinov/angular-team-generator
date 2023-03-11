import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'teamsapp';
  newMemberName = '';
  members: string[] = [];
  addMember() {
    this.members.push(this.newMemberName);
    console.log(this.members);
  }
  onInput(member: string) {
    this.newMemberName = member;
    console.log(this.newMemberName);
  }
}
