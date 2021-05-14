import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '2m', target: 600 }, // Around the breaking point
    { duration: '5m', target: 600 },
    { duration: '2m', target: 800 }, // Past the breaking point
    { duration: '5m', target: 800 },
    { duration: '2m', target: 1000 },
    { duration: '5m', target: 1000 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const baseUrl = 'http://ec2-3-22-14-2.us-east-2.compute.amazonaws.com';
  let responses = http.batch([
    [
      'GET',
      `${baseUrl}/qa/questions/5`,
    ],
    [
      'GET',
      `${baseUrl}/qa/answers/34`,
    ],
    [
      'GET',
      `${baseUrl}/qa/questions/5`,
    ],
    [
      'GET',
      `${baseUrl}/qa/answers/35`,
    ],
    [
      'GET',
      `${baseUrl}/qa/questions/1`,
    ],
  ]);
  check(responses[0], {
    'questions5 status was 200': (res) => res.status === 200,
  });
  check(responses[1], {
    'answer34 status was 200': (res) => res.status === 200,
  });
  check(responses[2], {
    'questions5 status was 200': (res) => res.status === 200,
  });
  check(responses[3], {
    'answer35 status was 200': (res) => res.status === 200,
  });
  check(responses[4], {
    'questions1 status was 200': (res) => res.status === 200,
  });
  sleep(1);
};
