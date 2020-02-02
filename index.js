var fs = require("fs");
let clicks = require("./clicks.json");
function findCount(ip, list) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] && list[i].ip === ip) count++;
  }

  return count;
}

function generateHashKey(concatStr) {
  var hash = 0;
  if (concatStr.length === 0) {
    return hash;
  }
  for (var i = 0; i < concatStr.length; i++) {
    var charAtI = concatStr.charCodeAt(concatStr[i]);
    hash = (hash << 5) - hash + charAtI;
    hash = hash & hash;
  }
  return hash;
}

//Condition -3.. filter clicks > 10
clicks = clicks.filter(click => findCount(click.ip, clicks) <= 10);

let eventOfHour = {};

clicks.forEach(click => {
  const hours = new Date(click.timestamp).getHours();
  if (hours in eventOfHour) {
    const index = eventOfHour[hours].findIndex(item => item.ip === click.ip);
    if (index > -1) {
      const element = eventOfHour[hours].find(item => item.ip === click.ip);
      if (element.amount < click.amount) {
        eventOfHour[hours][index] = click;
      }
    } else {
      eventOfHour[hours].push(click);
    }
  } else {
    eventOfHour[hours] = [click];
  }
});
var resultSet = {};

for (let key in eventOfHour) {
  eventOfHour[key].forEach(click => {
    let hash = generateHashKey(click.ip + click.timestamp + click.amount);
    resultSet[hash] = click;
  });
}

let json = JSON.stringify(resultSet, 4);
fs.writeFile("resultset.json", json, "utf8", () => {});
