import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader, BrowserCodeReader } from '@zxing/browser';

@Component({
  selector: 'app-add-to-inventory',
  templateUrl: './add-to-inventory.component.html',
  styleUrls: ['./add-to-inventory.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class AddToInventoryComponent implements OnDestroy {
  scanning = false;
  resultMessage = '';
  scannedBooks: string[] = [];
  scanner: BrowserMultiFormatReader | null = null;
  selectedStream: MediaStream | null = null;

  async startScan() {
    this.resultMessage = '';
    this.scannedBooks = [];
    this.scanning = true;

    this.scanner = new BrowserMultiFormatReader();

    try {
      console.log('📷 Requesting camera access...');

      let stream: MediaStream;
      stream = await navigator.mediaDevices.getUserMedia({ video: true });


      this.selectedStream = stream;

      const devices = await BrowserCodeReader.listVideoInputDevices();
      if (devices.length === 0) {
        throw new Error('No camera devices found');
      }
      console.log('✅ Found video devices:');

      devices.forEach((device, idx) => {
        console.log(`  [${idx}] label: "${device.label}" | deviceId: ${device.deviceId}`);
      });

      //! Implement some logic here to check all devices elements and label names and if any contains "back" in it prioritize it their id to use that camera instead (case for phones) else default to element 0
      //! Adicionar um log e <p> para mostrar qual camera vai ser usada

      //! Talvez pedir para o usuario selecionar qual camera ele deseja usar
      const selectedDeviceId = devices[0]?.deviceId;
      if (!selectedDeviceId) {
        throw new Error('No camera device ID available');
      }

      this.scanner.decodeFromVideoDevice(selectedDeviceId, 'video', (result, error) => {
        if (result) {
          const isbn = result.getText();
          if (!this.scannedBooks.includes(isbn)) {
            this.scannedBooks.push(isbn);
            this.resultMessage = `✅ Scan successful: ${isbn}`;
          } else {
            this.resultMessage = `⚠️ ISBN ${isbn} already scanned.`;
          }
        } else if (error) {
          console.warn('Scan error:', error);
          this.resultMessage = '❌ Failed to scan. Try again.';
        }
      });
      //! 1. ao pegar um isbn, parar o loop e precisar clicar o botao mais uma vez para comecar o loop novamente
      //! 2. Ajustar css da div da camera para ser menor e mais estreito

    } catch (err: any) {
      console.error('Camera error:', err);
      this.resultMessage = `❌ Camera error: ${err.message || 'Unknown error'}`;
      this.scanning = false;
    }
  }

  stopScan() {
    this.scanning = false;

    if (this.selectedStream) {
      this.selectedStream.getTracks().forEach(track => track.stop());
      this.selectedStream = null;
      console.log('🛑 Camera stream stopped');
    }

    if (this.scanner) {
      // this.scanner.reset();
      this.scanner = null;
      console.log('🛑 Scanner reset');
    }

    this.resultMessage = '🛑 Scanning stopped.';
  }

  ngOnDestroy() {
    this.stopScan();
  }
}

//! test port:
//ng serve --host 0.0.0.0 --disable-host-check

// ngrok http --url=maximum-marten-allegedly.ngrok-free.app 4200

