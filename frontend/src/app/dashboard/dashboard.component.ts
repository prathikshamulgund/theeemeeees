import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  data?: any;
}

interface Alert {
  equipment_name: string;
  message: string;
  severity: string;
  days_until?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'AI Mining Operations Co-Pilot';

  messages: Message[] = [];
  userInput = '';
  isLoading = false;

  alerts: Alert[] = [];
  equipmentData: any[] = [];
  productionData: any[] = [];
  carbonFootprint: any = {};

  fuelChart: any;
  productionChart: any;

  // Use Docker backend hostname
  private backendUrl = 'http://backend:5000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadAlerts();

    this.messages.push({
      text: 'Hello! I\'m your AI Mining Operations Co-Pilot. Ask me about fuel consumption, maintenance schedules, production efficiency, or carbon emissions.',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  loadDashboardData() {
    this.http.get(`${this.backendUrl}/data`).subscribe({
      next: (response: any) => {
        this.equipmentData = response.equipment || [];
        this.productionData = response.production || [];
        this.carbonFootprint = response.carbon_footprint || {};

        setTimeout(() => this.initializeCharts(), 100);
      },
      error: (error) => console.error('Error loading dashboard data:', error)
    });
  }

  loadAlerts() {
    this.http.get(`${this.backendUrl}/alerts`).subscribe({
      next: (response: any) => this.alerts = response.alerts || [],
      error: (error) => console.error('Error loading alerts:', error)
    });
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage: Message = {
      text: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const query = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    try {
      const response: any = await this.http.post(`${this.backendUrl}/query`, { query }).toPromise();
      this.messages.push({
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        data: response.data
      });
    } catch (error) {
      console.error('Error processing query:', error);
      this.messages.push({
        text: 'I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }

  initializeCharts() {
    this.createFuelChart();
    this.createProductionChart();
  }

  createFuelChart() {
    // TODO: implement chart logic
  }

  createProductionChart() {
    // TODO: implement chart logic
  }

  getAlertClass(severity: string): string {
    switch (severity) {
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      default: return 'alert-low';
    }
  }
}
