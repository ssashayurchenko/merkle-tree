const MerkleTree = require("./MerkleTree");

test("return correct index", () => {
  const data = ["item1", "item2", "item3"];
  const tree = new MerkleTree(data);
  const proof = tree.getProof(2);
  const root = tree.getRoot();
  expect(MerkleTree.verifyProof("item3", proof, root)).toBe(true);
});
