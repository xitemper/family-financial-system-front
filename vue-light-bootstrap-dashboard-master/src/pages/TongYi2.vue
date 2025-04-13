<template>
  <el-container>
    <el-card class="box-card">
      <el-header class="model-selection" style="padding: 0; height: 50px">
        <div style="margin-left: 40vw">
          <span>智能AI 对话</span>
        </div>
        <div style="float: right">
          <el-text class="mx-1" type="success" style="text-align: right"
            >AI回答需要一些时间哦，请提问后耐心等待~</el-text
          >
        </div>
      </el-header>
      <!-- <el-aside style="width: 10vw; float: left">
        <el-button style="margin-top: 4vh" @click="clear"
          >清空对话记录</el-button
        >
      </el-aside> -->
      <!-- 消息容器 -->
      <div class="message-container" ref="messageContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-item"
          :class="{
            'user-message': message.role == 'user',
            'bot-message': message.role == 'assistant',
          }"
        >
          <el-card>
            <template #header>
              <div v-if="message.role == 'user'" class="card-header">
                <el-avatar
                  src="
https://xitemper.oss-cn-guangzhou.aliyuncs.com/%E5%AE%B6%E5%BA%AD%E8%B4%A2%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F.jpg"
                ></el-avatar>
              </div>
              <div v-else class="card-header">
                <el-avatar> AI </el-avatar>
              </div>
            </template>
            <div
              v-if="message.content"
              class="text-message"
              v-html="parseMarkdown(message.content)"
            ></div>
          </el-card>
          <el-button @click="copyText(message.content)">复制文本</el-button>
        </div>
      </div>
      <div id="app">
        <div class="search-bar">
          <textarea
            v-model="userInput"
            placeholder="在此处输入您的问题，回车后请耐心等待结果~"
            class="auto-wrap-input"
            @keydown.enter.exact.prevent="processChat()"
          ></textarea>
        </div>
      </div>
    </el-card>
  </el-container>
</template>

<script>
import axios from "axios";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
export default {
  mounted() {
    this.newSession();
    this.getHistorySessions();
    // 添加页面卸载事件监听
    window.addEventListener("beforeunload", this.handlePageUnload);
  },
  // 新增导航守卫
  beforeRouteLeave(to, from, next) {
    this.endSession();
    next(); // 必须调用next()才能继续导航
  },
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener("beforeunload", this.handlePageUnload);
    this.endSession();
  },
  data() {
    return {
      url: "https://xitemper.oss-cn-guangzhou.aliyuncs.com/loading.jpg",
      userInput: "",
      aiOutput: "我的回答会在这里显示，请提问后稍作等待~",
      curSessionId: "",
      historySessions: [],
      messages: [
        { role: "user", content: "你好，AI!" },
        { role: "assistant", content: "你好，有什么可以帮助你的吗？" },
      ],
      isSearching: false, // 用于标识机器人是否正在回复
      textToCopy: "要复制的文本内容",
    };
  },
  methods: {
    // 处理页面卸载事件

    handlePageUnload(event) {
      // 触发结束会话
      this.endSession();
    },
    parseMarkdown(text) {
      return md.render(text);
    },
    copyText(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$message({
            showClose: true,
            message: "复制成功!",
          });
        })
        .catch((error) => {
          alert("文本复制失败：" + error + "，请手动复制");
        });
    },
    newSession() {
      axios({
        method: "post",
        url: "/api/chat/newSession?userId=" + localStorage.getItem("userId"),
      }).then((resp) => {
        if (resp.data.code == "200") {
          console.log("ai返回信息:" + resp.data.content);
          this.curSessionId = resp.data.content;
        } else {
          console.log(this.resp.data.msg);
        }
      });
      this.getHistorySessions();
    },
    getHistorySessions() {
      axios({
        method: "get",
        url:
          "/api/chat/historySession?userId=" + localStorage.getItem("userId"),
      }).then((resp) => {
        if (resp.data.code == "200") {
          console.log("ai返回信息:" + resp.data.content);
          this.historySessions = resp.data.content;
        } else {
          console.log(this.resp.data.msg);
        }
      });
    },
    // 新增方法：格式化时间显示
    formatTime(isoString) {
      const date = new Date(isoString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    // 新增方法：加载指定会话
    async loadSession(session) {
      try {
        const response = await axios.get(
          `/api/chat/loadSession?sessionId=${session.sessionId}`
        );
        if (response.data.code === "200") {
          this.curSessionId = session.sessionId;
          this.messages = response.data.content;
        } else {
          console.log(this.resp.data.msg);
        }
      } catch (error) {
        console.error("加载会话失败:", error);
      }
    },
    processChat() {
      this.isSearching = true;
      this.messages.push({ role: "user", content: this.userInput });
      // 滚动到最新的消息
      this.$nextTick(() => {
        this.$refs.messageContainer.scrollTop =
          this.$refs.messageContainer.scrollHeight;
      });
      axios({
        method: "post",
        url:
          "/api/chat/processChat?userId=" +
          localStorage.getItem("userId") +
          "&userInput=" +
          this.userInput +
          "&sessionId=" +
          this.curSessionId,
      })
        .then((resp) => {
          if (resp.data.code == "200") {
            console.log("ai返回信息:" + resp.data.content);
            this.messages.push({
              role: "assistant",
              content: resp.data.content,
            });
          } else {
            console.log(this.resp.data.msg);
          }
        })
        .finally(() => {
          this.robotIsReplying = false; // 请求完成，隐藏加载动画
          this.$nextTick(() => {
            this.$refs.messageContainer.scrollTop =
              this.$refs.messageContainer.scrollHeight;
          });
        });
      this.userInput = "";
      this.isSearching = false;
      console.table(this.messages, ["sessionId", "role", "content"]);
    },
    endSession() {
      const data = new URLSearchParams();
      data.append("userId", localStorage.getItem("userId"));
      data.append("sessionId", this.curSessionId);
      navigator.sendBeacon("/api/chat/endSession", data);
      this.curSessionId = "";
    },
  },
};
</script>

