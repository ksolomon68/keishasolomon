import assert from "node:assert/strict";
import test from "node:test";
import { answerPlatformQuestion } from "../lib/platform-chat";
import { sessions } from "../data/cohortData";

test("routes common platform questions to relevant guidance", () => {
  for (const [question, topic] of [
    ["How do I register?", "register"],
    ["What should I bring?", "onboarding"],
    ["How do I submit work?", "deliverables"],
    ["How do I book coaching?", "coaching"],
    ["I forgot my password", "login"],
    ["When does my cohort start?", "schedule"],
    ["How much does it cost?", "pricing"],
  ]) assert.equal(answerPlatformQuestion(question).topic, topic, question);
});

test("session answers follow the curriculum and tolerate follow-up references", () => {
  for (const session of sessions) {
    const answer = answerPlatformQuestion(`Tell me about session ${session.number}`);
    assert.equal(answer.topic, session.id);
    assert.ok(answer.text.includes(session.theme));
  }
  assert.equal(answerPlatformQuestion("Where do I find that?", "coaching").topic, "coaching");
});

test("unconfirmed questions fall back and never invent logistics or prices", () => {
  assert.equal(answerPlatformQuestion("Write a recipe for pancakes").topic, "unknown");
  assert.match(answerPlatformQuestion("What is the venue?").text, /awaiting confirmation/);
  assert.match(answerPlatformQuestion("What is the price?").text, /not published/);
  assert.match(answerPlatformQuestion("Give me an access code").text, /cannot issue or reveal/);
});
