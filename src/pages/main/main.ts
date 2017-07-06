import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, LoadingController,  ActionSheetController } from 'ionic-angular';
import { NewProfilePage } from '../new_profile/new_profile';
import { ProfilePage } from '../profile/profile';
import { EditProfilePage } from '../edit_profile/edit_profile';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  profiles: any;
  id:number;
  email: string;
  auth_token: string;
  update:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storage: Storage,
    public userService: UserService,
    private flagService: Flags,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
  ) {
    this.email = "";
    this.auth_token = "";
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.getDate();
  }
  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.getDate();
    }
  }
  getDate(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.getProfiles(this.email, this.auth_token)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
             }else{
               this.profiles = data.profiles;
               if (data.profiles.length == 0){
                 this.update = "aaa";
               }
               else{
                 this.update = "bbb";
               }
             }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }

  addProfile(){
    this.navCtrl.push(NewProfilePage);
  }

  gotoProfile(event, profile){
      console.log("Go ProfolePage");
      this.navCtrl.push(ProfilePage, {
        profile: profile
      });
  }
  presentActionSheet(event, profile) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your options',
      buttons: [
        {
          text: 'Upgrade',
          handler: () => {
            console.log('Upgrade clicked');
          }
        },{
          text: 'Link A MyID Product',
          handler: () => {
            console.log('MyID Product clicked');
          }
        },{
          text: 'Create QR Code Wallpaper',
          handler: () => {
            console.log('QRCode clicked');
          }
        },{
          text: 'Delete Profile',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');

            this.confirmAlert(profile);
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
  confirmAlert(profile){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Do you want to delete this Profile?',
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
            this.deleteProfile(profile);
            }
          }
        ]
      });
      alert.present();
    }
  deleteProfile(profile){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.deleteProfile( this.auth_token, this.email, profile.id)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            console.log(data);
         }else{
           console.log("login result", data);
           this.getDate();
         }
        },
        (data) => {
          loading.dismiss();
          console.log("Login error");
        });
    }
}
