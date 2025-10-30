<template>
  <div ref="terminalRef" class="terminal"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const terminalRef = ref(null);
let term;

onMounted(() => {
  // 1️⃣ 创建终端实例
  term = new Terminal({
    cols: 80,
    rows: 24,
    cursorBlink: true,
    theme: {
      background: "#000000", // 黑色背景
      foreground: "#00FF00", // 绿色文字
    },
  });

  // 2️⃣ 挂载到页面
  term.open(terminalRef.value);

  // 3️⃣ 打印欢迎文字
  term.writeln("\nWelcome to IM Database System 🌐");
  //term.writeln("Type something and press Enter ↓");

  // 4️⃣ 监听用户输入
  let command = "";
  term.onData((data) => {
    if (data === "\r") {
      // 按下 Enter
      term.writeln("\nYou entered: " + command);
      command = "";
      term.prompt();
    } else if (data === "\u007F") {
      // 处理退格键
      if (command.length > 0) {
        command = command.slice(0, -1);
        term.write("\b \b");
      }
    } else {
      // 其他字符
      command += data;
      term.write(data);
    }
  });

  term.prompt = () => term.write("\r\n> ");
  term.prompt();
});

onBeforeUnmount(() => {
  term.dispose();
});
</script>

<style>
.terminal {
  width: 100%;
  height: 500px;
  background: black;
  border-radius: 8px;
  overflow: hidden;
}
</style>
