<template>
  <div class="panel">
    <el-card v-loading="loading">
      <div slot="header">
        <el-form :inline="true" :model="formData" ref="formData">
          <el-form-item label="查询方式:">
            <el-select v-model="queryType" @change="queryTypeChange">
              <el-option
                v-for="item in queryOptionsMap"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="item in formItems"
            :key="item"
            :label="formLabelMap[item]"
            :prop="item"
            :rules="inputValidate"
          >
            <el-input v-model="formData[item]" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="result-display">
        <span v-if="resultFailure" class="result-failure"
          >查询失败：{{ resultMsg }}</span
        >
        <div v-else>
          <div v-for="(item, index) in resultData" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import requestApi from "../request";
export default {
  name: "LogHandle",
  data() {
    return {
      queryType: "taskId",
      formData: {
        groupId: "",
        taskId: "",
        sessionId: "",
        fuzzyQuery: "",
      },
      queryOptionsMap: [
        { name: "TaskId查询", value: "taskId" },
        { name: "Task详情查询", value: "taskDetail" },
        { name: "Task状态查询", value: "taskStatus" },
        { name: "Job模糊查询", value: "jobFuzzy" },
      ],
      formItems: ["groupId", "sessionId"],
      formLabelMap: {
        groupId: "GroupId:",
        taskId: "TaskId:",
        sessionId: "SessionId:",
        fuzzyQuery: "模糊查询:",
      },
      queryFormMap: {
        taskId: ["groupId", "sessionId"],
        taskDetail: ["taskId"],
        taskStatus: ["taskId"],
        jobFuzzy: ["fuzzyQuery"],
      },
      inputValidate: { required: true, trigger: "blur", message: "请输入内容" },
      loading: false,
      resultFailure: false,
      resultMsg: "",
      resultData: [],
    };
  },
  methods: {
    queryTypeChange(type) {
      this.formItems = this.queryFormMap[type];
    },
    querySubmit() {
      this.$refs.formData.validate((valid) => {
        if (!valid) return;
        const type = this.queryType;
        const param = {};
        this.queryFormMap[type].forEach((item) => {
          param[item] = this.formData[item];
        });
        this.resultFailure = false;
        this.resultMsg = "";
        this.loading = true;
        requestApi[type](param).then(
          (res) => {
            this.loading = false;
            const result = res.data;
            this.resultFailure = result.code !== 0;
            this.resultMsg = result.msg;
            if (this.resultFailure) return;
            this.resultData = result.data;
          },
          (err) => {
            console.log(err);
            this.resultFailure = true
            this.resultMsg = err
            this.loading = false;
          }
        );
      });
    },
  },
};
</script>

<style scoped lang="scss">
.panel {
  padding: 10px;
  .el-form-item {
    margin-bottom: 10px;
    .el-button {
      margin-left: 25px;
    }
  }
  .result-display {
    .result-failure {
      color: #f56c6c;
    }
  }
}
</style>
<style lang="scss">
.panel {
  .el-card {
    .el-card__header {
      background-color: rgb(245, 243, 243);
    }
    .el-card__body {
      height: calc(100vh - 170px);
      overflow: auto;
    }
  }
}
</style>