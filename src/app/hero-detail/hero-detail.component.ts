import { Component, OnInit, Input } from '@angular/core';
import {Hero} from '../hero';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {HeroService} from '../hero.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})

export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  showSpinner = false;

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => {
      console.log('returned hero: ', hero[0]);
      this.hero = hero[0];
    });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.showSpinner = true;
    setTimeout(() => {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
      this.showSpinner = false;
    }, 2000);
  }
}
