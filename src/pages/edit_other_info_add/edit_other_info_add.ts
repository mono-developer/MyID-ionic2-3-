import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-other-info-add',
  templateUrl: 'edit_other_info_add.html'
})
export class EditOtherInfoAddPage {

  public otherInfoData:any = {label:'', notes:'', is_private: false};
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
    if (navParams.get("otherInfoData") != null){
      this.otherInfoData = navParams.get("otherInfoData");
      this.toggleFlag.toggleFlag = !this.otherInfoData.is_private;
    }
    else{
      this.otherInfoData.is_private = true;
      this.toggleFlag.toggleFlag = !this.otherInfoData.is_private;
    }
    console.log(this.otherInfoData);
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  otherInfoDataDelete(){
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
            this.otherInfoDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }

  otherInfoDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations/"+this.otherInfoData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("otherInfoData Data: ", data);
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
  otherInfoDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations/"+this.otherInfoData.id;
    console.log(this.otherInfoData.is_private.toString());
    var body = {"id":this.otherInfoData.id, "other_information":{ "label": this.otherInfoData.label,
    "notes":this.otherInfoData.notes, "is_private": this.otherInfoData.is_private.toString()}}
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
              console.log("OtherIformation Data: ", data);
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
  otherInfoDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations";
    var body = {"other_information":{ "label": this.otherInfoData.label,
    "notes":this.otherInfoData.notes, "is_private": this.otherInfoData.is_private.toString()}}
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
              console.log("OtherInformation Data: ", data);
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
    this.otherInfoData.is_private = !this.toggleFlag.toggleFlag;
    if( this.otherInfoData.is_private == true ){
      this.confirmAlert();
    }
    console.log("Toggled: "+ this.otherInfoData.is_private);
  }
  confirmAlert(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'This will hide your Vital Medical Condition from your public profile that may be needed in an emmergency',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.otherInfoData.is_private = false;
            this.toggleFlag.toggleFlag = !this.otherInfoData.is_private;
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
