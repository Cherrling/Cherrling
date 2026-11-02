
# Claude Code 与 Codex 对比


## 摘要

同一 DeepSeek v4.1 flasg Max 模型接入 Claude Code 与 Codex 。

实验使用相同的 prompt，让两者分别修改一个中等规模 Go 项目中的一个已知问题。

Codex 使用两轮完成，累计执行时间 45 分 13 秒，含缓存总 Token 为 119,401,187。Claude Code 使用四轮，累计 69 分 50 秒，含缓存总 Token 为 256,457,678。

主要差异来自工具调用次数和返修轮次。Claude 与 Codex 每个工具调用对应的缓存读取分别约为 29.5 万和 29.9 万 Token。

本次任务中，Codex 在首轮进入实现速度、返修效率、总成本、最终代码规模和原生透传性能方面占优；Claude Code 在操作可审计性、显式任务状态、测试规模和原生凭证指纹安全性方面更强。


## 1. 实验设置

| 维度 | Claude Code | Codex |
|---|---|---|
| 客户端 | 2.1.308 | 0.166.0 |
| 协议 | Anthropic Messages 风格 | Responses 风格 |
| 模型配置 | `max`，adaptive thinking | `max` |
| 后续反馈 | 3 轮 | 1 轮 |

Token 统计规则：

- Claude 按 `requestRef` 去重，input 与 cache read 分开。
- Codex 使用轮末累计 usage 减去轮前基线。
- Responses input 扣除 cached input 后作为非缓存输入。
- Codex Guardian 单列统计，并计入最终总成本。

## 2. 核心数据

| 指标 | Claude Code | Codex |
|---|---:|---:|
| 轮次 | 4 | 2 |
| 总执行时间 | 69:50 | 45:13 |
| 模型请求 | 722 | 307 |
| 工具调用 | 865 | 397 |
| 非缓存输入 | 744,228 | 632,725 |
| 缓存读取 | 255,107,840 | 118,535,040 |
| 输出 Token | 605,610 | 233,422 |
| 含缓存总 Token | 256,457,678 | 119,401,187 |

扣除全部缓存后，Claude 的“非缓存输入 + 输出”仍比 Codex 多约 56%。

Claude 总缓存读取更高，但归一化到单次工具调用后，两边成本接近：

| 每工具调用平均 | Claude | Codex |
|---|---:|---:|
| 非缓存输入 | 860 | 1,518 |
| 缓存读取 | 294,922 | 298,527 |
| 输出 | 700 | 588 |

原始工具输出总量约为 1.00 MiB 和 1.03 MiB，差异不大。Claude 将相近规模的工作拆成了约两倍的模型—工具循环。

## 3. 时间轨迹

| 首轮里程碑 | Claude | Codex |
|---|---:|---:|
| 第一次编辑 | 18.7 分钟 | 2.5 分钟 |
| 第一次测试 | 26.4 分钟 | 5.3 分钟 |
| 首轮结束 | 40.7 分钟 | 28.2 分钟 |

Claude 首次编辑前执行了 58 次模型请求和 87 次工具调用，产生 275,618 输出 Token。Codex 首次 patch 前执行 11 次模型请求和 46 次 shell 检查。

Claude system prompt 要求使用 `TaskCreate` 管理计划，但该工具属于 deferred tools。Claude 在任务开始约 17.9 分钟后才加载 `TaskCreate/TaskUpdate`，创建四个任务，并在约 48 秒后开始第一次修改。

## 4. Prompt 与工具设计

### 4.1 Claude Code

初始上下文包括：

- 27,392 字符 system prompt
- 13 个立即加载工具，约 47,968 字符 schema
- 23 个 deferred tools
- `CLAUDE.md`、环境、Git 状态和 Token 提醒

核心约束是优先使用 `Read/Edit/Write`、精确局部编辑、显式任务规划、细粒度权限和简短进度更新。

该设计提高操作可读性和可审计性，但工具粒度较细。

