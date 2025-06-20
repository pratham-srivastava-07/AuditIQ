import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, '../../proto/notes.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const proto: any = grpc.loadPackageDefinition(packageDef).notes;

export const client = new proto.TextProcessor('localhost:50051', grpc.credentials.createInsecure());
