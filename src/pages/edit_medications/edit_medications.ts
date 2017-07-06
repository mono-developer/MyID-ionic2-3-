import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditMedicationsAddPage } from '../edit_medications_add/edit_medications_add';
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-medications',
  templateUrl: 'edit_medications.html'
})
export class EditMedicationsPage {

  medicationDatas: any;
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
    var endValue = "/medications"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Medications Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.medicationDatas = data.medications ;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditMedicationsAddPage(event, medicationData){
    console.log("gotoEditMedicationsAddPage");
    if(medicationData === undefined)
    {
      this.navCtrl.push(EditMedicationsAddPage,{
        medicationData: null,
        profile_id: this.profile_id
      });
    } else{
      this.navCtrl.push(EditMedicationsAddPage,{
        medicationData: medicationData,
        profile_id: this.profile_id
      });
    }

  }

  presentActionSheet(event, medicationData){

    if (medicationData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.updateMedicationData(medicationData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.medicationDataDelete(medicationData);
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
              this.updateMedicationData(medicationData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.medicationDataDelete(medicationData);
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

  medicationDataDelete(medicationData){
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
            this.medicationDataDelete1(medicationData);
            }
          }
        ]
      });
      alert.present();
  }

  medicationDataDelete1(medicationData){
    let loading = this.loadingCtrl.create();
    var endValue = "/medications/"+medicationData.id;
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

  updateMedicationData(medicationData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/medications/"+medicationData.id;
    console.log(medicationData.is_private.toString());
    var body = {"id":medicationData.id, "medication":{
      "name":medicationData.name, "dosage":medicationData.dosage,
      "frequency":medicationData.frequency, "notes":medicationData.notes,
      "is_private": is_private.toString()}}
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
