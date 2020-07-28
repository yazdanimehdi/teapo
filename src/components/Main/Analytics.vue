<template>
  <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
    <v-container fluid style="overflow-y: scroll">
      <v-row>
        <v-col cols="9" sm="9" md="9" lg="9" xl="9" style="padding-right: 0">
          <v-card shaped height="600px" :color="cardColor" flat>
            <v-container>
              <v-row>

                <apexchart type=line height=400 :width="`${width*0.7}px`" ref="chart" :options="chartOptions"
                           :series="series" v-if="dataAvailable"></apexchart>
                <v-card flat height="400" :width="`${width*0.7}px`" style="margin-left: 14px" :color="cardColor" v-else>
                  <v-img src="../../assets/sad.png" height="200" contain style="margin-top: 30px;" position="center">
                  </v-img>
                  <h2 style="text-align: center; margin-top: 30px">No Data Available</h2>
                  <h3 style="text-align: center; margin-top: 5px">Try completing a TPO for this section to work</h3>

                </v-card>
              </v-row>
              <v-row justify="center" align="center">
                <v-col>
                  <v-container fluid>
                    <v-row justify="center" align="center">
                      <v-col>
                        <h2 style="text-align: center">Average of last 5 TPO</h2>
                      </v-col>
                      <v-col>
                        <div style=" width: 50px;height: 50px;background: rgba(255, 255, 255, 0.3);border-radius: 50%">
                          <h2 style="text-align: center; padding-top: 10px">
                            {{ lastFiveAverage }}
                          </h2>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col>
                  <v-container fluid>
                    <v-row justify="center" align="center">
                      <v-col>
                        <h2 style="text-align: center">Total Average</h2>
                      </v-col>
                      <v-col>
                        <div style=" width: 50px;height: 50px;background: rgba(255, 255, 255, 0.3);border-radius: 50%">
                          <h2 style="text-align: center; padding-top: 10px">
                            {{ totalAverage }}
                          </h2>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="3" sm="3" md="3" lg="3" xl="3" style="padding-left: 0">
          <v-container>
            <v-row @click="mode='reading'">
              <div class="shape-class" style="background-color: #E280C2">
                <h2>Reading</h2>
              </div>
              <div class="triangle" style="border-top-color: #E280C2"></div>
            </v-row>
            <v-row @click="mode='listening'">
              <div class="shape-class" style="background-color: #92D26E">
                <h2>Listening</h2>
              </div>
              <div class="triangle" style="border-top-color: #92D26E"></div>
            </v-row>
            <v-row @click="mode='speaking'">
              <div class="shape-class" style="background-color: #E3BB7D">
                <h2>Speaking</h2>
              </div>
              <div class="triangle" style="border-top-color: #E3BB7D"></div>
            </v-row>
            <v-row @click="mode='writing'">
              <div class="shape-class" style="background-color: #8B83C2">
                <h2>Writing</h2>
              </div>
              <div class="triangle" style="border-top-color: #8B83C2"></div>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import {FETCH_ANALYTICS} from "@/store/actions/analytics";
import {mapGetters} from 'vuex'

