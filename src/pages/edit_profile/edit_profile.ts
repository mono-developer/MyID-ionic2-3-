import { Component } from '@angular/core';
import { NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { MainPage } from '../main/main';
import { EditVitalConditionsPage } from '../edit_vital_conditions/edit_vital_conditions';
import { EditPersonalInformationPage } from '../edit_personalinfo/edit_personalinfo';
import { EditAddressPage } from '../edit_address/edit_address';
import { EditEmergencyPage } from '../edit_emergency/edit_emergency';
import { EditAllergiesPage } from '../edit_allergies/edit_allergies'
import { EditMedicationsPage } from '../edit_medications/edit_medications'
import { EditPhysiciansPage } from '../edit_physicians/edit_physicians'
import { EditInsuranceInfoPage } from '../edit_insurance_info/edit_insurance_info'
import { EditOtherInfoPage } from '../edit_other_info/edit_other_info'
import { EditLinkedMyIDPage } from '../edit_linked_myid/edit_linked_myid'
import { ProfilePage } from '../profile/profile';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Flags } from "../../providers/flag";
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { BaseService } from "../../providers/base-service";

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit_profile.html'
})
export class EditProfilePage {

  profileItems: Array<{title: string, component: any, icon: string}>;
  profile:any;
  myDate : string;
  age : string;
  email:string;
  auth_token:string;
  id:number;
  address = { city: "", state: ""};
  imagePath: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public userService:UserService,
    public actionSheet:ActionSheet,
    public camera:Camera,
    public file:File,
    public baseService:BaseService,
    public fileTransfer: Transfer,
    private flagService: Flags,
    public translate: TranslateService) {

      this.translate.use(sysOptions.systemLanguage);
    this.profileItems = [
        { title: 'Vital Medical Conditions', component: EditVitalConditionsPage, icon: 'ios-warning-outline' },
        { title: 'Personal Information', component: EditPersonalInformationPage, icon: 'ios-contact-outline' },
        { title: 'Address', component: EditAddressPage, icon: 'ios-home-outline' },
        { title: 'Emergency Contacts', component: EditEmergencyPage, icon: 'ios-call-outline' },
        { title: 'Allergies', component: EditAllergiesPage, icon: 'ios-eye-outline' },
        { title: 'Medications', component: EditMedicationsPage, icon: 'ios-heart-outline' },
        { title: 'Physicians', component: EditPhysiciansPage, icon: 'ios-medkit-outline' },
        { title: 'Insurance Information', component: EditInsuranceInfoPage, icon: 'ios-umbrella-outline' },
        { title: 'Other Information', component: EditOtherInfoPage, icon: 'ios-information-circle-outline' },
        { title: 'Linked MyID Products', component: EditLinkedMyIDPage, icon: 'ios-link-outline' }
      ];

      this.profile = this.navParams;
      console.log(this.profile.data);
      let birth_date: string = this.profile.data.birth_date.substr(0,4);
      this.myDate = new Date().toISOString().substr(0,4);
      this.age = (parseInt(this.myDate) - parseInt(birth_date)).toString();

  }

  ngOnInit(){

    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile.data.id, null)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log(data);
              if(data.success == false){
                console.log("Address:" + JSON.stringify(data)+this.auth_token+"AAAAA");
             }else{
               this.address = data.profile.address;
               console.log("Address:" + JSON.stringify(data.profile.address));
             }
            },
            (data) => {
              loading.dismiss();
              console.log("get Profiles:" + JSON.stringify(data));
            });
        });
      });
  }

  openPage(p){

    this.navCtrl.push(p.component,{
      profile_id: this.profile.data.id,
      person: this.profile.data.person,
      address: this.profile.data.address
    });
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }

  getPicture(){

		let buttonLabels = ['Photo Library', 'Camera'];
		this.actionSheet
			.show({
				title: 'Source Library',
				buttonLabels: buttonLabels,
				addCancelButtonWithLabel: 'Cancel',
				destructiveButtonLast: true
			})
			.then((buttonIndex: number) => {
				switch (buttonIndex) {
					case 1:
            let options:CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              targetWidth: 100,
              targetHeight: 100
            }

            this.camera.getPicture(options).then((imgUrl) => {

              var sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
              var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
              sourceFileName = sourceFileName.split('?').shift();
              this.imagePath = imgUrl;
              this.updatePhoto();
            }, (err) => {
              alert(JSON.stringify(err))
            });
						break;
					case 2:
            let options1:CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              sourceType: this.camera.PictureSourceType.CAMERA,
              targetWidth : 100,
              targetHeight: 100
            }

            this.camera.getPicture(options).then((imgUrl) => {

              var sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
              var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
              sourceFileName = sourceFileName.split('?').shift();
              this.imagePath = imgUrl;
              this.updatePhoto();
            }, (err) => {
              alert(JSON.stringify(err))
            });
						break;
					default:
						break;
				}
			});
  }

  updatePhoto(){
    let loading = this.loadingCtrl.create();
    loading.present();

    if (this.imagePath){
      // let loader = this.loadingCtrl.create({
      //   content: "Please wait..."
      // });
      //loader.present();

      let filename = this.imagePath.split('/').pop();
      let options = {
        fileKey: "profile[image]",
        fileName: filename,
        chunkedMode: false,
        httpMethod: "PUT",
        mimeType: "image/jpg",
        headers:
          {'auth_token': this.auth_token, 'email': this.email}
      };

      const fileTransfer: TransferObject = this.fileTransfer.create();

      fileTransfer.upload(this.imagePath, this.baseService.createProfileUrl + "/" + this.profile.data.id,
        options).then((entry) => {
          console.log("url: " + this.baseService.createProfileUrl + "/" + this.profile.data.id);
          if (JSON.stringify(entry).indexOf("error_code") == -1){
            this.profile.data.person.image_url.thumb = this.imagePath;
            this.imagePath = '';
            loading.dismiss();
            this.flagService.setChangedFlag(true);
          }
          else{
            loading.dismiss();
            console.log("success:" + JSON.stringify(entry));
          }

        //  this.navCtrl.pop();

        }, (err) => {
          loading.dismiss();
          console.log("failed:" + JSON.stringify(err));
        });
    }
  }
}
