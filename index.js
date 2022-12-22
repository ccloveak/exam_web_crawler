import cheerio from "cheerio";
import { fileURLToPath } from "url";
import fs from "fs";
import iconv from "iconv-lite";
import path from "path";

const data = fs.readFileSync("data.html");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const $ = cheerio.load(iconv.decode(data, "utf-8"));
const titleArr = [];
const questionArr = [];
const answerArr = [];

$("div", ".detailed-result-panel--detailed-result-panel--lQcl7").each(
  (parentIndex, parentElement) => {
    const title = $(parentElement).children().children("span:first").text();
    title !== "" && titleArr.push(title);
  }
);

$("div", ".detailed-result-panel--detailed-result-panel--lQcl7").each(
  (parentIndex, parentElement) => {
    const question = $(parentElement)
      .children()
      .children("div.mc-quiz-question--question-prompt--2_dlz.rt-scaffolding")
      .text();
    question !== "" && questionArr.push(question);
  }
);

$(
  "div",
  ".detailed-result-panel--panel-row--2aE8z.detailed-result-panel--question-container--7NyiS"
).each((parentIndex, parentElement) => {
  $(parentElement)
    .children()
    .each((childIndex, childElement) => {
      if ($(childElement).text().match("（正确）")) {
        $(childElement).text().trim().replace("（正确）", "") !== "" &&
          answerArr.push(
            $(childElement).text().trim().replace("（正确）", "").trim()
          );
      }
    });
});

const resultArr = [];

for (let i = 0; i < 99; i++) {
  resultArr[i] = {
    title: titleArr[i + 1].replace("：", "").trim(),
    question: questionArr[i].trim(),
    answer: answerArr[i],
  };
}

const file = path.join(__dirname, "result.json");

fs.writeFile(file, JSON.stringify(resultArr), (err) => {
  if (err != null) {
    console.log(err);
    return;
  }
  console.log("write successful");
});
