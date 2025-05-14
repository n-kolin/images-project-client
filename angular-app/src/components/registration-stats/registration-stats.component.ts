import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from '../../services/user.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface RegistrationData {
  year: number;
  month: number;
  count: number;
}

@Component({
  selector: 'app-registration-stats',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './registration-stats.component.html',
  styleUrl: './registration-stats.component.css'
})
export class RegistrationStatsComponent implements OnInit {
  @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>
  private chart: Chart

  // Chart title
  chartTitle = "Monthly User Registrations - Last 12 Months"

  // Chart data
  chartData: any[] = []
  customColors: any[] = []
  view: [number, number] = [window.innerWidth * 0.6, window.innerHeight * 0.6] // Reduced size further

  // Chart options
  showXAxis = true
  showYAxis = true
  gradient = false
  showLegend = false
  showXAxisLabel = false // Hide X axis label
  xAxisLabel = ""
  showYAxisLabel = false // Hide Y axis label
  yAxisLabel = ""
  registrationData: any[] = []
  showGridLines = false // Hide grid background

  // Y-axis configuration for whole numbers
  yAxisTickFormattingFn = (val: number) => Math.round(val)
  yScaleMax: number

  // Color ranges - will be calculated dynamically
  minValue = 0
  maxValue = 0
  quartile1 = 0
  quartile2 = 0
  quartile3 = 0

  // Color scheme
  colorScheme: any = {
    domain: [
      "#F4AEE2", "#E26CAD", "#CD1980","#BB0951"
     ],
  }

  constructor(private userService: UserService) {
    // Handle window resize
    window.addEventListener("resize", this.onResize.bind(this))
  }

  onResize(): void {
    // Adjusted to account for the gradient legend and margins
    this.view = [window.innerWidth * 0.6, window.innerHeight * 0.6]
  }

  ngOnInit(): void {
    this.userService.getRegistrationStats().subscribe((data) => {
      this.registrationData = data
      this.processLast12Months()
    })
  }

  // Add this method to generate random user counts
  generateRandomUserCounts(data: RegistrationData[]): RegistrationData[] {
    return data.map((item) => {
      // Generate a random number between 10 and 100
      const randomCount = Math.floor(Math.random() * 91) + 10
      return {
        ...item,
        count: item.count + randomCount,
      }
    })
  }

  // Update the processLast12Months method to include random user counts
  processLast12Months(): void {
    // Get current date
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear()

    // Generate array of last 12 months (including current month)
    const last12Months: { year: number; month: number }[] = []

    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i
      let year = currentYear

      if (month <= 0) {
        month += 12
        year -= 1
      }

      last12Months.unshift({ year, month })
    }

    // Create complete dataset with zeros for missing months
    let completeData: RegistrationData[] = last12Months.map((monthData) => {
      const existingData = this.registrationData.find(
        (item) => item.year === monthData.year && item.month === monthData.month,
      )

      return {
        year: monthData.year,
        month: monthData.month,
        count: existingData ? existingData.count : 0,
      }
    })

    // Add random user counts to each month
    completeData = this.generateRandomUserCounts(completeData)

    // Find maximum count to set y-axis scale
    const maxCount = Math.max(...completeData.map((item) => item.count))
    this.yScaleMax = Math.ceil(maxCount / 10) * 10 // Round up to nearest 10

    // Calculate dynamic color ranges based on data
    this.calculateColorRanges(completeData)

    this.formatChartData(completeData)
  }

  calculateColorRanges(data: RegistrationData[]): void {
    // Extract all count values
    const counts = data.map((item) => item.count)

    // Sort the counts for quartile calculation
    const sortedCounts = [...counts].sort((a, b) => a - b)

    // Calculate min and max
    this.minValue = sortedCounts[0]
    this.maxValue = sortedCounts[sortedCounts.length - 1]

    // Calculate quartiles
    const q1Index = Math.floor(sortedCounts.length * 0.25)
    const q2Index = Math.floor(sortedCounts.length * 0.5)
    const q3Index = Math.floor(sortedCounts.length * 0.75)

    this.quartile1 = sortedCounts[q1Index]
    this.quartile2 = sortedCounts[q2Index]
    this.quartile3 = sortedCounts[q3Index]

    // If all values are the same, create artificial ranges
    if (this.minValue === this.maxValue) {
      this.quartile1 = this.minValue
      this.quartile2 = this.minValue
      this.quartile3 = this.minValue
    }
  }

  formatChartData(data: RegistrationData[]): void {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Format chart data - use short month name and year on same line
    this.chartData = data.map((item) => {
      const shortMonthName = monthNames[item.month - 1].substring(0, 3)
      return {
        name: shortMonthName + " " + item.year,
        value: item.count,
      }
    })

    // Create custom colors array for each bar
    this.customColors = data.map((item) => {
      const shortMonthName = monthNames[item.month - 1].substring(0, 3)
      return {
        name: shortMonthName + " " + item.year,
        value: this.getColorForValue(item.count),
      }
    })
  }

  getColorForValue(value: number): string {
    if (value <= this.quartile1) {
      return this.colorScheme.domain[0] 
    } else if (value <= this.quartile2) {
      return this.colorScheme.domain[1] 
    } else if (value <= this.quartile3) {
      return this.colorScheme.domain[2] 
    } else {
      return this.colorScheme.domain[3] 
    }
  }

  

}