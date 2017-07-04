import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AddMedicinePage } from '../add_medicine/add_medicine';
import { ViewReminderPage } from '../view_reminder/view_reminder';
@Component({
  selector: 'page-pill-reminder',
  templateUrl: 'pill_reminder.html'
})
export class PillReminderPage {

  reminders: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl:ActionSheetController) {
    this.reminders = [
      {name: 'Acne Medication', time:'Tomorrow, 8:00AM', dose:'2', remaining_pill:'55'},
      {name: 'Acne Medication', time:'Tomorrow, 8:00AM', dose:'2', remaining_pill:'55'},
      {name: 'Acne Medication', time:'Tomorrow, 8:00AM', dose:'2', remaining_pill:'55'}
    ];
  }

  presentActionSheet(event, reminder) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select the Options',
      buttons: [
        {
          text: 'Skip',
          handler: () => {
            console.log('Skip clicked');
          }
        },{
          text: 'Reschedule',
          handler: () => {
            console.log('Reschedule clicked');
          }
        },{
          text: 'Mark as Take',
          handler: () => {
            console.log('Take clicked');
          }
        },{
          text: 'Delete this dose',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addMedicine(){
    this.navCtrl.push(AddMedicinePage);
  }

  gotoReminder(event, reminder){
    this.navCtrl.push(ViewReminderPage);
  }
}