<style scoped>
.common-layout {
  height: 100vh; /* 设置布局高度为整个视口高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-message,
.bot-message {
  margin-bottom: 20px;
}

.user-message {
  /*margin-left: 50vw;*/
  /*background-color: #d4edda; !* 设置用户消息的背景色 *!*/
  text-align: right;
}

.bot-message {
  /*margin-right: 50vw;*/
  text-align: left;
}

.chat-input {
  /*position: absolute;*/
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 0px;
  margin-left: 20vw;
  margin-top: 70vh;
  background-color: #ffffff;
}

.chat-input el-input {
  flex: 1;
  margin-right: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
  margin: 0 auto;
  width: 97vw;
  height: 642px; /* 注意这里添加了分号 */
  position: relative; /* 让卡片成为定位上下文 */
  /*height: 500px; !* 假设卡片容器有固定高度 *!*/
  /* overflow: auto; */
}
/* 添加打字效果的样式 */
.typing-indicator {
  display: inline-block;
  overflow: hidden;
  position: relative;
  width: 0;
}
.typing-indicator:before {
  display: block;
  content: "|"; /* 使用竖线作为光标 */
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  right: 0;
  animation: typing 0.5s steps(30, end) infinite; /* 使用 steps 函数来模拟逐字显示 */
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: auto;
  }
}

.error-message {
  color: red;
  font-style: italic;
}
.text-message {
  margin: 10px 0;
}
@keyframes typing {
  0% {
    height: 0;
  }
  50% {
    height: 1em;
  }
  100% {
    height: 0;
  }
}

.message-container {
  overflow-y: auto; /* 设置内容超出时显示滚动条 */
  margin-left: auto;
  float: right;
  overflow-y: auto;
  /*float: right;*/
  width: 73vw;
  /* max-height: 70vh; */
  padding: 10px;
  max-height: calc(100vh - 200px);
}
.user-message {
  text-align: right;
  /*background-color: #d4edda; !* 设置用户消息的背景色 *!*/
}

.bot-message {
  text-align: left;
  /*background-color: #f0f0f0; !* 设置ChatGPT消息的背景色 *!*/
}
.input-container {
  position: absolute; /* 将输入框容器设置为绝对定位 */
  bottom: 0; /* 将输入框容器放置在底部 */
  width: 100%; /* 设置输入框容器的宽度为100% */
  padding: 10px; /* 添加内边距 */
  display: flex; /* 使用 Flex 布局 */
  justify-content: space-between; /* 调整输入框和发送按钮之间的间距 */
}

.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #d4daef;
  border-radius: 24px;
  height: 46px; /* 改为自适应高度 */
  min-height: 44px; /* 最小高度保持原设计 */
  width: 654px;
  box-shadow: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-left: 270px;
  padding: 0 20px; /* 左右内边距 */
  box-sizing: border-box; /* 尺寸包含边框 */
}

.search-bar input[type="text"] {
  flex-grow: 1;
  border: none !important;
  outline: none !important;
  font-size: 16px;
  padding: 0 20px;
  width: calc(100% - 40px);
}

.auto-wrap-input {
  width: 100%;
  border: none !important;
  outline: none !important;
  resize: none; /* 禁止手动调整大小 */
  font-size: 16px;
  background: transparent;
  line-height: 1.5; /* 设置行高 */
  padding: 12px 20px;
  /* 自动换行关键属性 */
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 高度自适应逻辑 */
.auto-wrap-input {
  height: 44px; /* 初始高度 */
  min-height: 44px;
}

.auto-wrap-input {
  transition: height 0.2s ease-out;
}
</style>