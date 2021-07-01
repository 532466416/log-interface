<template>
  <div class="log-query">
    <div class="header">
      <span class="title">日志查询</span>
      <el-input
        v-model="searchText"
        placeholder="请输入关键词"
        class="input-with-select"
      >
        <el-select slot="prepend" v-model="searchType" placeholder="请选择">
          <el-option
            v-for="(item, index) in searchTypeOptions"
            :key="index"
            :value="item"
            :label="item"
          />
        </el-select>
        <template slot="append">
          <el-select
            v-model="timeNode"
            :class="{
              'time-select': true,
              'custom-select': timeNode === 'custom',
            }"
          >
            <el-option
              v-for="item in timeNodeOptions"
              :key="item.value"
              :value="item.value"
              :label="
                item.value === 'custom'
                  ? customTime
                    ? customTime[0] + ' 至 ' + customTime[1]
                    : '未选择'
                  : item.label
              "
              @click.native="timeNodeClick(item.value)"
            >
              {{ item.value === "custom" ? "自定义" : item.label }}
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <span class="iconfont icon-sousuo"></span>
          </el-button>
        </template>
      </el-input>
      <span v-if="logTotal > 0" class="result-total"
        >结果（{{ logAmount }}）</span
      >
      <el-button
        v-if="logTotal > 0"
        type="text"
        class="button-download"
        @click="handleDownload"
      >
        <i class="el-icon-download" /> <span>下载</span>
      </el-button>
    </div>
    <div class="content">
      <div v-if="logTotal === 0" class="no-result">
        <span class="iconfont icon-help icon-yemiannei_tishi"></span>
        <p>当前无“日志信息”，</p>
        <p>请先通过搜索框查询日志信息</p>
      </div>
      <div v-else class="result">
        <div class="list-header list-row">
          <div class="row-operate">
            <el-dropdown trigger="click">
              <span class="icon-setting">
                <span class="iconfont icon-zhucaidan_xitongshezhi"></span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><el-checkbox v-model="columnShow.time"
                    >时间</el-checkbox
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-show="columnShow.time" class="row-time">时间</div>
          <div class="row-content">日志内容</div>
          <div class="row-detail">操作</div>
        </div>
        <div class="list-content">
          <div v-for="(item, index) in logLists" :key="index" class="list-row">
            <div class="row-operate">
              <el-button
                v-if="item.flag"
                type="text"
                @click="item.flag = !item.flag"
              >
                <i class="el-icon-arrow-right" />
              </el-button>
              <el-button v-else type="text" @click="item.flag = !item.flag">
                <i class="el-icon-arrow-down" />
              </el-button>
            </div>
            <div v-show="columnShow.time" class="row-time">
              {{ item.createTime | timeDecimalDeal }}
            </div>
            <div class="row-content">
              <div
                :class="{
                  'log-text': true,
                  'log-text-auto': item.flag,
                  'log-text-an': !item.flag,
                }"
                v-html="textColorChange(item.message)"
              />
            </div>
            <div class="row-detail">
              <el-button type="text" @click="viewLogDetail(item)"
                >详情</el-button
              >
            </div>
          </div>
        </div>
        <el-pagination
          v-if="logTotal > 10"
          background
          :total="logTotal"
          :current-page.sync="currentPage"
          :page-size.sync="currentPageSize"
          :page-sizes="[10, 20, 50, 80, 100]"
          layout="prev, pager, next, sizes, jumper"
          @size-change="listObtain"
          @current-change="listObtain"
        />
      </div>
    </div>

    <el-dialog
      class="custom-time-select"
      :visible.sync="customVisible"
      width="450px"
      :close-on-click-modal="false"
      title="自定义时间选择"
    >
      <el-date-picker
        v-model="customTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <span slot="footer">
        <el-button type="primary" @click="customVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      class="detail-dialog"
      :visible.sync="detailVisible"
      width="50%"
      :close-on-click-modal="false"
      :title="detailTitle"
    >
      <div v-if="detailContent === ''" class="detail-content detail-no-data">
        暂无数据
      </div>
      <div
        v-else
        class="detail-content"
        v-html="textColorChange(detailContent)"
      />
      <span slot="footer">
        <el-button type="primary" @click="detailVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from "../../utils/formatter";
