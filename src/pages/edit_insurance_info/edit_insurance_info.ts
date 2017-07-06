import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditInsuranceInfoAddPage } from '../edit_insurance_info_add/edit_insurance_info_add';
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-insurance-info',
  templateUrl: 'edit_insurance_info.html'
})
export class EditInsuranceInfoPage {

  insuranceinfoDatas: any;
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
    var endValue = "/insurance_informations"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Insurance Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.insuranceinfoDatas = data.insurance_informations;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditInsuranceInfoAddPage(event, insuranceinfoData){
    console.log("gotoEditInsuranceInfoAddPage");
    if(insuranceinfoData === undefined){
      this.navCtrl.push(EditInsuranceInfoAddPage,{
        insuranceinfoData: null,
        profile_id: this.profile_id
      });
    }else {
      this.navCtrl.push(EditInsuranceInfoAddPage,{
        insuranceinfoData:insuranceinfoData,
        profile_id: this.profile_id
      });
    }

  }

  presentActionSheet(event, insuranceinfoData){

    if (insuranceinfoData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.insuranceinfoDataUpdate(insuranceinfoData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.insuranceinfoDataDelete(insuranceinfoData);
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
              this.insuranceinfoDataUpdate(insuranceinfoData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.insuranceinfoDataDelete(insuranceinfoData);
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

  insuranceinfoDataDelete(insuranceinfoData){
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
            this.insuranceinfoDataDelete1(insuranceinfoData);
            }
          }
        ]
      });
      alert.present();
  }

  insuranceinfoDataDelete1(insuranceinfoData){
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations/"+insuranceinfoData.id;
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
  insuranceinfoDataUpdate(insuranceinfoData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations/"+insuranceinfoData.id;
    console.log(insuranceinfoData.is_private.toString());
    var body = {"id":insuranceinfoData.id, "insurance_information":{
      "insurance_provider":insuranceinfoData.insurance_provider, "id_number":insuranceinfoData.id_number,
      "group_number":insuranceinfoData.group_number, "bin_number":insuranceinfoData.bin_number,
      "deductible":insuranceinfoData.deductible, "customer_service_phone_number":insuranceinfoData.customer_service_phone_number,
      "notes":insuranceinfoData.notes, "is_private": is_private.toString()}}
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
