import {Component, OnInit} from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import { NgForm } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {DialogConfig} from '../dialog/dialog.component';



import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  hero = new Hero();
  isValidFormSubmitted = false;
  validateHero = true;

  showSpinner = false;

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.getHeroes();
  }

  onFormSubmit(heroForm: NgForm) {
    this.isValidFormSubmitted = false;
    if (heroForm.invalid) {
      console.log('not valid');
      this.showAlert();
      return;
    }

      this.isValidFormSubmitted = true;
      this.hero = heroForm.value;
      this.heroService.addHero(this.hero);
      this.hero = new Hero();
      console.log('Hero was added!');
      heroForm.resetForm();

    }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  goBack(): void {
    this.location.back();
  }

  add(name, type, points, date, color): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.showSpinner = true;
    setTimeout(() => {
    this.heroService.addHero({name, type, points, date, color} as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
        }
    );
      this.showSpinner = false;
      this.goBack();
    }, 5000);
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  showAlert(): void {
    const dialog: DialogConfig = {
      title: 'Please, fill in this form correctly!',
      close: 'OK'
    };
    this.dialog.open(DialogComponent, { width: '287px', data: dialog });
  }

}