import { typeObtain, logObtain, contextObtain } from "../../api/logQuery";
const fixTimeSwitch = (range) => {
  const currentTime = Date.now();
  const startTime = formatTime(new Date(currentTime - range * 60 * 1000));
  const endTime = formatTime(new Date(currentTime));
  return [startTime, endTime];
};
export default {
  name: "LogQuery",
  filters: {
    timeDecimalDeal(time) {
      const standardUnit = time.split(".")[0];
      return standardUnit.replace("T", " ");
    },
  },
  data() {
    return {
      searchType: "", // 搜索类型
      searchText: "", // 搜索关键词
      timeNode: "all", // 查询时间范围
      searchTypeOptions: [], // 搜索类型下拉项
      timeNodeOptions: [
        // 查询范围下拉项
        { label: "近1分钟", value: 1 },
        { label: "近5分钟", value: 5 },
        { label: "近10分钟", value: 10 },
        { label: "近半小时", value: 30 },
        { label: "近1小时", value: 60 },
        { label: "近8小时", value: 8 * 60 },
        { label: "近12小时", value: 12 * 60 },
        { label: "近24小时", value: 24 * 60 },
        { label: "所有时间", value: "all" },
        { value: "custom" },
      ],
      customVisible: false, // 自定义弹框显示控制
      customTime: [
        // 自定义默认时间
        formatTime(new Date(Date.now() - 3600 * 1000 * 24 * 7)),
        formatTime(new Date()),
      ],
      detailVisible: false, // 日志详情显示
      detailTitle: "",
      detailContent: "",
      columnShow: {
        // 列名显示控制
        time: true,
      },
      logAmount: 0, // 当前页结果数量
      logTotal: 0, // 日志数量
      logLists: [], // 日志列表
      currentPage: 1, // 分页器当前分页
      currentPageSize: 10, // 分页器当前条目数
    };
  },
  created() {
    typeObtain().then((res) => {
      this.searchTypeOptions = res.data;
      this.searchType = this.searchTypeOptions[0];
    });
  },
  methods: {
    timeNodeClick(type) {
      // 查询类型选择
      if (type !== "custom") return;
      this.customVisible = true;
    },
    queryParamsJoint() {
      let timeRange = ["all", "custom"].includes(this.timeNode)
        ? this.customTime
        : fixTimeSwitch(this.timeNode);
      if (
        (timeRange === null && this.timeNode === "custom") ||
        this.timeNode === "all"
      ) {
        timeRange = ["", ""];
      } else {
        timeRange = timeRange.map((item) => {
          return item.replace(" ", "T");
        });
      }
      return {
        indexName: this.searchType,
        fuzzyQuery: this.searchText,
        startTime: timeRange[0],
        endTime: timeRange[1],
        limit: this.currentPageSize,
        offset: this.currentPage - 1,
      };
    },
    listObtain() {
      // 获取日志列表
      const portParams = this.queryParamsJoint();
      logObtain(portParams).then((res) => {
        const result = res.data;
        this.logTotal = result.total;
        const resultData = result.list;
        this.logAmount = resultData.length;
        resultData.forEach((item) => {
          item.flag = true;
        });
        this.logLists = resultData;
      });
    },
    handleSearch() {
      // 搜索查询
      this.currentPage = 1;
      this.listObtain();
    },
    handleDownload() {
      // 日志下载
      const portParams = this.queryParamsJoint();
      let urlJoin = "";
      for (const k in portParams) {
        if (["limit", "offset"].includes(k)) continue;
        urlJoin = urlJoin + k + "=" + portParams[k] + "&";
      }
      const elementLink = document.createElement("a");
      // elementLink.href = "http://192.168.3.158:8088/dblogs/download?" + urlJoin;
      elementLink.href = "/dblogs/download?" + urlJoin;
      elementLink.click();
    },
    viewLogDetail(content) {
      // 日志详情查看
      this.detailTitle =
        content.createTime.split(".")[0].replace("T", " ") || "日志详情";
      contextObtain({
        id: content.id,
        limit: "",
        indexName: this.searchType,
      }).then((res) => {
        const contentJoint = res.data.reduce((text, item) => {
          return text + item.message + "<br>";
        }, "");
        this.detailContent = contentJoint;
        this.detailVisible = true;
      });
    },
    textColorChange(text) {
      // palls关键字样式处理
      return text.replace(
        /palls/g,
        '<span class="log-content-text">palls</span>'
      );
    }
  },
};
</script>

<style lang='scss' scoped>
@import "./style.scss";
</style>

<style lang="scss">
.log-query {
  .log-content-text {
    color: #e6a23c;
    font-weight: 700;
  }
}
</style>
