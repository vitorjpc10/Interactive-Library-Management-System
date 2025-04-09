import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader, BrowserCodeReader } from '@zxing/browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-to-inventory',
  templateUrl: './add-to-inventory.component.html',
  styleUrls: ['./add-to-inventory.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class AddToInventoryComponent {
  scanning = false;
  resultMessage: string = '';
  scannedBooks: string[] = [];
  scanner: BrowserMultiFormatReader | null = null;
  videoInputDevice: any = null;

  // Properties for camera selection
  availableVideoDevices: any [] = [];
  selectedDeviceId: string = '';
  currentDeviceLabel: string = '';

  /**
   * Initiates the scanning process using the camera. This function attempts to access
   * the camera, lists available video input devices, and selects a suitable camera
   * for scanning barcodes. It prioritizes back-facing cameras for mobile devices.
   * If no back-facing cameras are available or working, it defaults to the first
   * available camera. The function updates the list of scanned books and displays
   * messages based on the scanning results. Handles errors related to camera access
   * and scanning process.
   *
   * @throws Will throw an error if the Camera API is not supported by the browser
   *         or if no camera devices are found.
   */
  async startScan() {
    this.resultMessage = ''; // Clear previous result messages
    this.scannedBooks = []; // Reset the scanned books list
    this.scanning = true; // Set scanning state to true

    this.scanner = new BrowserMultiFormatReader(); // Initialize the scanner

    try {
      // First check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser');
      }

      // Request camera permission first
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Get available camera devices
      const listAvailableVideoDevices = await BrowserCodeReader.listVideoInputDevices();
      this.availableVideoDevices = listAvailableVideoDevices;

      if (this.availableVideoDevices.length === 0) {
        throw new Error('No camera devices found. Unable to Scan');
      }

      // Log available devices
      console.log('Available cameras:', this.availableVideoDevices);

      // Smart camera selection logic
      if (!this.selectedDeviceId) {
        /**
         * Determines if a camera is a back-facing camera based on its label.
         * Looks for keywords like "back", "rear", or "environment" in the label.
         * @param label The camera label to check
         * @returns {boolean} true if the camera is a back-facing camera, false otherwise
         */
        const isBackFacing = (label: string): boolean =>
          label.toLowerCase().includes('back') ||
          label.toLowerCase().includes('rear') ||
          label.toLowerCase().includes('environment');

        const backFacingCameras = this.availableVideoDevices.filter(device =>
          isBackFacing(device.label)
        );

        console.log('Back-facing cameras:', backFacingCameras);

        /**
         * Tests if a camera is working by attempting to start the camera stream
         * with the given deviceId. Returns true if the camera is working, false
         * otherwise.
         * @param deviceId The id of the camera to test
         * @returns {Promise<boolean>} true if the camera is working, false otherwise
         */
        const testCamera = async (deviceId: string): Promise<boolean> => {
          try {
            // Attempt to start the camera stream with the given deviceId
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: deviceId } }
            });

            // Stop the camera stream after testing
            stream.getTracks().forEach(track => track.stop());

            // Camera is working if we got this far
            return true;
          } catch (err) {
            // Log any errors if the camera fails to start
            console.warn(`Camera with deviceId ${deviceId} failed to start:`, err);

            // Camera is not working if we caught an error
            return false;
          }
        };

        for (const camera of backFacingCameras) {
          const isWorking = await testCamera(camera.deviceId);
          if (isWorking) {
            this.selectedDeviceId = camera.deviceId;
            this.currentDeviceLabel = camera.label;
            break;
          }
        }

        // If no working back-facing camera found, fall back to first available
        if (!this.selectedDeviceId) {
          this.selectedDeviceId = this.availableVideoDevices[0].deviceId;
          this.currentDeviceLabel = this.availableVideoDevices[0].label;
        }
      }

      console.log(`Selected camera: ${this.currentDeviceLabel}`);
      this.resultMessage = `📸 Using camera: ${this.currentDeviceLabel}`;

      // Start scanning from the selected video device
      this.videoInputDevice = await this.scanner.decodeFromVideoDevice(
        this.selectedDeviceId,
        'video',
        (result, error) => {
          if (result) {
            const isbn = result.getText();

            // Check if the ISBN is already scanned
            if (!this.scannedBooks.includes(isbn)) {
              this.scannedBooks.push(isbn); // Add new ISBN to the list
              this.resultMessage = `✅ Scan successful: ${isbn}`;
            } else {
              this.resultMessage = `⚠️ ISBN ${isbn} already scanned.`;
            }
          }
          // Handle scanning errors
          if (error && !error.message.includes('NotFoundException')) {
            this.resultMessage = `❌ Scanning error: ${error.message}`;
          }
        }
      );

    } catch (err: any) {
      console.error('Camera error:', err);
      this.resultMessage = `❌ Camera error: ${err.message || 'Unknown error'}`;
      this.scanning = false; // Reset scanning state on error
    }
  }

  /**
   * Stops the ongoing scanning process and releases any resources used.
   */
  stopScan() {
    this.scanning = false; // Set scanning state to false
    if (this.videoInputDevice) {
      this.videoInputDevice.stop(); // Stop the video input
      this.videoInputDevice = null; // Clear the video input reference
    }
    if (this.scanner) {
      this.scanner = null; // Clear the scanner reference
    }
    this.resultMessage = '🛑 Scanning stopped.'; // Update result message
  }

  /**
   * Handles the camera selection dropdown change event.
   * @param deviceId The id of the selected camera device
   */
  async onCameraChange(deviceId: string) {
    // Find the selected camera device
    const selectedDevice = this.availableVideoDevices.find(d => d.deviceId === deviceId);
    if (selectedDevice) {
      // Update the selected device id and label
      this.selectedDeviceId = deviceId;
      this.currentDeviceLabel = selectedDevice.label;

      // If already scanning, restart with new camera
      if (this.scanning) {
        // Stop the current scanning process
        await this.stopScan();
        // Start the scanning process with the new camera
        await this.startScan();
      }
    }
  }

  //! Need to introduce logic for the values of the scannedBooks to hit the google api and retrieve the data given that ISBN
  //! 1. logic to ignore Scanned IDs that are not ISBN (create a ISBN Validator before hitting the API)
  //! 2. Error handling for the API call if ISBN is not found, create a page overlay for manual entry

  // Clean up resources when component is destroyed
  ngOnDestroy() {
    this.stopScan();
  }
}


