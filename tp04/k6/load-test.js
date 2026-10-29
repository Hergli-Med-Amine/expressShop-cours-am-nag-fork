import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 10,
  duration: '20s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{endpoint:liste}': ['p(95)<200'],
    'http_req_duration{endpoint:detail}': ['p(95)<200'],
  },
};

export default function () {
  const liste = http.get(`${BASE_URL}/products`, { tags: { endpoint: 'liste' } });
  check(liste, { 'liste : statut 200': (r) => r.status === 200 });

  const detail = http.get(`${BASE_URL}/products/1`, { tags: { endpoint: 'detail' } });
  check(detail, { 'detail : statut 200': (r) => r.status === 200 });

  sleep(1);
}
