# 上推 Git 说明

## 目录关系

- 实际编辑目录：`D:\zhizao\zhizao\前端页面`
- 正确上推目录：`D:\zhizao\zhizao\zhizao-main`
- 正确分支：`main`
- 不要把前端页面推到 `D:\zhizao\zhizao\zhizao` 的 `master` 分支，也不要放到 `public/` 目录结构里。

## 单文件同步示例

如果只改了营销页，把编辑目录里的最终文件同步到 `zhizao-main`：

```powershell
$src = "D:\zhizao\zhizao\前端页面\营销页（已核对）\assets\营销页面.html"
$dst = "D:\zhizao\zhizao\zhizao-main\营销页（已核对）\assets\营销页面.html"
Copy-Item -LiteralPath $src -Destination $dst -Force
```

同步后确认两个文件一致：

```powershell
Get-FileHash -LiteralPath $src,$dst -Algorithm SHA256
```

## 正常提交并上推

```powershell
cd D:\zhizao\zhizao\zhizao-main

git status --short --branch
git diff --name-status

git add -- "营销页（已核对）/assets/营销页面.html"
git commit -m "Refine marketing factory section"
git push origin main
```

如果一次更新多个已核对页面，可以按实际变更添加对应目录：

```powershell
git add -- "MES工作台（已核对）" "供应商页面（已核对）" "入口" "后台（已核对）" "用户（已核对）" "营销页（已核对）"
```

提交前一定先看：

```powershell
git diff --cached --name-status
```

## GitHub 连接被重置时

本机直连 GitHub 可能出现：

```text
Recv failure: Connection was reset
Failed to connect to github.com port 443
```

先确认本地代理端口是否可用：

```powershell
Test-NetConnection 127.0.0.1 -Port 7897
```

如果 `TcpTestSucceeded` 是 `True`，用临时代理推送：

```powershell
git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push origin main
```

这个命令只对本次 push 生效，不会写入全局 Git 配置。

## 推送后验证

```powershell
git status --short --branch
git log -1 --oneline --decorate
git ls-remote origin refs/heads/main
```

正常结果应该看到本地 `main` 不再 ahead，远端 `refs/heads/main` 指向刚提交的 commit。

## 如果误提交到 master

先确认误提交只在本地，没有推远端：

```powershell
cd D:\zhizao\zhizao\zhizao
git status --short --branch
git log --oneline -3 --decorate
git diff --name-status origin/master..HEAD
```

如果只是本地 `master` ahead 1，且误改文件是 `public/营销页（已核对）/assets/营销页面.html`，可以这样撤掉本地误提交并只恢复该文件：

```powershell
git reset --soft origin/master
git restore --source=origin/master --staged --worktree -- "public/营销页（已核对）/assets/营销页面.html"
```

撤完再确认：

```powershell
git status --short --branch
git status --short -- "public/营销页（已核对）/assets/营销页面.html"
```
