import { Component } from '@angular/core';
import { NavController,  AlertController,  LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-vital-conditions-add',
  templateUrl: 'edit_vital_conditions_add.html'
})
export class EditVitalConditionsAddPage {

  public vitalData:any = { name:'', notes:'', is_private: false };
  public toggleFlag:any={toggleFlag: true};
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
      if (navParams.get("vitalData") != null){
        this.vitalData = navParams.get("vitalData");
        this.toggleFlag.toggleFlag = !this.vitalData.is_private;
      }
      else{
        this.vitalData.is_private = false;
        this.toggleFlag.toggleFlag = !this.vitalData.is_private;
      }

      console.log(this.vitalData);
      this.profile_id = navParams.get("profile_id");
      this.email = "";
      this.auth_token = "";
  }
  vitalDataDelete(){

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
            this.vitalDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }

  vitalDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions/"+this.vitalData.id;
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

  vitalDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions/"+this.vitalData.id;
    console.log(this.vitalData.is_private.toString());
    var body = {"id":this.vitalData.id, "vital_medical_condition":{ "name": this.vitalData.name, "notes":this.vitalData.notes, "is_private": this.vitalData.is_private.toString()}}
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

  vitalDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions";
    console.log(this.vitalData.is_private);
    var body = {"vital_medical_condition":{ "name": this.vitalData.name, "notes":this.vitalData.notes, "is_private": this.vitalData.is_private.toString()}}
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
  this.vitalData.is_private = !this.toggleFlag.toggleFlag;
  if( this.vitalData.is_private == true ){
    this.confirmAlert();
  }
  console.log("Toggled: "+ this.vitalData.is_private);
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
          this.vitalData.is_private = false;
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
