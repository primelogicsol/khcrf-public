import { transmitToCraftlore } from './src/controllers/evaluationController.ts';

const req = {
  params: { id: 'cmu8cyzdd0000ysbo7h3na89h' }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log("Transmission Response:", this.statusCode || 200, data);
  }
};

transmitToCraftlore(req as any, res as any).catch(console.error).finally(() => process.exit(0));