export default {
  name: "Analytics",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    width: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      mode: 'reading',
    }
  },
  created() {
    this.$store.dispatch(FETCH_ANALYTICS)
  },
  computed: {
    ...mapGetters([
      'listeningDates',
      'readingDates',
      'speakingDates',
      'writingDates',
      'listeningChartData',
      'readingChartData',
      'speakingChartData',
      'writingChartData',
      'listeningCategory',
      'readingCategory',
      'speakingCategory',
      'writingCategory',
      'readingAverage',
      'listeningAverage',
      'speakingAverage',
      'writingAverage']),
    chartOptions() {
      return {
        chart: {
          toolbar: {
            show: false,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
            },
          },
          type: "line",
          stacked: false
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontFamily: 'kalam',
            fontWeight: 'bold',
          },
        },
        colors: ["#1C0153", "#555151"],
        grid: {
          row: {
            colors: ['#e5e5e5', 'rgba(255, 255, 255, 0.4)'],
            opacity: 0.4
          },
        },
        stroke: {
          width: [4, 4]
        },
        plotOptions: {
          bar: {
            columnWidth: "20%"
          }
        },
        xaxis: {
          axisTicks: {
            show: false
          },
          tickPlacement: 'on',
          axisBorder: {
            show: true,
            color: "#1C0153"
          },
          labels: {
            style: {
              colors: "#1C0153",
              fontSize: '12px',
              fontFamily: 'kalam',
              fontWeight: 800,
            }
          },
          categories: this.mode === 'reading' ? this.readingCategory : this.mode === 'listening' ? this.listeningCategory : this.mode === 'speaking' ? this.speakingCategory : this.writingCategory
          ,
          title: {
            text: 'TPO',
            style: {
              color: "#1C0153",
              fontSize: '18px',
              fontFamily: 'kalam',
              fontWeight: 800,
            },
          }
        },
        yaxis:
            {
              type: 'category',
              axisTicks: {
                show: false
              },
              axisBorder: {
                show: true,
                color: "#1C0153"
              },
              labels: {
                style: {
                  colors: "#1C0153",
                  fontSize: '12px',
                  fontFamily: 'kalam',
                  fontWeight: 800,
                },
                formatter: (value) => {
                  return parseInt(value)
                }
              },
              title: {
                text: 'Score',
                style: {
                  color: "#1C0153",
                  fontWeight: 800,
                  fontFamily: 'kalam',
                  fontSize: '18px',
                }
              },
              max: 30,
              decimalsInFloat: 0
            },
        tooltip: {
          enabled: true,
          style: {
            color: "#1C0153",
            fontWeight: 800,
            fontFamily: 'kalam',
            fontSize: '16px',
          },
          x: {
            formatter: (index) => this.chartOptions.xaxis.categories[index - 1]
          },
          y: {
            // eslint-disable-next-line no-unused-vars
            formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
              return this.mode === 'reading' ? this.readingChartDates[dataPointIndex] : this.mode === 'listening' ? this.listeningChartDates[dataPointIndex] : this.mode === 'speaking' ? this.speakingChartDates[dataPointIndex] : this.writingChartDates[dataPointIndex]
            },
            title: {
              // eslint-disable-next-line no-unused-vars
              formatter: (seriesName) => 'Date'
            }
          }
        },
        legend: {
          horizontalAlign: "left",
          fontWeight: 800,
          fontSize: '16px',
          offsetX: 40
        }
      }
    },
    series() {
      return [{data: this.mode === 'reading' ? this.readingChartData : this.mode === 'listening' ? this.listeningChartData : this.mode === 'speaking' ? this.speakingChartData : this.writingChartData}]
    },
    dataAvailable(){
      return this.mode === 'reading' ? this.readingChartData.length !== 0 : this.mode === 'listening' ? this.listeningChartData.length !== 0 : this.mode === 'speaking' ? this.speakingChartData.length !== 0 : this.writingChartData.length !==0
    },
    totalAverage() {
      return this.mode === 'reading' ? this.readingAverage[0] : this.mode === 'listening' ? this.listeningAverage[0] : this.mode === 'speaking' ? this.speakingAverage[0] : this.writingAverage[0]
    },
    lastFiveAverage() {
      return this.mode === 'reading' ? this.readingAverage[1] : this.mode === 'listening' ? this.listeningAverage[1] : this.mode === 'speaking' ? this.speakingAverage[1] : this.writingAverage[1]
    },
    cardColor() {
      switch (this.mode) {
        case "reading":
          return '#E280C2';
        case "listening":
          return '#92D26E';
        case "speaking":
          return '#E3BB7D';
        case "writing":
          return '#8B83C2';
      }
      return ''
    }
  }
}
</script>

<style scoped>
.shape-class {
  width: 100px;
  height: 80px;
  background: red;
  text-align: center;
  padding: 25px 0;
  margin-bottom: 10px;
  user-select: none;
}

.triangle {
  width: 0;
  height: 0;
  border-top: 80px solid red;
  border-right: 30px solid transparent;
  user-select: none;
}
</style>