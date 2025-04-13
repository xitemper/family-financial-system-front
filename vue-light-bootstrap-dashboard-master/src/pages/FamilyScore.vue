<template>
  <div id="app">
    <el-row :gutter="20">
      <!-- 评分表格 -->
      <el-col :span="8" v-for="(score, index) in scores" :key="index">
        <el-card class="score-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>{{ score.dimension }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详情"
              placement="top"
            >
              <i class="el-icon-info" style="cursor: pointer"></i>
            </el-tooltip>
          </div>
          <div class="card-body">
            <div class="score-bar">
              <el-progress
                :percentage="score.value"
                status="success"
              ></el-progress>
              <p class="score-value">{{ score.value }}%</p>
            </div>
            <p>{{ score.advice }}</p>
          </div>
        </el-card>
      </el-col>

      <!-- 总分 -->
      <el-col :span="24">
        <el-card class="total-score-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>总评分</span>
          </div>
          <div class="card-body total-score">
            <el-progress
              :percentage="totalScore"
              status="success"
              stroke-width="20"
            ></el-progress>
            <h2>{{ totalScore }}%</h2>
            <p>总体财务健康状况：{{ overallAdvice }}</p>
          </div>
        </el-card>
      </el-col>

      <!-- 显示评分趋势的图表 -->
      <el-col :span="24">
        <div id="chart" style="height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol, ElCard, ElProgress, ElTooltip } from "element-ui";
import echarts from "echarts";

export default {
  name: "App",
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElProgress,
    ElTooltip,
  },
  data() {
    return {
      // 模拟的评分数据
      scores: [
        {
          dimension: "收支平衡",
          value: 80,
          advice: "收支状况良好，继续保持。",
        },
        {
          dimension: "非必要支出占比",
          value: 70,
          advice: "支出有所控制，但仍有提升空间。",
        },
        {
          dimension: "家庭组预算执行情况",
          value: 90,
          advice: "预算控制较好，已很好地遵守预算。",
        },
        {
          dimension: "储蓄占比",
          value: 60,
          advice: "储蓄进度偏低，建议增加储蓄计划。",
        },
      ],
      // 总体评分，基于各个维度评分的加权平均
      totalScore: 75,
      overallAdvice: "总体财务健康状况良好，但仍有改进空间，尤其是储蓄。",
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const myChart = echarts.init(document.getElementById("chart"));
      const option = {
        title: {
          text: "财务健康评分趋势",
          subtext: "各个维度的评分变化趋势",
        },
        tooltip: {},
        legend: {
          data: ["收支平衡", "非必要支出占比", "预算执行情况", "储蓄占比"],
        },
        xAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
        },
        yAxis: {
          type: "value",
          max: 100,
        },
        series: [
          {
            name: "收支平衡",
            type: "line",
            data: [75, 80, 70, 85, 80, 78, 80],
          },
          {
            name: "非必要支出占比",
            type: "line",
            data: [60, 65, 68, 70, 72, 70, 74],
          },
          {
            name: "预算执行情况",
            type: "line",
            data: [85, 88, 90, 92, 90, 89, 90],
          },
          {
            name: "储蓄占比",
            type: "line",
            data: [55, 58, 60, 62, 63, 60, 65],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#app {
  margin: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 20px;
}

.score-card,
.total-score-card {
  margin-bottom: 20px;
}

.score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-value {
  font-weight: bold;
  font-size: 18px;
}

.total-score {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.total-score h2 {
  font-size: 32px;
  font-weight: bold;
}

.total-score-card {
  margin-top: 30px;
}
</style>
