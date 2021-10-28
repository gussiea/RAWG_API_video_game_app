import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { stringify } from 'querystring';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/model';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy{
  public sort: string;
  public games: Array<Game>;
  private routeSub: Subscription;
  private gameSub:Subscription;

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
  ) {}

  ngOnInit(): void {
    //activatedRoute.params gives the current route params
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      //check if user really search something params里面有没有game-search
      if (params['game-search']) {
        //by rating 按照第一个属性sort
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string) {
    this.gameSub = this.httpService
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        console.log(gameList);
      });
  }

  openGameDetails(id: string){
    this.router.navigate(['details', id])
  }

  ngOnDestroy(){
    this.gameSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
