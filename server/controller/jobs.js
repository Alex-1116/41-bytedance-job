const fetch = require("./request");
const nodeFetch = require("node-fetch");

const jobCategoryData = require("../data").jobCategories;

function getToken() {
  return new Promise((resolve, reject) => {
    nodeFetch("https://job.bytedance.com/api/v1/csrf/token", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN",
        "cache-control": "no-cache",
        "content-type": "application/json",
        env: "undefined",
        "portal-channel": "office",
        "portal-platform": "pc",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "website-path": "society",
        "x-csrf-token": "undefined",
        cookie:
          "device-id=6827732091456734728; channel=office; platform=pc; s_v_web_id=kajdwbmc_ky2u7BTY_vJ3s_4cMa_ArgO_kBEC9SWUgOnI; SLARDAR_WEB_ID=f21ae273-b302-4fc7-8d9e-05bec4b51f96",
      },
      referrer:
        "https://job.bytedance.com/society/position?keywords=&category=6704215913488451847&location=&type=&job_hot_flag=&current=1&limit=10",
      referrerPolicy: "no-referrer-when-downgrade",
      body: '{"portal_entrance":1}',
      method: "POST",
      mode: "cors",
    })
      .then((res) => {
        const cookie = res.headers.get("set-cookie");

        const cookies = cookie.split(",").map((item) => item.split(";")[0]);

        // console.log(cookies);
        // debugger;
        resolve(cookies);
      })
      .catch(reject);
  });
}

module.exports = {
  queryOne(req,res) {
    const id=req.params.id
    fetch(
      `https://job.bytedance.com/api/v1/job/posts/${id}?portal_type=2&_signature=yG3fiAAAAAA.j3g6Dz7uK8ht35AAJar&portal_type=2`,
      {
        credentials: "include",
        headers: {},
        referrer:
          "https://job.bytedance.com/society/position/detail",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
      }
    ).then(data=>{
      res.json(data)
    }).catch(res.json)
  },
  async queryList(req, res) {
    // res.send('Hello Express')

    // const {   } = req.query;
    const {
      limit = 10,
      offset = 0,
      keyword = "",
      job_category_id_list,
      location_code_list,
    } = req.body;
    const query = {
      keyword,
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      job_category_id_list,
      location_code_list,
    };
    const defaultParams = {
      location_code_list: [],
      recruitment_id_list: [],
      portal_type: 2,
      portal_entrance: 1,
    };
    const body = Object.assign({}, defaultParams, query);

    try {
      var token = await getToken();
    } catch (error) {
      // return res.json(error);
    }

    fetch(
      "https://job.bytedance.com/api/v1/search/job/posts?keyword=&limit=10&offset=0&recruitment_id_list=&portal_type=2&portal_entrance=1&_signature=crKjawAAAACGjNMGOexSmXKyo3AACx8",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN",
          "cache-control": "no-cache",
          "content-type": "application/json",
          env: "undefined",
          "portal-channel": "office",
          "portal-platform": "pc",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "website-path": "society",
          "x-csrf-token": token[0].split("=")[1].slice(0, -3) + "=",
          cookie: token.join(";"),
        },
        referrer:
          "https://job.bytedance.com/society/position?keywords=&category=&location=&type=&job_hot_flag=&current=1&limit=10",
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
      }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {});
  },
  queryFilters(req, res) {
    fetch(
      "https://job.bytedance.com/api/v1/config/job/filters/2?_signature=zuaUswAAAAA62OTeT2XUYc7mlKAAJBd",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN",
          "cache-control": "no-cache",
          env: "undefined",
          "portal-channel": "office",
          "portal-platform": "pc",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "website-path": "society",
          "x-csrf-token": "kr_-_jAg_pMovAUAf83zxiUtxk27hVtBaTgAsl-xOOw=",
          cookie:
            "atsx-portal-session-v1=REDACTED; TS01f8c345=REDACTED; SLARDAR_WEB_ID=REDACTED; UM_distinctid=REDACTED; _ga=REDACTED; tahiti-session-2=REDACTED; channel=office; platform=pc; s_v_web_id=REDACTED; TS01ab245c=REDACTED; _gid=REDACTED; tea_uid=REDACTED; atsx-portal-user-source-v1=wechat; device-id=REDACTED; atsx-csrf-token=REDACTED; TS0170d300=REDACTED",
        },
        referrer: "https://job.bytedance.com/society/position",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
      }
    ).then((data) => {
      res.json(data);
    });
  },
  queryJobCategoryList(req, res) {
    res.json(jobCategoryData);
  },
};