实际工具分布：

```text
Bash       485
Edit       231
Read       103
Task*       27
Write       18
```

Claude 共读取 21 个唯一文件，**但发生 82 次重复读取。`handler/relay.go` 被读取 59 次；`Edit` 因字符串不匹配或无变化失败 10 次。**

### 4.2 Codex

Codex 使用分层上下文：

- 17,730 字符 base instructions
- 约 18,000 字符 developer instructions
- 12,174 字符 AGENTS/CLAUDE 项目说明
- 首轮 33 个 skill 条目，第二轮增至 49 个

核心策略是持续执行、先提供 commentary、搜索优先 `rg`、尽量并行、文件修改统一使用 `apply_patch`。

实际工具分布：

```text
exec_command  289
apply_patch    91
write_stdin    16
get_goal        1
```

一个 shell 调用可组合搜索、过滤、多文件查看；`write_stdin` 可继续长测试 session；`apply_patch` 可一次处理多个文件和 hunk。

Codex 的工具输出量接近 Claude，但模型—工具往返不到其一半。

### 4.3 设计差异

| 设计点 | Claude Code | Codex |
|---|---|---|
| 文件读取 | 专用 Read | shell + `rg/sed` |
| 文件编辑 | 精确 Edit/Write | freeform `apply_patch` |
| 计划 | TaskCreate/TaskUpdate | reasoning + commentary |
| 长进程 | background task | persistent shell + `write_stdin` |
| 风险控制 | permission mode + classifier | sandbox + Guardian |
| 子 agent | Agent/Workflow，Workflow 需 opt-in | 默认 explicitRequestOnly |

## 5. 行为影响

工具调用数直接放大缓存读取。每次工具结果返回后，模型都需要重新推理并读取上下文：

```text
总缓存读取 ≈ 单次上下文 × 模型—工具往返次数
```

Claude 的细粒度工具提高可审查性，同时增加循环次数；Codex 的批处理提高吞吐，但单次 action 更重，对 sandbox 和事后复核依赖更高。

Claude 的显式 Task 状态适合长流程，但本次核心 Task 工具加载较晚，并持续产生任务提醒。Codex 的计划更轻，没有持久待办状态，但进入实现更快。

工具结果结构也会影响恢复效率。Codex shell 输出始终包含 wall time 和退出码；Claude Bash 主要依赖 stdout/stderr 和 `is_error`，本次存在实际报错写入 stdout 但 `is_error=false` 的情况。

## 6. 首轮质量与返修

Claude 首轮后的返修覆盖原生字段被提前解析、历史授权、凭证绑定、状态槽泄漏、TPM 退款、候选遍历和指纹覆盖等问题。

Codex 首轮后只修复两项：原生路径提前构建 Chat，以及原生 GET 未纳入并发预算。

两边最终均通过共同回归。Claude 后三轮分别耗时 11、15、3 分钟，总成本较高主要来自首轮遗漏导致的三轮额外反馈。

## 7. 最终交付

| 指标 | Claude final | Codex final |
|---|---:|---:|
| 文件数 | 42 | 28 |
| 总新增 | 2,973 | 2,028 |
| 生产 Go 新增 | 1,287 | 940 |
| 测试新增 | 1,586 | 971 |
| 数据库迁移 | 2 | 1 |
| 原生 GET | 明确不支持 | 代理回原上游 |

两边均实现自动路由、`store=true` 原生透传、强制 Chat 开关、历史绑定、跨实例同步、过期处理和在线迁移。

Codex 代码和迁移更少，但多实现原生 GET 和读取并发预算。

1 MiB 原生分类基准：

```text
Claude    1.76 ms/op，1.06 MiB/op
Codex     1.37 ms/op，7.4 KiB/op
```

Claude 使用带随机盐的 credential HMAC，Codex 使用普通 SHA-256 fingerprint。Claude 对数据库泄漏场景更稳健，但部署密钥轮换会使旧绑定失效。

