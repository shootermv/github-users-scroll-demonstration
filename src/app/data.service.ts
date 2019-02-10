import { Injectable } from '@angular/core';
import { catchError, map, concatMap, mergeMap, toArray } from 'rxjs/operators';

import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  token = 'PUT-YOUR-TOKEN_HERE';
  constructor(private http: HttpClient) { }
  
  getData(since) {
    return this.getUsers(since)
      .pipe(
        concatMap(users => from(users)),
        mergeMap((user) => {
           return this.getReposCount(user.login).pipe(
             map(count => ({login: user.login,avatar: user.avatar_url, count}))
           );          
        }),
        toArray()
      )
 }
  getReposCount(user) : Observable<number> {   
    return this.http.get<any>(`https://api.github.com/users/${user}/repos?per_page=10000&access_token=${this.token}`)
      .pipe(
        map(repos => repos.length || 0 ),
       // tap((repos) => console.log(`fetched repos of ${user} - ${repos.length || 0}`)),
        catchError(this.handleError('getReposCount'))
      ) as Observable<any>;
  }
  
  getUsers(since=0) : Observable<any[]> {
    return this.http.get<any[]>(`https://api.github.com/users?per_page=10&since=${since}&access_token=${this.token}`)
      .pipe(
       // tap(() => console.log(`fetched users ${since}`)),
        catchError(this.handleError('getUsers'))
      ) as Observable<any>;
  }


  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param operation - name of the operation that failed
   */
  private handleError<T> (operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
       `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      throw new Error(`${operation} failed: ${message}`);
    };  
  }
}