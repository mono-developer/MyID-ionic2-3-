import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: 'page-detail-document',
  templateUrl: 'detail_document.html'
})
export class DetailDocumentPage {

  public url:any;
  public safe_url:SafeUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams,private sanitizer: DomSanitizer) {
      this.url = navParams.get('url');
      this.safe_url = sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
