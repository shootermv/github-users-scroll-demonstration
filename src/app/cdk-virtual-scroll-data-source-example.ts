import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {DataService} from './data.service';


/** @title Virtual scroll with a custom data source */
@Component({
  selector: 'cdk-virtual-scroll-data-source-example',
  styleUrls: ['cdk-virtual-scroll-data-source-example.css'],
  templateUrl: 'cdk-virtual-scroll-data-source-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdkVirtualScrollDataSourceExample {
  public ds;
  constructor(private dataService: DataService) {
    this.ds = new MyDataSource(this.dataService);
  }
}

export class MyDataSource extends DataSource<string | undefined> {
  private length = 100000;
  private pageSize = 10;
  private cachedData = Array.from<{ login: any; avatar: any; count: number; }>({length: this.length});
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(any | undefined)[]>(this.cachedData);
  private subscription = new Subscription();
  constructor(private dataService: DataService) {
    super();
  }
 
 
  
  connect(collectionViewer: CollectionViewer): Observable<(any | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
    
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {      
      return;
    }
     
    this.fetchedPages.add(page);

    this.dataService.getData(page * this.pageSize).subscribe(data => { 
      this.cachedData.splice(page * this.pageSize, this.pageSize, ...data);
          
      this.dataStream.next(this.cachedData);
    });
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */