import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader, BrowserCodeReader} from '@zxing/browser';

@Component({
  selector: 'app-add-to-inventory',
  templateUrl: './add-to-inventory.component.html',
  styleUrls: ['./add-to-inventory.component.css'],
  imports: [CommonModule]
})

export class AddToInventoryComponent {
  scanning = false;
  resultMessage: string = '';
  scannedBooks: string[] = [];
  scanner: BrowserMultiFormatReader | null = null;
  videoInputDevice: any = null; // To store the video input device

  async startScan() {
    this.resultMessage = '';
    this.scannedBooks = [];
    this.scanning = true;

    this.scanner = new BrowserMultiFormatReader();

    try {
      // Asking the user for permission to use camera
      await navigator.mediaDevices.getUserMedia({ video: true });

      const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();

      const selectedDeviceId = videoInputDevices[0]?.deviceId;
      if (!selectedDeviceId) {
        throw new Error(`No camera deviceId found after permission. Devices: ${JSON.stringify(videoInputDevices)}`);
      }
      this.videoInputDevice = await this.scanner.decodeFromVideoDevice(selectedDeviceId, 'video', (result, error) => {
        if (result) {
          const isbn = result.getText();
          if (!this.scannedBooks.includes(isbn)) {
            this.scannedBooks.push(isbn);
            this.resultMessage = `✅ Scan successful: ${isbn}`;
          } else {
            this.resultMessage = `⚠️ ISBN ${isbn} already scanned.`;
          }
        }
        if (error) {
          this.resultMessage = '❌ Failed to scan. Try again.';
        }
      });

    } catch (err: any) {
      this.resultMessage = `❌ Error: ${err.message}`;
      this.scanning = false;
    }
  }

  stopScan() {
    this.scanning = false;
    if (this.videoInputDevice) {
      this.videoInputDevice.stop(); // Stop the video stream
      this.videoInputDevice = null;
    }
    this.resultMessage = '🛑 Scanning stopped.';
  }
}
