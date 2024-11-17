const cookie =
  "buvid3=D7F13205-997B-82D7-3204-C60F33C3982056658infoc; SESSDATA=67e0f3c3%2C1747232055%2C33722%2Ab1CjDcMsTk6pKKOElUN2z4f1V0T0ARi6K0fubeUUgi-8fwbRVXlpuO_-OOI08E305Nam0SVmxEMTVsRkRBN2toU0oxWEc0YkcxTTQ0TE90LWUtdC04aXMxMlRVNUJFakxWbm12bUhKenQ1bHpOY2NoWXI1X2p5UUUzRVNSODljOHhUejQwa1lPYUtnIIEC; bili_jct=f88d9df5744152b4e887448913ffbf3e; DedeUserID=8929945; DedeUserID__ckMd5=55d86a3ed9e4be7c; sid=6u2oqmnf";

let cookieMap = cookie.split("; ").reduce((acc, cur) => {
  const [key, value] = cur.split("=");
  acc[key.trim()] = value;
  return acc;
}, {});

console.log(cookieMap);

// set cookie

