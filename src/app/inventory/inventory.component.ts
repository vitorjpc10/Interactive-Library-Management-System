import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Book} from '../models/book.interface';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})

export class InventoryComponent implements OnInit {



  books: Book[] = [];

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    try {
      await this.fetchBooks();
      this.updateBookCovers();
    } catch (error) {
      console.error('Error initializing inventory:', error);
    }
  }

  async fetchBooks(): Promise<Book[]> {
    try {
      const response = await this.http.get<Book[]>('http://localhost:8080/api/books').toPromise();

      if (!response) {
        throw new Error('API returned empty response');
      }

      // The API response already matches our Book interface, so we can directly assign it
      this.books = response;
      return this.books;

    } catch (error) {
      const errorMessage = `Failed to fetch books from http://localhost:8080/api/books. ` +
        `Error: ${error instanceof Error ? error.message : String(error)}`;
      throw new Error(errorMessage);
    }
  }

  /**
   * Updates the book covers by making a request to the Google Books API
   * for each book in the inventory. If a valid image link is found,
   * updates the book's imageUrl property with that link.
   */
  updateBookCovers() {
    // Iterate over each book in the inventory
    this.books.forEach((book) => {
      // Construct the query string using book title and author
      const query = `intitle:${book.title} inauthor:${book.author}`;

      // Construct the Google Books API request URL
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;

      // Make an HTTP GET request to the Google Books API
      this.http.get(url).subscribe((data: any) => {
        // Check if response contains a valid image link
        if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
          const imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail ||
            data.items[0].volumeInfo.imageLinks.smallThumbnail ||
            data.items[0].volumeInfo.imageLinks.mediumThumbnail;
          book.imageUrl = imageUrl;
        } else {
          book.imageUrl = 'https://example.com/default-book-cover.jpg';
        }
      });
    });
  }
}
