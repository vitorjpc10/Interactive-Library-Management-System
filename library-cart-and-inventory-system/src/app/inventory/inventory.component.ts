import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Book } from '../models/book.interface';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})

export class InventoryComponent implements OnInit {
  books: Book[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      imageUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100',
      price: 29.99,
      inventory: 4,
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      imageUrl:
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=100',
      price: 24.99,
      inventory: 3,
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      imageUrl:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=100',
      price: 19.99,
      inventory: 8,
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //! Probably add a function here to reach out to database and retrieve all books information and then update the instance variable books array first
    //! Then run this function to update the book covers
    this.updateBookCovers();
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
      const query = `${book.title} ${book.author}`;

      // Construct the Google Books API request URL
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

      // Make an HTTP GET request to the Google Books API
      this.http.get(url).subscribe((data: any) => {
        // Check if response contains a valid thumbnail image link
        if (data.items && data.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
          // Update the book's imageUrl with the retrieved thumbnail link
          book.imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
        }
      });
    });
  }
}


// SEE how to 1. run and debug a file
// 2. how to implement this http request to the google library to retrieve the file book image url
