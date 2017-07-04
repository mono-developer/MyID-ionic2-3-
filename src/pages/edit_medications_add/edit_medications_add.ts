import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-medications-add',
  templateUrl: 'edit_medications_add.html'
})
export class EditMedicationsAddPage {

  public medicationData:any = {name:'', dosage:'', frequency:'', notes:'', is_private: false};
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
    if (navParams.get("medicationData") != null){
      this.medicationData = navParams.get("medicationData");
      this.toggleFlag.toggleFlag = !this.medicationData.is_private;
    }
    else{
      this.medicationData.is_private = true;
      this.toggleFlag.toggleFlag = !this.medicationData.is_private;
    }
    console.log(this.medicationData);
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  medicationDataDelete(){
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
            this.medicationDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }
  medicationDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/medications/"+this.medicationData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
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

  medicationDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/medications/"+this.medicationData.id;
    console.log(this.medicationData.is_private.toString());
    var body = {"id":this.medicationData.id, "medication":{
      "name":this.medicationData.name, "dosage":this.medicationData.dosage,
      "frequency":this.medicationData.frequency, "notes":this.medicationData.notes,
      "is_private": this.medicationData.is_private.toString()}}
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
              console.log("Medication Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Update Error", buttons: ['OK']
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

  medicationDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/medications";
    console.log(this.medicationData.is_private.toString());
    var body = {"medication":{
      "name":this.medicationData.name, "dosage":this.medicationData.dosage,
      "frequency":this.medicationData.frequency, "notes":this.medicationData.notes,
      "is_private": this.medicationData.is_private.toString()}}
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
                this.navCtrl.pop();
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
    this.medicationData.is_private = !this.toggleFlag.toggleFlag;
    if( this.medicationData.is_private == true ){
      this.confirmAlert();
    }
    console.log("Toggled: "+ this.medicationData.is_private);
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
            this.medicationData.is_private = false;
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
