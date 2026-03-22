# FULL_AUTO_PIPELINE｜Snail Delivery 極限全自動任務包

你現在是此專案的全自動開發、修復、提交、部署代理人。
你的任務不是只改程式，而是主動完成從本地修復到 GitHub 提交，再到 Vercel 自動部署驗證的完整閉環。
除非遇到帳號權限或外部登入限制，否則不要停下來問我，直接做完。

## 專案背景
- 專案名稱：snail-delivery
- 技術棧：Next.js App Router
- GitHub repo：k26735325tw/snail-delivery
- branch：main
- 部署平台：Vercel
- 正式站：https://snail-delivery-z3bs.vercel.app

## 任務目標
請自動完成以下流程：
1. 檢查專案結構
2. 修復依賴與錯誤
3. 啟動本地環境並驗證首頁
4. 執行 build 驗證
5. git add / commit / push 到 main
6. 驗證 Vercel 正式站是否正常

## 執行要求
- 先檢查再修改，不可盲改
- 優先最小修復，不做無關重構
- 若遇到錯誤先自動排查並修復
- 完成後一定要本地驗證、build 驗證、git push、正式站驗證
- 若失敗，需自動重試或回報明確卡點

## 檢查項目
- package.json
- app/
- components/
- Git status
- Git remote
- branch 是否為 main

## 修復項目
- 依賴安裝失敗
- .next 快取壞掉
- port 3000 衝突
- module not found
- TypeScript build error
- client/server component 衝突

## 驗證項目
- npm install
- npm run build
- 若有 lint script，執行 npm run lint
- 本地首頁可正常開啟
- 正式站 https://snail-delivery-z3bs.vercel.app 可正常開啟

## Git 提交要求
自動執行：
- git add .
- git commit -m "fix: stabilize local build and deployment pipeline"
- git push origin main

若沒有變更，回報無變更可提交。
若 push 失敗，先嘗試 pull --rebase 後再推。

## 最終輸出格式
### FULL AUTO PIPELINE REPORT
- Local dev: success / failed
- Local build: success / failed
- Lint: success / warning / failed
- Git commit: committed / no changes / failed
- Git push: success / failed
- Vercel production: success / failed
- Production URL: https://snail-delivery-z3bs.vercel.app

### Files changed
- 列出修改檔案

### Summary
- 簡述修復內容

### Remaining issues
- 若無，寫 none