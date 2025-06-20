import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, '../../proto/notes.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto: any = grpc.loadPackageDefinition(packageDef).notes;

const server = new grpc.Server();

server.addService(proto.TextProcessor.service, {
  summarize: (call: any, callback: any) => {
  const input = call.request.content;

  // Basic simulation: "User A transferred $1200 to User B"
  let summary = input;

  const match = input.match(/(\w+) transferred \$(\d+(?:\.\d+)?) to (\w+)/i);
  if (match) {
    const [, from, amount, to] = match;
    summary = `User ${from} transferred $${amount} to User ${to}`;
  }

  callback(null, { result: summary });
},
  diff: (call: any, callback: any) => {
  const { old_content, new_content } = call.request;

  try {
    const oldBalances = JSON.parse(old_content);
    const newBalances = JSON.parse(new_content);

    let diffs = [];
    for (const user in newBalances) {
      const oldBal = oldBalances[user] || 0;
      const newBal = newBalances[user];
      if (oldBal !== newBal) {
        diffs.push(`User ${user} balance changed from $${oldBal} to $${newBal}`);
      }
    }

    const result = diffs.join("\n") || "No changes detected.";
    callback(null, { result });
  } catch (e) {
    callback(null, { result: "Error parsing account statements." });
  }
},
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running at http://localhost:50051');
  server.start();
});