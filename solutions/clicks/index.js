const isSameHour = require("date-fns/isSameHour");
const parse = require("date-fns/parse");
const data = require("./data/index.json");

const ips = {};
const result = [];

const getGreatestAmountInSameHour = (clickOne, clickTwo) => {
  const { timestamp: timestampOne, amount: amountOne } = clickOne;
  const { timestamp: timestampTwo, amount: amountTwo } = clickTwo;

  const clickDateOne = parse(timestampOne, "d/M/y kk:mm:ss", new Date());
  const clickDateTwo = parse(timestampTwo, "d/M/y kk:mm:ss", new Date());

  if (isSameHour(clickDateOne, clickDateTwo)) {
    if (amountOne > amountTwo) {
      return clickOne;
    }

    return clickTwo;
  }

  return null;
};

data.forEach((click) => {
  const { ip } = click;

  if (!ips[ip]) {
    ips[ip] = [];
  }

  ips[ip].push(click);
});

Object.keys(ips).forEach((key) => {
  const clicks = ips[key];
  const { length } = clicks;

  if (length > 10) {
    delete ips[key];
  } else {
    clicks.forEach((click, index) => {
      if (length > 1) {
        const lengthArray = [...Array(length).keys()];
        const lastIndex = length - 1;
        let theGreatest = null;

        lengthArray.forEach((i) => {
          if (index !== i) {
            const theGreatestFromTwo = getGreatestAmountInSameHour(
              click,
              clicks[i]
            );

            if (theGreatestFromTwo) {
              theGreatest = theGreatestFromTwo;
            } else if (lastIndex === i) {
              if (theGreatest) {
                if (
                  !result.find((resultClick) => resultClick === theGreatest)
                ) {
                  result.push(theGreatest);
                }
              } else if (!result.find((resultClick) => resultClick === click)) {
                result.push(click);
              }
            }
          }
        });
      } else {
        result.push(click);
      }
    });
  }
});

console.log(result);
