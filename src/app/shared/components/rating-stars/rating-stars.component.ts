import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent {
  @Input() ratingStar: number;
  @Input() ratingStarOff: number = 0;

  getStars(rating: number): number[] {
    const roundedRating = Math.round(rating * 2) / 2; // Arredonda para a meia estrela mais próxima
    const stars: number[] = [];

    for (let i = 1; i <= 5; i++) {
      if (roundedRating >= i) {
        stars.push(1); // Estrela cheia
      } else if (roundedRating >= i - 0.5) {
        stars.push(0.5); // Meia estrela
      } else {
        stars.push(0); // Estrela vazia
      }
    }

    return stars;
  }
}
