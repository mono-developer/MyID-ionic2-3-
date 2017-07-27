import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-emergency-add',
  templateUrl: 'edit_emergency_add.html'
})
export class EditEmergencyAddPage {

  public emergencyData:any = {name:'', relationship:'', phone_number:'', alt_phone_number:'', email:''};
  public profile_id;
  email:string;
  auth_token:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public translate: TranslateService
  ) {
      this.emergencyData = navParams.get("emergencyData");
      console.log(this.emergencyData);
      this.profile_id = navParams.get("profile_id");
      this.email = "";
      this.auth_token = "";
      this.translate.use(sysOptions.systemLanguage);
  }

  emergencyDataDelete(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you really want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            this.emergencyDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }

  emergencyDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/emergency_contacts/"+this.emergencyData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("EmergencyData: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Delete Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Deleted", subTitle: "Delete Success", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
                console.log(data);
              }
          });
      });
    });
  }
  emergencyDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/emergency_contacts/"+this.emergencyData.id;
    var body = {"id":this.emergencyData.id, "emergency_contact":
    { "name": this.emergencyData.name, "relationship":this.emergencyData.relationship,
     "phone_number": this.emergencyData.phone_number,"alt_phone_number":this.emergencyData.alt_phone_number,
      "email":this.emergencyData.email}
  }
    console.log(body);
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataUpdate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Updated Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Updated", subTitle: "Updated Success", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
                console.log(data);
              }
          });
      });
    });
  }
  emergencyDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/emergency_contacts";
    var body = {"emergency_contact":
    { "name": this.emergencyData.name, "relationship":this.emergencyData.relationship,
     "phone_number": this.emergencyData.phone_number,"alt_phone_number":this.emergencyData.alt_phone_number,
      "email":this.emergencyData.email }
    }
    console.log(body);
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataCreate(this.email, this.auth_token, this.profile_id, endValue, body)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Create Error", buttons: ['OK']
                });
                alert.present();
              } else{
                this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Created", subTitle: "Create Success", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
                console.log(data);
              }
          });
      });
    });
  }
}
