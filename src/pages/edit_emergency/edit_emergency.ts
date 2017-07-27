import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditEmergencyAddPage } from '../edit_emergency_add/edit_emergency_add';
import { Flags } from "../../providers/flag";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-emergency',
  templateUrl: 'edit_emergency.html'
})
export class EditEmergencyPage {

  emergencyDatas: any;
  updated:string;
  email: string;
  auth_token: string;
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
    var endValue = "/emergency_contacts "
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Emergency Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.emergencyDatas = data.emergency_contacts;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditEmergencyAddPage(event, emergencyData){
    console.log("EditEmergencyAddPage");
    if (emergencyData === undefined){
      this.navCtrl.push(EditEmergencyAddPage,{
        emergencyData: {},
        profile_id: this.profile_id
      });
    } else {
    this.navCtrl.push(EditEmergencyAddPage,{
        emergencyData: emergencyData,
        profile_id: this.profile_id
      });
    }
  }

  presentActionSheet(event, emergencyData){
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: this.translate.get('Delete')['value'],
            role: 'destructive',
            handler: () => {
              this.emergencyDataDelete(emergencyData);
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

  emergencyDataDelete(emergencyData){
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
            this.emergencyDataDelete1(emergencyData);
            }
          }
        ]
      });
      alert.present();
  }

  emergencyDataDelete1(emergencyData){
    let loading = this.loadingCtrl.create();
    var endValue = "/emergency_contacts/"+emergencyData.id;
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

              } else{
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
}
