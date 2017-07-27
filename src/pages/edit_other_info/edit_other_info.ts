import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditOtherInfoAddPage } from '../edit_other_info_add/edit_other_info_add';
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-other-info',
  templateUrl: 'edit_other_info.html'
})
export class EditOtherInfoPage {

  otherInfoDatas: any;
  updated:any;
  email:string;
  auth_token:string;
  public profile_id;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    public actionSheetCtrl: ActionSheetController,
    public translate: TranslateService
  ) {
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
    this.translate.use('sysOptions.systemLanguage');
  }
  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.gettingdata();
  }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }
  gettingdata(){

    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.otherInfoDatas = data.other_informations;
                console.log(data);
                this.updated = data.last_updated_at;
            }
          });
      });
    });
  }

  gotoEditOtherInfoAddPage(event, otherInfoData){
    console.log("EditOtherInfoAddPage");
    if (otherInfoData === undefined){
      this.navCtrl.push(EditOtherInfoAddPage,{
        otherInfoData: null,
        profile_id: this.profile_id
      });
    }else{
      this.navCtrl.push(EditOtherInfoAddPage,{
        otherInfoData: otherInfoData,
        profile_id: this.profile_id
      });
    }

  }

  presentActionSheet(event, otherInfoData){

    if (otherInfoData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.otherInfoDataUpdate(otherInfoData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: this.translate.get('Delete')['value'],
            role: 'destructive',
            handler: () => {
              this.otherInfoDataDelete(otherInfoData);
              console.log('Delete clicked');
            }
          },{
            text: this.translate.get('Cancel')['value'],
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
    else{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Public',
            handler: () => {
              this.otherInfoDataUpdate(otherInfoData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: this.translate.get('Delete')['value'],
            role: 'destructive',
            handler: () => {
              this.otherInfoDataDelete(otherInfoData);
              console.log('Delete clicked');
            }
          },{
            text: this.translate.get('Cancel')['value'],
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  otherInfoDataDelete(otherInfoData){
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
            this.otherInfoDataDelete1(otherInfoData);
            }
          }
        ]
      });
      alert.present();
  }

  otherInfoDataDelete1(otherInfoData){
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations/"+otherInfoData.id;
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

              } else{
                this.flagService.setChangedFlag(true);
                let alert = this.alertCtrl.create({
                  title: "Deleted", subTitle: "Delete Success", buttons: ['OK']
                });
                alert.present();

                this.gettingdata();
                console.log(data);
              }
          });
      });
    });
  }
  otherInfoDataUpdate(otherInfoData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/other_informations/"+otherInfoData.id;
    console.log(otherInfoData.is_private.toString());
    var body = {"id":otherInfoData.id, "other_information":{ "label": otherInfoData.label,
    "notes":otherInfoData.notes, "is_private": is_private.toString()}}
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

              } else{

                let alert = this.alertCtrl.create({
                  title: "Updated", subTitle: "Updated Success", buttons: ['OK']
                });
                alert.present();
                this.gettingdata();
                console.log(data);
              }
          });
      });
    });
  }
}
