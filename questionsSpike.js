import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const rnd = Math.floor(Math.random() * 10);
    const response = http.get(`http://localhost:3000/qa/questions/5`);
    console.log('Response time was ' + String(response.timings.duration) + ' ms');
    check(response, {
        "is status 200": (r) => r.status === 200,
    });
};

export let options = {
  ext: {
    loadimpact: {
      name: 'questionsSpike.js',
      projectID: '3536493'
    },
  },
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '20s',
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};