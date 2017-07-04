import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-allergies-add',
  templateUrl: 'edit_allergies_add.html'
})
export class EditAllergiesAddPage {

  public allergiesData:any = {name:'', notes:'', is_private: false};
  public toggleFlag:any={ toggleFlag: true};
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
    private flagService: Flags
  ) {
    if (navParams.get("allergiesData") != null){
      this.allergiesData = navParams.get("allergiesData");
      this.toggleFlag.toggleFlag = !this.allergiesData.is_private;
    }
    else{
      this.allergiesData.is_private = false;
      this.toggleFlag.toggleFlag = !this.allergiesData.is_private;
    }
    console.log("aaaaa", this.allergiesData);
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  allergiesDataDelete(){
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
            this.allergiesDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }

  allergiesDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/allergies/"+this.allergiesData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("allergiesData: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Delete Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
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
  allergiesDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/allergies/"+this.allergiesData.id;
    console.log(this.allergiesData.is_private.toString());
    var body = {"id":this.allergiesData.id, "allergy":{ "name": this.allergiesData.name, "notes":this.allergiesData.notes, "is_private": this.allergiesData.is_private.toString()}}
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
  allergiesDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/allergies";
    var body = {"allergy":{ "name": this.allergiesData.name, "notes":this.allergiesData.notes, "is_private": this.allergiesData.is_private.toString()}}
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

  notify() {
    this.allergiesData.is_private = !this.toggleFlag.toggleFlag;
    if( this.allergiesData.is_private == true)
    {
      this.confirmAlert();
    }
    console.log("Toggled: "+ this.allergiesData.is_private);
  }
  confirmAlert(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'This will hide your information from your public profile that may be needed in an emergency',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.allergiesData.is_private = false;
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
    }
}
