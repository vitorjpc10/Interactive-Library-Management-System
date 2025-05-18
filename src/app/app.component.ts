import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { InventoryComponent } from './inventory/inventory.component';
import { AddToInventoryComponent } from './add-to-inventory/add-to-inventory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InventoryComponent, AddToInventoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Library Cart and Inventory System';
}
