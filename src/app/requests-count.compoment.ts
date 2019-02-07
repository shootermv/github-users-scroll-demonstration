import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {DataService} from './data.service';
import { Observable } from 'rxjs';
@Component({
    selector: 'requests-count',
    template: `<div>repos: {{$reposCount | async}}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
 })
 export class RequestsCountComponent  implements OnChanges{
    @Input()
    user;

    $reposCount: Observable<any>;
    constructor(private dataService: DataService) {}
    ngOnChanges() {
        if(!this.user){return;}
       this.$reposCount = this.dataService.getReposCount(this.user);
    }
  }