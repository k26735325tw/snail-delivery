# 本機乾淨啟動

當你在本機驗收時，如果遇到 Next.js dev cache 汙染，先不要急著改程式，先清場再重開。

## 使用時機

- 出現 `Cannot find module './331.js'`
- 出現 `Cannot find module './611.js'`
- 出現 `__webpack_modules__[moduleId] is not a function`
- 本機 `next dev` 行為怪異、重整後仍殘留舊畫面

## 指令

```bash
npm run dev:clean
```

這個指令會：

- 刪除專案根目錄的 `.next`
- 刪除 `node_modules/.cache`
- 重新啟動 `next dev`

## 注意事項

- 先 `Ctrl+C` 停掉舊的 dev server，再執行 `npm run dev:clean`
- 不要手動刪除 `node_modules`
- 不要刪 `.env.local`
- 驗收前建議關掉舊的 localhost 分頁，再重新開頁面
- 修改完成且本機驗收通過後，再考慮 commit 或部署
- 不要在還沒驗收完成前直接部署到 Vercel
