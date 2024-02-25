import { expect, test } from 'vitest';

import {
  cloneBlock,
  cloneDocument,
  cloneScene,
  cloneShot,
  createBlock,
  createDocument,
  createScene,
  createShot,
} from './DocumentStore';

test('createDocument() matches cloneDocument()', () => {
  const result = createDocument('test-document');
  const cloned = cloneDocument({}, result);
  expect(result, 'create result has the same properties').toMatchObject(cloned);
  expect(cloned, 'clone result has the same properties').toMatchObject(result);
  for (let key of Object.keys(result)) {
    expect(cloned, 'cloned has same property').toHaveProperty(key);
  }
  for (let key of Object.keys(cloned)) {
    expect(result, 'created has same property').toHaveProperty(key);
  }
});

test('createScene() matches cloneScene()', () => {
  const result = createScene('test-scene');
  const cloned = cloneScene({}, result);
  expect(result, 'create result has the same properties').toMatchObject(cloned);
  expect(cloned, 'clone result has the same properties').toMatchObject(result);
  for (let key of Object.keys(result)) {
    expect(cloned, 'cloned has same property').toHaveProperty(key);
  }
  for (let key of Object.keys(cloned)) {
    expect(result, 'created has same property').toHaveProperty(key);
  }
});

test('createBlock() matches cloneBlock()', () => {
  const result = createBlock('test-block');
  const cloned = cloneBlock({}, result);
  expect(result, 'create result has the same properties').toMatchObject(cloned);
  expect(cloned, 'clone result has the same properties').toMatchObject(result);
  for (let key of Object.keys(result)) {
    expect(cloned, 'cloned has same property').toHaveProperty(key);
  }
  for (let key of Object.keys(cloned)) {
    expect(result, 'created has same property').toHaveProperty(key);
  }
});

test('createShot() matches cloneShot()', () => {
  const result = createShot('test-shot');
  const cloned = cloneShot({}, result);
  expect(result, 'create result has the same properties').toMatchObject(cloned);
  expect(cloned, 'clone result has the same properties').toMatchObject(result);
  for (let key of Object.keys(result)) {
    expect(cloned, 'cloned has same property').toHaveProperty(key);
  }
  for (let key of Object.keys(cloned)) {
    expect(result, 'created has same property').toHaveProperty(key);
  }
});

test('createTake() matches cloneTake()', () => {
  const result = createShot('test-take');
  const cloned = cloneShot({}, result);
  expect(result, 'create result has the same properties').toMatchObject(cloned);
  expect(cloned, 'clone result has the same properties').toMatchObject(result);
  for (let key of Object.keys(result)) {
    expect(cloned, 'cloned has same property').toHaveProperty(key);
  }
  for (let key of Object.keys(cloned)) {
    expect(result, 'created has same property').toHaveProperty(key);
  }
});
