import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditAllergiesAddPage } from '../edit_allergies_add/edit_allergies_add';
import { Flags } from "../../providers/flag";


@Component({
  selector: 'page-edit-allergies',
  templateUrl: 'edit_allergies.html'
})
export class EditAllergiesPage {

  allergiesDatas: any;
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
    var endValue = "/allergies"
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
                this.allergiesDatas = data.allergies;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditAllergiesAddPage(event,allergiesData){
    console.log("EditAllergiesAddPage");
    if (allergiesData === undefined){
      this.navCtrl.push(EditAllergiesAddPage,{
        allergiesData: null,
        profile_id: this.profile_id
      });
    }else{
      this.navCtrl.push(EditAllergiesAddPage,{
        allergiesData:allergiesData,
        profile_id: this.profile_id
      });
    }

  }

  presentActionSheet(event, allergiesData){

    if (allergiesData.is_private == false){
      let actionSheet = this.actionSheetCtrl.create({
        title: 'More options',
        buttons: [
          {
            text: 'Make This Item as Private',
            handler: () => {
              this.updateAllergiesData(allergiesData, true);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.allergiesDataDelete(allergiesData);
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
              this.updateAllergiesData(allergiesData, false);
              console.log('Upgrade clicked');
            }
          },{
            text: 'Delete Item',
            role: 'destructive',
            handler: () => {
              this.allergiesDataDelete(allergiesData);
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

  allergiesDataDelete(allergiesData){

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
            this.allergiesDataDelete1(allergiesData);
            }
          }
        ]
      });
      alert.present();
  }

  allergiesDataDelete1(allergiesData){
    let loading = this.loadingCtrl.create();
    var endValue = "/allergies/"+allergiesData.id;
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataDelete(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("allergiesData: ", data);
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

  updateAllergiesData(allergiesData, is_private){
    let loading = this.loadingCtrl.create();
    var endValue = "/allergies/"+allergiesData.id;
    console.log(allergiesData.is_private.toString());
    var body = {"id":allergiesData.id, "allergy":{ "name": allergiesData.name, "notes":allergiesData.notes, "is_private": is_private.toString()}}
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
