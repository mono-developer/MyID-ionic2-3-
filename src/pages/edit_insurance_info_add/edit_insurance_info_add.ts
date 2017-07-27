import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-insurance-info-add',
  templateUrl: 'edit_insurance_info_add.html'
})
export class EditInsuranceInfoAddPage {

  public insuranceinfoData:any = {insurance_provider:'', id_number:'', group_number:'', bin_number:'', deductible:'', customer_service_phone_number:'', notes:'', is_private: true};
  public toggleFlag:any={ toggleFlag: true};
  public profile_id
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
    this.translate.use(sysOptions.systemLanguage);
    if (navParams.get("insuranceinfoData") != null){
      this.insuranceinfoData = navParams.get("insuranceinfoData");
      this.toggleFlag.toggleFlag = !this.insuranceinfoData.is_private;
    }
    else{
      this.insuranceinfoData.is_private = true;
      this.toggleFlag.toggleFlag = !this.insuranceinfoData.is_private;
    }
    console.log("physicianData",this.insuranceinfoData);
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  insuranceinfoDataDelete(){
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
            this.insuranceinfoDataDelete1();
            }
          }
        ]
      });
      alert.present();
  }

  insuranceinfoDataDelete1(){
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations/"+this.insuranceinfoData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("insuranceinfoData: ", data);
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
  insuranceinfoDataUpdate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations/"+this.insuranceinfoData.id;
    console.log(this.insuranceinfoData.is_private.toString());
    var body = {"id":this.insuranceinfoData.id, "insurance_information":{
      "insurance_provider":this.insuranceinfoData.insurance_provider, "id_number":this.insuranceinfoData.id_number,
      "group_number":this.insuranceinfoData.group_number, "bin_number":this.insuranceinfoData.bin_number,
      "deductible":this.insuranceinfoData.deductible, "customer_service_phone_number":this.insuranceinfoData.customer_service_phone_number,
      "notes":this.insuranceinfoData.notes, "is_private": this.insuranceinfoData.is_private.toString()}}
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
  insuranceinfoDataCreate(){
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations";
    console.log(this.insuranceinfoData.is_private.toString());
    var body = {"insurance_information":{
      "insurance_provider":this.insuranceinfoData.insurance_provider, "id_number":this.insuranceinfoData.id_number,
      "group_number":this.insuranceinfoData.group_number, "bin_number":this.insuranceinfoData.bin_number,
      "deductible":this.insuranceinfoData.deductible, "customer_service_phone_number":this.insuranceinfoData.customer_service_phone_number,
      "notes":this.insuranceinfoData.notes, "is_private": this.insuranceinfoData.is_private.toString()}}
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
                  title: "Created", subTitle: "Created Success", buttons: ['OK']
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
    this.insuranceinfoData.is_private = !this.toggleFlag.toggleFlag;
    if(this.insuranceinfoData.is_private == true){
      this.confirmAlert();
    }
    console.log("Toggled: "+ this.insuranceinfoData.is_private);
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
            this.insuranceinfoData.is_private = false;
            this.toggleFlag.toggleFlag = !this.insuranceinfoData.is_private;
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
