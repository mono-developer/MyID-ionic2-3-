import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditPhysiciansAddPage } from '../edit_physicians_add/edit_physicians_add';
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-physicians',
  templateUrl: 'edit_physicians.html'
})
export class EditPhysiciansPage {

  physicianDatas: any;
  updated:string;
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
      this.translate.use(sysOptions.systemLanguage);
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
    var endValue = "/physicians"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Physician Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.physicianDatas = data.physicians;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditPhysiciansAddPage(event, physicianData){
    console.log("EditPhysiciansAddPage");
      if (physicianData === undefined){
        this.navCtrl.push(EditPhysiciansAddPage,{
          physicianData: null,
          profile_id: this.profile_id
        });
      }else{
        this.navCtrl.push(EditPhysiciansAddPage,{
        physicianData:physicianData,
        profile_id: this.profile_id
      });
    }
  }

  presentActionSheet(event, physicianData){

    if (physicianData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.updatePhysicianData(physicianData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: this.translate.get('Delete')['value'],
            role: 'destructive',
            handler: () => {
              this.physicianDataDelete(physicianData);
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
        title: '',
        buttons: [
          {
            text: 'Make This Item as Public',
            handler: () => {
              this.updatePhysicianData(physicianData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: this.translate.get('Delete')['value'],
            role: 'destructive',
            handler: () => {
              this.physicianDataDelete(physicianData);
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

  physicianDataDelete(physicianData){
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
            this.physicianDataDelete1(physicianData);
            }
          }
        ]
      });
      alert.present();
  }

  physicianDataDelete1(physicianData){
    let loading = this.loadingCtrl.create();
    var endValue = "/physicians/"+physicianData.id;
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
  updatePhysicianData(physicianData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/physicians/"+physicianData.id;
    console.log(physicianData.is_private.toString());
    var body = {"id":physicianData.id, "physician":{
                "name":physicianData.name, "business_name":physicianData.business_name,
                "title":physicianData.title, "address":physicianData.address,
                "city":physicianData.city, "state":physicianData.state,
                "country":physicianData.country, "phone_number":physicianData.phone_number,
                "zip_code":physicianData.zip_code, "is_private":is_private.toString()}}
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
