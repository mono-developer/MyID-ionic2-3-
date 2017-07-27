import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, Tabs, NavParams } from 'ionic-angular';
import { EditProfilePage } from '../edit_profile/edit_profile';
import { LinkProductPage } from '../link_product/link_product';
import { PreviewProfilePage } from '../preview_profile/preview_profile';
import { DocumentsPage } from '../documents/documents';
import { QRWallpaperPage } from '../qr_wallpaper/qr_wallpaper';

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @ViewChild('myTabs') tabRef: Tabs;
  editProfilePage = EditProfilePage;
	linkProductPage = LinkProductPage;
  previewProfilePage = PreviewProfilePage;
  documentsPage = DocumentsPage;
  qrWallpaperPage = QRWallpaperPage;

  profile : any;
  // tabs : Tabs;
	constructor(
    public navCtrl: NavController,
    public nav : Nav,
    public navParams: NavParams,
    public translate: TranslateService,
  ) {
		// this.editProfilePage = EditProfilePage;
    this.profile = navParams.get('profile');
     
    console.log("this is profile page");
    this.translate.use(sysOptions.systemLanguage);
    //console.log("this.profile ; " + JSON.stringify(this.profile));
	}

  selectPreviewTab(){
    console.log("click tab");
    this.tabRef.select(2);
  }
}
