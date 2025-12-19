import { Component, ElementRef, ViewChild, signal, computed, effect, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter-search.component.html',
  styleUrl: './filter-search.component.css'
})
export class FilterSearchComponent {
  @Input() dataList: { value: number; text: string }[] = [];
  @Input() placeholder: string = 'Selecione...';
  @Output() selectedItem = new EventEmitter<{ value: number; text: string }>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('resultBox') resultBox!: ElementRef<HTMLDivElement>;

  searchControl = new FormControl('');

  // Estado da lista de sugestões (reativo)
  filteredResults: { value: number; text: string }[] = [];

  isDropdownVisible = false;

  /*
  constructor() {

    const dataList = [
      { value: 1, text: 'kelsi monroe'},
      { value: 2, text: 'gina valentina'},
      { value: 3, text: 'eliza ibarra'},
      { value: 4, text: 'liz jordan'},
      { value: 5, text: 'penelope kay'},
      { value: 6, text: 'kiara cole'},
      { value: 7, text: 'veronica church'},
      { value: 8, text: 'avi love'},
      { value: 9, text: 'alina lopez'},
      { value: 10, text: 'aria valencia'},
      { value: 11, text: 'ariana marie'},
      { value: 12, text: 'daisy stone'},
      { value: 14, text: 'reina rae'},
      { value: 15, text: 'lexi luna'},
      { value: 16, text: 'chloe temple'},
      { value: 17, text: 'remy lacroix'},
      { value: 18, text: 'eve evans'},
      { value: 19, text: 'allie eve'},
      { value: 20, text: 'daisy stone'},
      { value: 21, text: 'violet starr'},
      { value: 22, text: 'kendra lust'},
      { value: 23, text: 'tori black'},
      { value: 24, text: 'eva lovia'},
      { value: 25, text: 'anissa kate'},
      { value: 26, text: 'valentina nappi'},
      { value: 27, text: 'abella danger'},
      { value: 28, text: 'dani daniels'},
      { value: 29, text: 'rachel starr'},
      { value: 30, text: 'luna star'},
      { value: 31, text: 'nicole aniston'},
    ]

    const resultBox = document.querySelector('.results') as HTMLDivElement;
    const resultsUl = document.querySelector('.results ul') as HTMLDivElement;
    const inputBox = document.querySelector('.search-bar') as HTMLDivElement;

    const displayResults = function(result) {
      if (result.length === 0) {
        resultBox.innerHTML = "";
        return;
      }

      const resultHTML = result.map((item, index) => {
        return `<li
                  role="option"
                  tabindex="0"
                  data-index="${index}"
                  onclick=selectInput(this)>${item.text}</li>`;
      });

      resultBox.innerHTML = `<ul role="listbox">${resultHTML.join("")}</ul>`;
    }

    inputBox.addEventListener("keyup", function(e) {
      let result = [];
      const input = inputBox.value.toLowerCase();
      if (input.length === 0) {
        resultBox.innerHTML = "";
        return;
      }

      result = dataList.filter((item) => {
        return item.text.toLowerCase().includes(input);
      })

      displayResults(result);

    });

    resultBox.addEventListener("keydown", function(e) {
      if (e.key === 'Enter') {
        const element = document.activeElement as HTMLLIElement;
        if (element.tagName === 'LI') {
          selectInput(element);
        }
      }
    });

    function selectInput(item) {
      inputBox.value = item.innerText;
      resultBox.innerHTML = "";
      inputBox.focus();
    }


  }
    */

  ngOnInit() {
    this.filteredResults = [...this.dataList]; // Começa com todas as opções visíveis
  }

  // Exibe todas as opções ao focar no input
  onFocus() {
    this.filteredResults = [...this.dataList];
    this.isDropdownVisible = true;
  }

   // Fecha o dropdown se clicar fora
   onBlur(event: FocusEvent) {
    if (!(event.relatedTarget as HTMLElement)?.classList.contains('result-item')) {
      this.isDropdownVisible = false;
    }
  }

  // Filtra os resultados enquanto o usuário digita
  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredResults = input.length === 0
      ? [...this.dataList] // Se estiver vazio, mostra tudo
      : this.dataList.filter(item => item.text.toLowerCase().includes(input));
  }

  // Seleciona um item e preenche o input
  selectItem(item: { value: number; text: string }) {
    this.isDropdownVisible = false;
    this.searchInput.nativeElement.value = item.text;
    this.filteredResults = [];
    this.isDropdownVisible = false;
    this.searchInput.nativeElement.focus();
    this.selectedItem.emit(item);
  }

  // Captura tecla Enter para selecionar um item da lista
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement as HTMLLIElement;
      if (activeElement && activeElement.tagName === 'LI') {
        this.selectItem(this.filteredResults[Number(activeElement.dataset['index'])]);
      }
    }
  }
}
