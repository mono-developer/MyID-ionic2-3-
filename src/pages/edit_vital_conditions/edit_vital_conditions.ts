import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, PopoverController, ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditVitalConditionsAddPage } from '../edit_vital_conditions_add/edit_vital_conditions_add';
import { Flags } from "../../providers/flag";


@Component({
  selector: 'page-edit-vital-conditions',
  templateUrl: 'edit_vital_conditions.html'
})
export class EditVitalConditionsPage {

  vitalDatas: any;
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
    public actionSheetCtrl: ActionSheetController
    // public datepipe: Datepipe
  ) {
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
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
    var endValue = "/vital_medical_conditions"
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
                this.vitalDatas = data.vital_medical_conditions;
                this.updated = data.last_updated_at;
                console.log(this.updated);
              }
          });
      });
    });
  }

  gotoEditVitalConditionsAdd(event, vitalData){
    console.log("EditVitalConditionsAddPage");
    if (vitalData === undefined){
      this.navCtrl.push(EditVitalConditionsAddPage,{
        vitalData: null,
        profile_id: this.profile_id
      });
    }
    else{
      this.navCtrl.push(EditVitalConditionsAddPage,{
        vitalData: vitalData,
        profile_id: this.profile_id
      });
    }
  }

  presentActionSheet(event, vitalData){

    if (vitalData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.updateVitalData(vitalData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.vitalDataDelete(vitalData);
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
    else{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Public',
            handler: () => {
              this.updateVitalData(vitalData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.vitalDataDelete(vitalData);
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
  }

  vitalDataDelete(vitalData){

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
            this.vitalDataDelete1(vitalData);
            }
          }
        ]
      });
      alert.present();
  }

  vitalDataDelete1(vitalData){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions/"+vitalData.id;
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

  updateVitalData(vitalData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions/"+vitalData.id;
    var body = {"id":vitalData.id, "vital_medical_condition":{ "name": vitalData.name, "notes":vitalData.notes, "is_private": is_private.toString()}}
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
              }
          });
      });
    });
  }
}
