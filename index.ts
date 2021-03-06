/// <reference path="node_modules/@types/node/index.d.ts" />

import readline = require("readline");
import process = require("process");
import fs = require("fs");
import * as Parser from "./parser";
import * as Services from "./services";

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

function say(str: string) : void {
    console.log("bot: " + str);
}

r1.on("line", line => {
    const parsedResult = Parser.parse(line);

    if (parsedResult.type === Parser.ActionType.addMember) {
        const o = <Parser.parseMemberOutput>parsedResult.output;
        Services.addMember(o.name).then(say);
    } else if (parsedResult.type === Parser.ActionType.addTransaction) {
        const o = <Parser.parseTransactionOutput>parsedResult.output;
        Services.addTransaction(o.toPerson, o.paidBy, o.amount).then(say);
    } else if (parsedResult.type === Parser.ActionType.listMembers) {
        const o = <Parser.parseMemberOutput>parsedResult.output;
        Services.listMembers().then(say);
    } else if (parsedResult.type === Parser.ActionType.listMemberToMember) {
        const o = <Parser.parseMemberToMemberOutput>parsedResult.output;
        Services.listMemberToMember(o.fromPerson, o.toPerson).then(say);
    } else if (parsedResult.type === Parser.ActionType.exportTransactions) {
        Services.exportTransactions().then(result => {
            fs.writeFileSync("transactions.csv", result, {encoding: "utf-8"});
            say("Data exported to file transactions.csv");
        });
    }
});