import test from "node:test";
import assert from "node:assert/strict";
import { learningRewards, readLearningProgress, recipeBrief, promptRecipes } from "../lib/learning-journey";
import { buildPracticePrompt } from "../data/cohort-practice";

test("browser progress rejects corrupt data, unknown modules and duplicate XP", () => {
  assert.deepEqual(readLearningProgress('{broken', ['s1', 's2']), []);
  assert.deepEqual(readLearningProgress('{"s1":true}', ['s1']), []);
  const done = readLearningProgress('["s1","s1","fake",42,"s2"]', ['s1', 's2', 's3']);
  assert.deepEqual(done, ['s1', 's2']);
  assert.equal(learningRewards(done.length, 3).xp, 200);
});

test("badges and levels reflect actual completed module thresholds", () => {
  assert.ok(learningRewards(0, 8).badges.every(b => !b.earned));
  assert.equal(learningRewards(1, 8).badges.filter(b => b.earned).length, 1);
  assert.equal(learningRewards(3, 8).level, 'Builder');
  assert.equal(learningRewards(8, 8).level, 'Trailblazer');
  assert.equal(learningRewards(100, 8).xp, 800);
  assert.equal(learningRewards(0, 0).badges.at(-1)?.earned, false);
});

test("every generator preserves learner input and provides usable output and review instructions", () => {
  for (const recipe of Object.keys(promptRecipes) as (keyof typeof promptRecipes)[]) {
    const prompt = buildPracticePrompt(recipeBrief(recipe, 'Draft a fictional plan', 'Volunteer coordinator', 'Room owner and date are unknown.'));
    assert.ok(prompt.includes('Draft a fictional plan'));
    assert.ok(prompt.includes('Volunteer coordinator'));
    assert.ok(prompt.includes('Room owner and date are unknown.'));
    assert.ok(prompt.includes(promptRecipes[recipe].output));
    assert.ok(prompt.includes('Do not invent'));
    assert.ok(prompt.includes('human review'));
  }
});
