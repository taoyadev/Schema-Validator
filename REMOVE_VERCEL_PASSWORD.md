# 如何移除 Vercel 密码保护

## 方法 1: 通过 Vercel Dashboard (推荐)

### 步骤 1: 登录 Vercel Dashboard
访问: https://vercel.com/dashboard

### 步骤 2: 进入项目设置
1. 找到 `schema-validator` 项目
2. 点击项目名称进入项目页面
3. 点击顶部导航栏的 **Settings** (设置)

### 步骤 3: 移除部署保护
1. 在左侧菜单中找到 **Deployment Protection** (部署保护)
2. 如果看到 **Password Protection** 已启用:
   - 点击 **Edit** 或 **Remove** 按钮
   - 确认移除密码保护
3. 如果看到 **Vercel Authentication** (Vercel 身份验证):
   - 将其设置为 **Off** 或 **Public**

### 步骤 4: 保存更改
- 点击 **Save** 保存更改
- 等待几秒钟让更改生效

---

## 方法 2: 使用 Vercel CLI 命令 (快捷方式)

在终端运行以下命令直接打开项目设置页面：

```bash
# 打开项目设置页面
vercel project open schema-validator

# 或者直接访问
open https://vercel.com/discoverprofiles-projects/schema-validator/settings
```

---

## 验证密码保护已移除

### 测试方法 1: 使用无痕浏览器窗口
```bash
# 使用 curl 测试（应该返回 200，而不是 401）
curl -I https://www.schemavalidator.com

# 期望输出包含:
# HTTP/2 200
```

### 测试方法 2: 浏览器测试
1. 打开无痕/隐私浏览窗口
2. 访问: https://www.schemavalidator.com
3. 如果直接显示网站内容（不需要输入密码），则保护已移除

---

## 当前项目信息

- **项目名**: schema-validator
- **团队**: discoverprofiles-projects
- **生产域名**: https://www.schemavalidator.com
- **Vercel Dashboard**: https://vercel.com/discoverprofiles-projects/schema-validator

---

## 常见问题

### Q: 移除密码保护后多久生效？
A: 通常立即生效，最多等待 1-2 分钟。

### Q: 如果只想部分页面公开怎么办？
A: Vercel 的密码保护是项目级别的，无法针对单个页面。如需精细控制，需要在应用代码中实现身份验证。

### Q: 移除密码保护是否影响环境变量安全性？
A: 不影响。环境变量仍然是安全的，只有服务器端能访问。

---

## 相关文档

- [Vercel Deployment Protection 文档](https://vercel.com/docs/security/deployment-protection)
- [Vercel 项目设置](https://vercel.com/docs/projects/overview#project-settings)
